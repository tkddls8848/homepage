#!/usr/bin/env node
/**
 * 기존 사이트의 images 폴더들을 src/images/ 하나로 합칩니다.
 *
 *   npm run import:images -- <폴더1> [폴더2] ...
 *
 * 예) 기존 사이트를 내려받아 두 개의 images 폴더가 있는 경우
 *   npm run import:images -- ~/old-site/images ~/old-site/kr/product/images
 *
 * 기존 사이트는 이미지 루트가 두 군데였습니다.
 *   - 사이트 최상위 images/  → logo/, icon/
 *   - 페이지 폴더 images/    → photo/
 * 두 폴더의 하위 구조(logo/, icon/, photo/)를 그대로 유지한 채 합치면
 * 템플릿이 참조하는 경로와 일치합니다.
 *
 * 합친 뒤에는 catalog.js / hero.js 가 참조하는 경로가 실제로 있는지 검사해
 * 누락된 파일을 알려줍니다.
 */
import { cp, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import catalog from "../src/_data/catalog.js";
import hero from "../src/_data/hero.js";

const DEST = path.resolve("src/images");
const sources = process.argv.slice(2).filter((a) => !a.startsWith("-"));

function usage() {
  console.log(`
사용법: npm run import:images -- <폴더1> [폴더2] ...

  기존 사이트의 images 폴더 경로를 넘기면 src/images/ 로 합칩니다.
  하위 구조(logo/, icon/, photo/)는 그대로 유지됩니다.

  예)
    npm run import:images -- ./old-site/images ./old-site/product/images

  폴더를 넘기지 않으면 지금 어떤 파일이 있고 없는지만 검사합니다.
`);
}

/** 템플릿이 실제로 참조하는 경로 목록 */
function expectedAssets() {
  const list = new Set(["/images/logo/logo.svg", "/images/logo/logo_wt.svg"]);
  for (const slide of hero) if (slide.image) list.add(slide.image);
  for (const page of catalog) {
    for (const group of page.groups || []) {
      for (const item of group.items || []) {
        if (item.image) list.add(item.image);
      }
    }
  }
  return [...list].sort();
}

async function mergeFrom(source) {
  const abs = path.resolve(source);
  if (!existsSync(abs)) {
    console.error(`  ✗ 폴더를 찾을 수 없습니다: ${abs}`);
    return 0;
  }
  const info = await stat(abs);
  if (!info.isDirectory()) {
    console.error(`  ✗ 폴더가 아닙니다: ${abs}`);
    return 0;
  }
  if (abs === DEST) {
    console.error("  ✗ 대상과 같은 폴더입니다. 건너뜁니다.");
    return 0;
  }

  const entries = await readdir(abs, { withFileTypes: true });
  let copied = 0;
  for (const entry of entries) {
    // 문서 파일은 옮기지 않습니다.
    if (/^(readme|\.ds_store|thumbs\.db)/i.test(entry.name)) continue;
    await cp(path.join(abs, entry.name), path.join(DEST, entry.name), {
      recursive: true,
      force: true,
    });
    copied += 1;
  }
  console.log(`  ✓ ${abs} → src/images/ (최상위 항목 ${copied}개)`);
  return copied;
}

// ── 실행 ────────────────────────────────────────────────────────────────
await mkdir(DEST, { recursive: true });

if (sources.length === 0) {
  usage();
  console.log("현재 상태만 검사합니다.\n");
} else {
  console.log("이미지 폴더를 합칩니다.");
  for (const source of sources) await mergeFrom(source);
  console.log();
}

const expected = expectedAssets();
const missing = expected.filter((p) => !existsSync(path.join(DEST, p.replace(/^\/images\//, ""))));
const found = expected.length - missing.length;

console.log(`템플릿이 참조하는 이미지 ${expected.length}개 중 ${found}개 확인됨.`);

if (missing.length) {
  console.log(`\n아직 없는 파일 (${missing.length}개):`);
  for (const item of missing) console.log(`  - src/images${item.replace(/^\/images/, "")}`);
  console.log(`
이미지가 없어도 사이트는 정상 동작합니다 (제품 카드는 "이미지 준비중",
슬라이드는 그라디언트 배경, 로고는 회사명 텍스트로 대체됩니다).
파일명이 다르면 src/_data/catalog.js 의 image 값을 실제 파일명으로 고치세요.`);
  process.exitCode = 0;
} else {
  console.log("\n✓ 참조된 이미지가 모두 준비되었습니다.");
}
