import { writeFileSync } from "node:fs";
import path from "node:path";

const MODEL = "@cf/ibm-granite/granite-4.0-h-micro";
const POSTS_DIR = path.resolve("src/blog/posts");
const FEEDS = [
  { url: "https://rss.etnews.com/Section901.xml", publisher: "전자신문" },
  { url: "https://rss.etnews.com/Section903.xml", publisher: "전자신문" },
];
const KEYWORDS = [
  "서버", "스토리지", "데이터센터", "클라우드", "온프레미스", "가상화", "컨테이너",
  "쿠버네티스", "백업", "재해복구", "이중화", "인프라", "네트워크", "보안", "개인정보",
  "랜섬웨어", "GPU", "AI 반도체", "반도체", "HPC", "슈퍼컴퓨터", "리눅스", "유닉스",
  "데이터베이스", "DBMS", "IBM", "레노버", "Lenovo", "델테크놀로지스", "Dell",
  "엔비디아", "NVIDIA", "인텔", "AMD", "오라클", "VM웨어", "SI", "전산", "IT장비",
];

const requiredEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`환경 변수 ${name}가 필요합니다.`);
  return value;
};

const text = (value) =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .trim();

const pick = (xml, tag) => {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? text(match[1]) : "";
};

async function collectArticles() {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const batches = await Promise.all(
    FEEDS.map(async (feed) => {
      const response = await fetch(feed.url, {
        signal: AbortSignal.timeout(30000),
        headers: {
          "User-Agent": "trialinfo-homepage-bot/1.0 (+https://www.trialinfo.com)",
          Accept: "application/rss+xml, application/xml, text/xml",
        },
      });
      if (!response.ok) throw new Error(`RSS HTTP ${response.status}: ${feed.url}`);

      const xml = await response.text();
      return (xml.match(/<item[\s\S]*?<\/item>/gi) || []).map((item) => ({
        title: pick(item, "title"),
        url: pick(item, "link"),
        publisher: feed.publisher,
        at: Date.parse(pick(item, "pubDate")) || Date.now(),
      }));
    })
  );

  const seen = new Set();
  return batches
    .flat()
    .filter((article) => {
      if (!article.title || !article.url || article.at < cutoff || seen.has(article.url)) {
        return false;
      }
      const title = article.title.toLowerCase();
      if (!KEYWORDS.some((keyword) => title.includes(keyword.toLowerCase()))) return false;
      seen.add(article.url);
      return true;
    })
    .sort((a, b) => b.at - a.at)
    .slice(0, 8);
}

function prompt(articles) {
  const headlines = articles
    .map((article, index) => `${index + 1}. ${article.title} (${article.publisher})`)
    .join("\n");

  return `최근 일주일 IT 인프라 기사 제목입니다.

${headlines}

기업 실무 담당자에게 필요한 흐름을 해석하는 600~900자 한국어 글을 쓰세요.
- 기사 본문을 요약하거나 특정 회사를 홍보하지 마세요.
- 제목만으로 확인할 수 없는 수치·날짜·제품명·관계는 쓰지 마세요.
- 소제목(##)은 2~3개, 결론 절과 본문 제목(#)은 쓰지 마세요.

아래 형식만 출력하세요.
TITLE: 제목 한 줄
SUMMARY: 요약 한 줄

본문 Markdown`;
}

async function generate(articles) {
  const accountId = requiredEnv("CF_ACCOUNT_ID");
  const token = requiredEnv("CF_API_TOKEN");
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "당신은 확인되지 않은 사실을 쓰지 않는 한국어 IT 인프라 블로그 필자입니다.",
          },
          { role: "user", content: prompt(articles) },
        ],
        max_tokens: 1500,
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(180000),
    }
  );
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.errors?.map((error) => error.message).join(", ") || `HTTP ${response.status}`);
  }

  const generated = json.result.response?.trim();
  if (!generated) throw new Error("Workers AI 응답에 본문이 없습니다.");
  if (json.result.usage) {
    console.log(
      `토큰: 입력 ${json.result.usage.prompt_tokens} / 출력 ${json.result.usage.completion_tokens}`
    );
  }
  return generated;
}

function saveDraft(generated, articles) {
  const match = generated.match(/^TITLE:\s*(.+)\r?\nSUMMARY:\s*(.+)\r?\n+([\s\S]+)$/);
  if (!match) throw new Error("Workers AI가 TITLE/SUMMARY 출력 형식을 지키지 않았습니다.");

  const [, title, summary, body] = match;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
  const stamp = today.replaceAll("-", "");
  const file = path.join(POSTS_DIR, `ai-draft-${stamp}.md`);
  const yaml = (value) => JSON.stringify(value);
  const markdown = [
    "---",
    `title: ${yaml(title.trim())}`,
    `date: ${today}`,
    `summary: ${yaml(summary.trim())}`,
    "topics: [업계 소식]",
    "aiDraft: true",
    "draft: true",
    "sources:",
    ...articles.flatMap((article) => [
      `  - title: ${yaml(article.title)}`,
      `    url: ${yaml(article.url)}`,
      `    publisher: ${yaml(article.publisher)}`,
    ]),
    "---",
    "",
    body.trim(),
    "",
  ].join("\n");

  writeFileSync(file, markdown, { encoding: "utf8", flag: "wx" });
  return file;
}

console.log("기사 수집 중…");
const articles = await collectArticles();
if (!articles.length) {
  console.log("관련 기사가 없어 초안을 만들지 않았습니다.");
  process.exit(0);
}

console.log(`기사 ${articles.length}건으로 초안 생성 중…`);
const file = saveDraft(await generate(articles), articles);
console.log(`초안 저장: ${path.relative(process.cwd(), file)}`);
