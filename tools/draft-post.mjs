/**
 * IBM watsonx.ai 로 기술 블로그 초안을 만듭니다.
 *
 *   node tools/draft-post.mjs
 *
 * 흐름
 *   1. 지정한 RSS 피드에서 최근 IT 인프라 기사의 제목·링크·발행일을 모읍니다.
 *   2. 그 목록(제목과 링크만)을 watsonx.ai 에 보내 한국어 초안을 받습니다.
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
 * 필요한 환경 변수 (GitHub Secrets)
 *   WATSONX_API_KEY     IBM Cloud IAM API 키
 *   WATSONX_PROJECT_ID  watsonx.ai 프로젝트 ID
 *   WATSONX_URL         지역 엔드포인트 (예: https://us-south.ml.cloud.ibm.com)
 *   WATSONX_MODEL_ID    (선택) 기본값은 아래 DEFAULT_MODEL
 */
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const POSTS_DIR = path.resolve("src/blog/posts");
const DEFAULT_MODEL = "ibm/granite-3-8b-instruct";
const IAM_URL = "https://iam.cloud.ibm.com/identity/token";

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

const env = (name, required = true) => {
  const value = process.env[name];
  if (required && !value) throw new Error(`환경 변수 ${name} 가 필요합니다.`);
  return value;
};

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

  for (const feed of FEEDS) {
    let kept = 0;
    let total = 0;
    try {
      const res = await fetch(feed.url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) {
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
      console.warn(`  피드 오류: ${feed.url} — ${error.message}`);
      continue;
    }
    console.log(`  ${feed.publisher}: ${total}건 중 ${kept}건 해당`);
  }

  return articles.sort((a, b) => b.at - a.at).slice(0, MAX_ARTICLES);
}

/* ── 2. watsonx.ai 호출 ─────────────────────────────────────────────────── */
async function getAccessToken(apiKey) {
  const res = await fetch(IAM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: apiKey,
    }),
  });
  if (!res.ok) throw new Error(`IAM 토큰 발급 실패: HTTP ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

function buildPrompt(articles) {
  const list = articles.map((a, i) => `${i + 1}. ${a.title} (${a.publisher})`).join("\n");

  return `당신은 IT 인프라 전문기업 "(주)트라이얼정보통신"의 기술 블로그 필자입니다.
이 회사는 IBM·Lenovo·Dell 서버와 스토리지를 공급하고, IT 인프라 컨설팅·구축·유지보수를 합니다.

아래는 최근 일주일 업계 기사 제목입니다.

${list}

이 제목들을 참고해 한국어 기술 블로그 글의 초안을 쓰세요. 규칙:

- 기사 본문을 옮기거나 요약하지 마세요. 제목에서 읽히는 흐름만 참고해, 회사의 시각에서 새로 쓰세요.
- 확실하지 않은 수치·날짜·제품명은 쓰지 마세요. 모르면 쓰지 않는 편이 낫습니다.
- 서버·스토리지 도입을 검토하는 기업 담당자가 읽는다고 생각하고, 그들에게 무엇이 중요한지 짚으세요.
- 홍보 문구나 과장된 표현은 쓰지 마세요.
- 분량은 600~900자. 소제목 2~3개를 ## 로 넣으세요.
- 출력은 본문 Markdown 만. 제목(h1)이나 머리말은 넣지 마세요.

첫 줄에 "TITLE: " 로 시작하는 글 제목 한 줄, 둘째 줄에 "SUMMARY: " 로 시작하는 한 줄 요약을 쓰고,
빈 줄 뒤부터 본문을 쓰세요.`;
}

async function generate(articles) {
  const apiKey = env("WATSONX_API_KEY");
  const projectId = env("WATSONX_PROJECT_ID");
  const baseUrl = env("WATSONX_URL").replace(/\/+$/, "");
  const modelId = process.env.WATSONX_MODEL_ID || DEFAULT_MODEL;

  const token = await getAccessToken(apiKey);

  const res = await fetch(`${baseUrl}/ml/v1/text/generation?version=2024-05-31`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      model_id: modelId,
      project_id: projectId,
      input: buildPrompt(articles),
      parameters: {
        decoding_method: "greedy",
        max_new_tokens: 1200,
        min_new_tokens: 200,
        repetition_penalty: 1.05,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`watsonx.ai 호출 실패: HTTP ${res.status} ${await res.text()}`);
  }

  const json = await res.json();
  const text = json?.results?.[0]?.generated_text;
  if (!text) throw new Error("watsonx.ai 응답에 생성된 텍스트가 없습니다.");
  return text.trim();
}

/* ── 3. 초안 파일로 저장 ─────────────────────────────────────────────────── */
const yamlString = (s) => `"${String(s).replace(/"/g, '\\"')}"`;

function saveDraft(generated, articles) {
  const lines = generated.split("\n");
  const titleLine = lines.find((l) => l.startsWith("TITLE:"));
  const summaryLine = lines.find((l) => l.startsWith("SUMMARY:"));

  const title = titleLine ? titleLine.replace("TITLE:", "").trim() : "제목을 붙여 주세요";
  const summary = summaryLine ? summaryLine.replace("SUMMARY:", "").trim() : "";

  const bodyStart = Math.max(
    lines.indexOf(titleLine ?? ""),
    lines.indexOf(summaryLine ?? "")
  );
  const body = lines.slice(bodyStart + 1).join("\n").trim();

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

console.log("watsonx.ai 로 초안 생성 중…");
const generated = await generate(articles);

const file = saveDraft(generated, articles);
console.log(`\n초안을 저장했습니다: ${path.relative(process.cwd(), file)}`);
console.log("draft: true 상태라 사이트에는 나오지 않습니다. 검토 후 그 줄을 지우세요.");
