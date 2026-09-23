import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { OUTPUT_DIR } from "./paths.js";

// 본문 폰트는 사이트가 실제로 쓰는 글자만 담아 자체 호스팅한다(tools/build-fonts.mjs).
// 글을 새로 올려 서브셋에 없는 글자가 생기면 그 글자만 시스템 폰트로 그려져
// 본문 중간에서 서체가 어긋난다. 눈에 잘 띄지 않으므로 빌드가 대신 짚어 준다.

const SITE_DIR = OUTPUT_DIR;
const SCRIPT_DIR = "src/assets/js";

// 본문에 안 보여도 깨지면 곤란한 글자들. 따옴표·말줄임표처럼 브라우저나
// 사용자 입력으로 들어올 수 있는 문장부호를 미리 넣어 둔다.
const BASELINE =
  Array.from({ length: 0x7f - 0x20 }, (_, i) => String.fromCodePoint(0x20 + i)).join("") +
  " ©®°±×÷–—‘’“”…·※→←↑↓■□●○★☆「」『』〈〉《》【】";

async function walk(directory, extension) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(target, extension)));
    else if (entry.name.endsWith(extension)) files.push(target);
  }
  return files;
}

// 빌드 결과 HTML과 브라우저 JavaScript에서 쓰인 글자를 모은다.
// HTML은 태그를 걷어내지 않고 통째로 읽는다. alt·aria-label처럼 속성에 들어간
// 한글을 놓치지 않기 위해서다. 마크업은 전부 ASCII라 서브셋이 커지지 않는다.
export async function usedCharacters(outputDir = SITE_DIR) {
  const files = [...(await walk(outputDir, ".html")), ...(await walk(SCRIPT_DIR, ".js"))];
  const characters = new Set(BASELINE);
  for (const file of files) {
    for (const character of await readFile(file, "utf8")) characters.add(character);
  }
  return characters;
}

// 코드포인트 집합을 연속 구간으로 접는다. 커버리지를 fonts.json에 담을 때 쓴다.
export function toRanges(characters) {
  const points = [...characters].map((c) => c.codePointAt(0)).sort((a, b) => a - b);
  const ranges = [];
  for (const point of points) {
    const last = ranges.at(-1);
    if (last && point === last[1] + 1) last[1] = point;
    else ranges.push([point, point]);
  }
  return ranges;
}

function covers(ranges, point) {
  let low = 0;
  let high = ranges.length - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (point < ranges[mid][0]) high = mid - 1;
    else if (point > ranges[mid][1]) low = mid + 1;
    else return true;
  }
  return false;
}

export default function fonts(eleventyConfig) {
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const { coverage } = JSON.parse(await readFile("src/_data/fonts.json", "utf8"));
    const characters = await usedCharacters(dir?.output ?? SITE_DIR);

    const missing = [...characters].filter((c) => !covers(coverage, c.codePointAt(0)));
    if (!missing.length) return;

    process.stderr.write(
      `[fonts] 서브셋에 없는 글자 ${missing.length}자: ${missing.slice(0, 40).join("")}` +
        `${missing.length > 40 ? "…" : ""}\n` +
        "[fonts] 해당 글자는 시스템 폰트로 그려집니다. `npm run build:fonts`로 서브셋을 다시 만드세요.\n"
    );
  });
}
