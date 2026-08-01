/**
 * Cloudflare Workers AI 의 IBM Granite 로 기술 블로그 초안을 만듭니다.
 *
 *   node tools/draft-post.mjs
 *
 * 흐름
 *   1. 지정한 RSS 피드에서 최근 IT 인프라 기사의 제목·링크·발행일을 모읍니다.
 *   2. 그 목록(제목과 링크만)을 Granite 에 넘겨 한국어 초안을 받습니다.
 *   3. src/blog/posts/ 에 draft: true 인 Markdown 파일로 저장합니다.
 *
 * 저장된 글은 draft: true 라서 사이트에 나오지 않습니다. 사람이 읽고 고친 뒤
 * draft 를 지워야 발행됩니다(posts.11tydata.js 참고).
 *
 * ⚠️ 기사 본문을 모델에 넣지 않고 제목·링크만 넘깁니다.
 *    기사 본문을 요약해 옮기면 저작권 문제가 될 수 있어서, 모델에게는
 *    "무슨 일이 있었는지"만 알려 주고 회사 관점의 글을 새로 쓰게 합니다.
 *    참고한 기사는 본문에 옮기지 않고 원문 링크로만 남깁니다.
 *
 * 왜 Cloudflare 인가:
 * Granite 는 IBM 이 Apache 2.0 으로 공개한 모델이고, Cloudflare Workers AI 가
 * 이를 호스팅합니다. 모델을 내려받아 돌리지 않으므로 실행하는 쪽(로컬이든
 * CI 든)에 부담이 없고, 무료 한도(하루 10,000 Neurons)가 주 1회 초안 생성에는
 * 넉넉합니다.
 *
 * 필요한 환경 변수 (GitHub Secrets)
 *   CF_ACCOUNT_ID   Cloudflare 계정 ID
 *   CF_API_TOKEN    Workers AI 권한을 가진 API 토큰
 *   CF_AI_MODEL     (선택) 기본값은 아래 DEFAULT_MODEL
 */
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const POSTS_DIR = path.resolve("src/blog/posts");

/** Cloudflare Workers AI 가 호스팅하는 IBM Granite. */
const DEFAULT_MODEL = "@cf/ibm-granite/granite-4.0-h-micro";

const GENERATE_TIMEOUT_MS = 3 * 60 * 1000;

const env = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`환경 변수 ${name} 가 필요합니다.`);
  return value;
};

/**
 * 어떤 기사를 모을지.
 *
 * 전자신문은 IT 전용 RSS 를 제공하지 않고 종합 피드만 있습니다. 그래서
 * 아래 KEYWORDS 로 걸러 냅니다. 다른 매체의 IT 전용 피드를 찾으면 여기에
 * 추가하세요. (URL 이 바뀌면 조용히 0건이 되므로, 실행 로그에 매체별 수집
 * 건수가 찍힙니다.)
 */
const FEEDS = [
  { url: "https://rss.etnews.com/Section901.xml", publisher: "전자신문" },
  { url: "https://rss.etnews.com/Section903.xml", publisher: "전자신문" },
];

/**
 * 제목에 이 중 하나라도 있어야 후보로 봅니다.
 * 회사가 다루는 분야(서버·스토리지·인프라)에 맞춰 조정하세요.
 * 너무 넓히면 연예·정치 기사가 섞이고, 너무 좁히면 아무것도 안 걸립니다.
 */
const KEYWORDS = [
  "서버", "스토리지", "데이터센터", "클라우드", "온프레미스", "가상화", "컨테이너",
  "쿠버네티스", "백업", "재해복구", "이중화", "인프라", "네트워크", "보안", "개인정보",
  "랜섬웨어", "GPU", "AI 반도체", "반도체", "HPC", "슈퍼컴퓨터", "리눅스", "유닉스",
  "데이터베이스", "DBMS", "IBM", "레노버", "Lenovo", "델테크놀로지스", "Dell",
  "엔비디아", "NVIDIA", "인텔", "AMD", "오라클", "VM웨어", "SI", "전산", "IT장비",
];

/** 초안 하나에 참고할 기사 수. 너무 많으면 글이 나열식이 됩니다. */
const MAX_ARTICLES = 8;

/** 며칠 이내 기사만 볼지 */
const WINDOW_DAYS = 7;

/* ── 1. 기사 수집 ────────────────────────────────────────────────────────
   의존성을 늘리지 않으려고 정규식으로 읽습니다. RSS 는 구조가 단순해서
   제목·링크·날짜만 뽑는 데는 충분합니다. 형식이 어긋난 피드는 건너뜁니다. */
const stripTags = (s) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

const pick = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? stripTags(m[1]) : "";
};

const isRelevant = (title) => {
  const lower = title.toLowerCase();
  return KEYWORDS.some((k) => lower.includes(k.toLowerCase()));
};

async function collectArticles() {
  const cutoff = Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const articles = [];
  const seen = new Set();
  let failed = 0;

  for (const feed of FEEDS) {
    let kept = 0;
    let total = 0;
    try {
      const res = await fetch(feed.url, {
        signal: AbortSignal.timeout(20000),
        // User-Agent 없이 오는 요청을 막는 서버가 많습니다. 브라우저인 척하는
        // 것이 아니라, 누가 왜 가져가는지 밝히는 값입니다.
        headers: {
          "User-Agent": "trialinfo-homepage-bot/1.0 (+https://www.trialinfo.com)",
          Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        },
      });
      if (!res.ok) {
        failed++;
        console.warn(`  피드를 읽지 못했습니다 (HTTP ${res.status}): ${feed.url}`);
        continue;
      }
      const xml = await res.text();
      const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
      total = items.length;

      for (const item of items) {
        const title = pick(item, "title");
        const link = pick(item, "link");
        const pubDate = pick(item, "pubDate");
        if (!title || !link) continue;

        // 같은 기사가 여러 피드(오늘의 뉴스·인기기사)에 겹쳐 나옵니다.
        if (seen.has(link)) continue;

        const at = pubDate ? Date.parse(pubDate) : Date.now();
        if (Number.isFinite(at) && at < cutoff) continue;
        if (!isRelevant(title)) continue;

        seen.add(link);
        articles.push({ title, url: link, publisher: feed.publisher, at });
        kept++;
      }
    } catch (error) {
      failed++;
      // Node 의 fetch 는 실패 사유를 error.cause 에 숨겨 둡니다. 이걸 안 찍으면
      // 로그에 "fetch failed" 만 남아 원인을 알 수 없습니다.
      const cause = error.cause?.code || error.cause?.message || "";
      console.warn(`  피드 오류: ${feed.url}\n    ${error.message}${cause ? ` (${cause})` : ""}`);
      continue;
    }
    console.log(`  ${feed.publisher}: ${total}건 중 ${kept}건 해당`);
  }

  /*
   * 피드가 전부 실패한 것과, 잘 읽었는데 해당 기사가 없는 것은 다릅니다.
   * 전자를 조용히 넘기면 피드 주소가 죽어도 워크플로가 계속 "성공" 으로
   * 끝나서 몇 주가 지나도 아무도 모릅니다.
   */
  if (failed === FEEDS.length) {
    throw new Error(
      `피드 ${FEEDS.length}개를 모두 읽지 못했습니다. 주소가 바뀌었거나 차단된 것일 수 있습니다.`
    );
  }

  return articles.sort((a, b) => b.at - a.at).slice(0, MAX_ARTICLES);
}

/* ── 2. Granite 호출 (Cloudflare Workers AI) ──────────────────────────────────────────────────── */
function buildPrompt(articles) {
  const list = articles.map((a, i) => `${i + 1}. ${a.title} (${a.publisher})`).join("\n");

  return `출력 형식을 반드시 지키세요. 다른 말은 덧붙이지 마세요.

TITLE: (여기에 글 제목 한 줄)
SUMMARY: (여기에 한 줄 요약)

(빈 줄 뒤부터 본문 Markdown. 구분선 --- 은 쓰지 마세요.)

당신은 IT 인프라 업계를 지켜보는 한국어 기술 블로그 필자입니다.
독자는 서버·스토리지 도입을 검토하는 기업의 실무 담당자입니다.

아래는 최근 일주일 업계 기사 제목입니다.

${list}

이 흐름을 보고 담당자가 알아둘 만한 점을 짚는 글을 쓰세요.

지켜야 할 것:
- **기사에 등장하는 회사·제품을 특정 회사가 공급하거나 제공한다고 쓰지 마세요.**
  기사 제목에 나온 이름은 그 기사 속 주체일 뿐입니다. 누가 무엇을 파는지
  당신은 모릅니다.
- 확실하지 않은 수치·날짜·제품명·기업명은 아예 쓰지 마세요. 모르면 빼세요.
- 특정 회사를 홍보하지 마세요. "최선을 다합니다", "지원합니다", "제공합니다"
  같은 표현을 쓰지 마세요. 업계를 관찰하고 해석하는 글입니다.
- 기사 본문을 옮기거나 요약하지 마세요. 제목에서 읽히는 흐름만 참고하세요.
- 소제목(##)은 2개 또는 3개까지만. 결론 절은 넣지 마세요.
- 분량은 600~900자.
- 제목(#)은 본문에 넣지 마세요. TITLE 줄에만 씁니다.`;
}

async function generate(articles) {
  const accountId = env("CF_ACCOUNT_ID");
  const token = env("CF_API_TOKEN");
  const model = process.env.CF_AI_MODEL || DEFAULT_MODEL;

  console.log(`  모델: ${model}`);

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "당신은 한국어로 글을 쓰는 IT 인프라 분야 기술 블로그 필자입니다. " +
              "요청받은 형식을 정확히 지키고, 확인되지 않은 사실은 쓰지 않습니다.",
          },
          { role: "user", content: buildPrompt(articles) },
        ],
        // 기본값 256 은 글 한 편에 턱없이 모자랍니다.
        max_tokens: 1500,
        // 낮출수록 지시를 잘 지킵니다. 초안이라 창의성보다 그쪽이 중요합니다.
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(GENERATE_TIMEOUT_MS),
    });
  } catch (error) {
    throw new Error(`Cloudflare Workers AI 호출에 실패했습니다: ${error.message}`);
  }

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    const detail = json?.errors?.map((e) => `${e.code} ${e.message}`).join(", ") || (await res.text().catch(() => ""));
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        `인증에 실패했습니다 (HTTP ${res.status}).\n` +
          "  CF_API_TOKEN 에 Workers AI 권한이 있는지, CF_ACCOUNT_ID 가 맞는지 확인하세요.\n" +
          `  응답: ${detail}`
      );
    }
    throw new Error(`Cloudflare Workers AI 오류: HTTP ${res.status} ${detail}`);
  }

  const text = (json.result?.response || "").trim();
  if (!text) throw new Error("Cloudflare Workers AI 응답이 비어 있습니다.");

  const used = json.result?.usage;
  if (used) {
    console.log(`  토큰: 입력 ${used.prompt_tokens ?? "?"} / 출력 ${used.completion_tokens ?? "?"}`);
  }
  return text;
}

/* ── 3. 초안 파일로 저장 ─────────────────────────────────────────────────── */
const yamlString = (s) => `"${String(s).replace(/"/g, '\\"')}"`;

function saveDraft(generated, articles) {
  const lines = generated.split("\n");

  /*
   * 모델이 표시 앞에 공백이나 군더더기를 붙이는 일이 흔합니다.
   * 인덱스를 직접 찾아 두어야 합니다 — 값으로 indexOf 를 하면 표시가 없을 때
   * 빈 문자열을 찾아 엉뚱한 빈 줄을 가리킵니다.
   */
  const findIndex = (marker) => lines.findIndex((l) => l.trimStart().startsWith(marker));
  const titleAt = findIndex("TITLE:");
  const summaryAt = findIndex("SUMMARY:");

  const after = (index, marker) =>
    index === -1 ? "" : lines[index].trimStart().slice(marker.length).trim();

  const title = after(titleAt, "TITLE:") || "제목을 붙여 주세요";
  const summary = after(summaryAt, "SUMMARY:");

  // 표시를 하나도 못 찾으면 출력 전체를 본문으로 봅니다(형식이 어긋나도
  // 내용을 잃지 않게). 사람이 검토하면서 제목·요약을 채우면 됩니다.
  const lastMarker = Math.max(titleAt, summaryAt);
  const body = (lastMarker === -1 ? lines : lines.slice(lastMarker + 1)).join("\n").trim();

  if (titleAt === -1 || summaryAt === -1) {
    console.warn("  ⚠️ 출력에서 TITLE/SUMMARY 를 찾지 못했습니다. 검토할 때 채워 주세요.");
  }

  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
  const file = path.join(POSTS_DIR, `${today}-ai-draft.md`);

  const frontMatter = [
    "---",
    `title: ${yamlString(title)}`,
    `date: ${today}`,
    `summary: ${yamlString(summary)}`,
    "topics: [업계 소식]",
    "aiDraft: true",
    "# 검토를 마치면 아래 draft 줄을 지우세요. 그전까지는 사이트에 나오지 않습니다.",
    "draft: true",
    "sources:",
    ...articles.flatMap((a) => [
      `  - title: ${yamlString(a.title)}`,
      `    url: ${yamlString(a.url)}`,
      `    publisher: ${yamlString(a.publisher)}`,
    ]),
    "---",
    "",
    body,
    "",
  ].join("\n");

  if (!existsSync(POSTS_DIR)) mkdirSync(POSTS_DIR, { recursive: true });
  writeFileSync(file, frontMatter, "utf8");
  return file;
}

/* ── 실행 ────────────────────────────────────────────────────────────────── */
console.log("기사 수집 중…");
const articles = await collectArticles();
console.log(`  ${articles.length}건`);

if (articles.length === 0) {
  console.log("최근 기사가 없어 초안을 만들지 않았습니다.");
  process.exit(0);
}

console.log("IBM Granite 로 초안 생성 중…");
const generated = await generate(articles);

const file = saveDraft(generated, articles);
console.log(`\n초안을 저장했습니다: ${path.relative(process.cwd(), file)}`);
console.log("draft: true 상태라 사이트에는 나오지 않습니다. 검토 후 그 줄을 지우세요.");
