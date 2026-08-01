/**
 * IBM Bob (Bob Shell) 로 기술 블로그 초안을 만듭니다.
 *
 *   node tools/draft-post.mjs
 *
 * 흐름
 *   1. 지정한 RSS 피드에서 최근 IT 인프라 기사의 제목·링크·발행일을 모읍니다.
 *   2. 그 목록(제목과 링크만)을 Bob Shell 에 넘겨 한국어 초안을 받습니다.
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
 * ⚠️ Bob 은 텍스트 생성 API 가 아니라 에이전트입니다. 파일을 읽고 쓰고 명령을
 *    실행할 수 있으므로, 저장소가 아니라 **빈 임시 디렉터리**에서 실행합니다.
 *    글 파일은 Bob 이 아니라 이 스크립트가 직접 씁니다. 에이전트가 저장소를
 *    임의로 고치는 경로를 아예 만들지 않기 위한 것입니다.
 *
 * 필요한 환경 변수 (GitHub Secrets)
 *   BOBSHELL_API_KEY   IBM Bob API 키
 *   BOBSHELL_BIN       (선택) 실행 파일 경로. 기본값 "bob"
 */
import { writeFileSync, existsSync, mkdirSync, mkdtempSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import path from "node:path";

const execFileAsync = promisify(execFile);
const POSTS_DIR = path.resolve("src/blog/posts");

/** Bob 이 응답을 만드는 데 줄 최대 시간 */
const BOB_TIMEOUT_MS = 5 * 60 * 1000;

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

/* ── 2. Bob Shell 호출 ──────────────────────────────────────────────────── */
function buildPrompt(articles) {
  const list = articles.map((a, i) => `${i + 1}. ${a.title} (${a.publisher})`).join("\n");

  return `이것은 글쓰기 작업입니다. 코드 작업이 아닙니다.
파일을 만들거나 고치지 말고, 명령을 실행하지 말고, 웹을 검색하지 마세요.
아래 요청에 대한 글만 그대로 출력하면 됩니다.

당신은 IT 인프라 전문기업 "(주)트라이얼정보통신"의 기술 블로그 필자입니다.
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

/** 터미널 색상 코드 제거. Bob Shell 출력에 섞여 들어옵니다. */
// eslint-disable-next-line no-control-regex
const stripAnsi = (s) => s.replace(/\u001B\[[0-9;]*[A-Za-z]/g, "");

async function generate(articles) {
  // 키 자체는 Bob 이 환경 변수에서 직접 읽습니다. 여기서는 있는지만 확인해,
  // 없을 때 Bob 의 낯선 오류 대신 알아보기 쉬운 메시지를 내보냅니다.
  env("BOBSHELL_API_KEY");

  const bin = process.env.BOBSHELL_BIN || "bob";

  /*
   * 저장소가 아니라 빈 임시 디렉터리에서 실행합니다.
   * Bob 은 에이전트라 실행 위치의 파일을 읽고 고칠 수 있습니다. 초안 글을
   * 받아오는 것이 목적이므로, 애초에 건드릴 것이 없는 곳에서 돌립니다.
   */
  const cwd = mkdtempSync(path.join(tmpdir(), "bob-draft-"));

  let stdout;
  try {
    // 인자를 배열로 넘기므로 셸 인용 문제가 없습니다(프롬프트에 따옴표·줄바꿈이
    // 들어가도 그대로 전달됩니다).
    ({ stdout } = await execFileAsync(
      bin,
      ["--auth-method", "api-key", "-p", buildPrompt(articles)],
      { cwd, timeout: BOB_TIMEOUT_MS, maxBuffer: 10 * 1024 * 1024 }
    ));
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(
        `Bob Shell 실행 파일을 찾지 못했습니다 ("${bin}").\n` +
          "설치: curl -fsSL https://bob.ibm.com/download/bobshell.sh | bash\n" +
          "다른 경로에 있으면 BOBSHELL_BIN 환경 변수로 지정하세요."
      );
    }
    throw new Error(`Bob Shell 실행 실패: ${error.message}`);
  }

  const text = stripAnsi(stdout).trim();
  if (!text) throw new Error("Bob Shell 이 아무 내용도 돌려주지 않았습니다.");
  return text;
}

/* ── 3. 초안 파일로 저장 ─────────────────────────────────────────────────── */
const yamlString = (s) => `"${String(s).replace(/"/g, '\\"')}"`;

function saveDraft(generated, articles) {
  const lines = generated.split("\n");

  /*
   * Bob 은 에이전트라 배너나 진행 상황을 먼저 찍을 수 있고, 줄 앞에 공백이
   * 붙기도 합니다. 인덱스를 직접 찾아 두어야 합니다 — 값으로 indexOf 를 하면
   * 표시가 없을 때 빈 문자열을 찾아 엉뚱한 빈 줄을 가리킵니다.
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

console.log("IBM Bob 으로 초안 생성 중…");
const generated = await generate(articles);

const file = saveDraft(generated, articles);
console.log(`\n초안을 저장했습니다: ${path.relative(process.cwd(), file)}`);
console.log("draft: true 상태라 사이트에는 나오지 않습니다. 검토 후 그 줄을 지우세요.");
