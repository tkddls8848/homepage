// 본문 폰트(Noto Sans KR)를 자체 호스팅용 woff2 서브셋으로 만든다.
//
// Google Fonts에서 받으면 한글 페이지 하나가 서브셋 수십 개를 제3자 도메인에서
// 내려받는다(홈 기준 요청 33개, 184~552KB). 사이트가 실제로 쓰는 글자만 담은
// 가변 폰트 한 벌이면 같은 화면을 70KB 남짓으로 그린다.
//
// 산출물은 두 벌이다.
//   noto-sans-kr      빌드 결과에 실제로 나온 글자. 거의 모든 방문이 이것만 받는다.
//   noto-sans-kr-ext  KS X 1001 완성형 2350자 중 앞엣것에 없는 나머지. main.css의
//                     --font-sans 대체 순서상 core로 못 그리는 글자가 나올 때만 요청된다.
//
// 빌드마다 돌리지 않는다. 원본을 네트워크로 받아야 하고 결과는 저장소에 커밋한다.
// 본문에 새 글자가 생기면 다시 실행한다. 빌드(lib/fonts.js)가 누락을 알려 준다.
//
// 사용법: npm run build:only && npm run build:fonts

import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import subsetFont from "subset-font";
import { toRanges, usedCharacters } from "../lib/fonts.js";

const SOURCE_URL =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf";
const LICENSE_URL =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanskr/OFL.txt";

const CACHE_DIR = ".cache/fonts";
const OUTPUT_DIR = "src/assets/fonts";
const DATA_FILE = "src/_data/fonts.json";
const STYLESHEET = "src/assets/css/main.css";

// main.css가 쓰는 굵기 범위. 그 밖의 굵기는 잘라 낸다.
const WEIGHT_RANGE = { min: 400, max: 600 };

// 한글은 미리 조합된 음절이라 치환이 필요 없지만 라틴 문자의 커닝·합자는 남긴다.
// 전부 버리면 4KB가 더 줄지만 영문 자간이 눈에 띄게 벌어진다.
const KEEP_FEATURES = ["kern", "liga", "calt", "ccmp", "locl"];

async function download(url, cacheName) {
  const cached = path.join(CACHE_DIR, cacheName);
  try {
    return await readFile(cached);
  } catch {
    process.stdout.write(`내려받는 중: ${cacheName}\n`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url} → HTTP ${response.status}`);
    const body = Buffer.from(await response.arrayBuffer());
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(cached, body);
    return body;
  }
}

// KS X 1001 완성형 한글 2350자. CP949 2바이트 완성형 영역을 되짚어 얻는다.
function ksx1001Syllables() {
  const decoder = new TextDecoder("euc-kr", { fatal: true });
  const syllables = new Set();
  for (let lead = 0xb0; lead <= 0xc8; lead += 1) {
    for (let trail = 0xa1; trail <= 0xfe; trail += 1) {
      try {
        syllables.add(decoder.decode(Uint8Array.from([lead, trail])));
      } catch {
        // 완성형에 배정되지 않은 자리.
      }
    }
  }
  return syllables;
}

async function build(source, characters, name) {
  const subset = await subsetFont(source, [...characters].join(""), {
    targetFormat: "woff2",
    variationAxes: { wght: WEIGHT_RANGE },
    keepFeatures: KEEP_FEATURES,
    noHinting: true,
  });
  const hash = createHash("sha256").update(subset).digest("hex").slice(0, 8);
  const file = `${name}.${hash}.woff2`;
  await writeFile(path.join(OUTPUT_DIR, file), subset);
  process.stdout.write(
    `${file}: ${characters.size}자, ${(subset.length / 1024).toFixed(1)} KB\n`
  );
  return { file, size: subset.length };
}

// 파일명에 내용 해시가 들어가므로 지난 해시의 파일은 남겨 두지 않는다.
async function removeStale(keep) {
  for (const entry of await readdir(OUTPUT_DIR)) {
    if (entry.endsWith(".woff2") && !keep.includes(entry)) {
      await rm(path.join(OUTPUT_DIR, entry));
    }
  }
}

// main.css의 @font-face가 가리키는 파일명을 새 해시로 맞춘다. main.css 자체는
// assetUrl 필터가 내용 해시로 버전을 붙이므로 캐시는 알아서 갱신된다.
async function rewriteStylesheet(files) {
  let css = await readFile(STYLESHEET, "utf8");
  for (const [name, file] of Object.entries(files)) {
    const pattern = new RegExp(`(\\.\\./fonts/)${name}\\.[0-9a-f]+\\.woff2`, "g");
    if (!pattern.test(css)) throw new Error(`${STYLESHEET}에서 ${name} @font-face를 찾지 못했습니다.`);
    css = css.replace(pattern, `$1${file}`);
  }
  await writeFile(STYLESHEET, css);
}

const source = await download(SOURCE_URL, "NotoSansKR-wght.ttf");
await mkdir(OUTPUT_DIR, { recursive: true });

// SIL Open Font License는 폰트를 재배포할 때 라이선스를 함께 두도록 한다.
await writeFile(path.join(OUTPUT_DIR, "OFL.txt"), await download(LICENSE_URL, "OFL.txt"));

const core = await usedCharacters().catch(() => {
  throw new Error("_site/ 가 없습니다. 먼저 `npm run build:only` 를 실행하세요.");
});
const extended = new Set([...ksx1001Syllables()].filter((c) => !core.has(c)));

const built = {
  "noto-sans-kr": await build(source, core, "noto-sans-kr"),
  "noto-sans-kr-ext": await build(source, extended, "noto-sans-kr-ext"),
};

await removeStale(Object.values(built).map((entry) => entry.file));
await rewriteStylesheet(
  Object.fromEntries(Object.entries(built).map(([name, entry]) => [name, entry.file]))
);

// 커버리지는 구간이 수백 개라 한 줄에 하나씩 적어 diff를 읽을 수 있게 둔다.
const ranges = toRanges(new Set([...core, ...extended]))
  .map((range) => `    [${range[0]}, ${range[1]}]`)
  .join(",\n");

await writeFile(
  DATA_FILE,
  `{\n  "preload": "/assets/fonts/${built["noto-sans-kr"].file}",\n` +
    `  "coverage": [\n${ranges}\n  ]\n}\n`
);

process.stdout.write(
  `첫 방문이 받는 분량: ${(built["noto-sans-kr"].size / 1024).toFixed(1)} KB\n`
);
