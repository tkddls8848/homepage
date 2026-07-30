#!/usr/bin/env node
/**
 * 빌드 결과(_site)의 내부 링크와 이미지 경로가 실제 파일과 맞는지 검사합니다.
 *
 *   npm run build && npm run check:links
 *
 * 외부(http) 링크는 검사하지 않습니다. 존재하지 않는 이미지는 경고로만
 * 표시합니다(사진 에셋을 아직 넣지 않은 상태에서도 빌드는 성공해야 하므로).
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve("_site");

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/** /about/ → _site/about/index.html 같은 해석 */
function resolveTarget(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean || clean.startsWith("//")) return null;
  const target = path.join(ROOT, decodeURIComponent(clean));
  if (existsSync(target)) return target;
  if (clean.endsWith("/") && existsSync(path.join(target, "index.html"))) {
    return path.join(target, "index.html");
  }
  if (existsSync(`${target}.html`)) return `${target}.html`;
  return null;
}

if (!existsSync(ROOT)) {
  console.error("_site 가 없습니다. 먼저 `npm run build` 를 실행하세요.");
  process.exit(1);
}

const files = (await walk(ROOT)).filter((f) => f.endsWith(".html"));
const brokenLinks = [];
const missingImages = [];

for (const file of files) {
  const html = await readFile(file, "utf8");
  const rel = path.relative(ROOT, file);

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue;
    if (!resolveTarget(href)) brokenLinks.push(`${rel} → ${href}`);
  }

  for (const match of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    const src = match[1];
    if (/^(https?:|data:)/.test(src)) continue;
    if (!resolveTarget(src)) missingImages.push(`${rel} → ${src}`);
  }
}

console.log(`검사한 HTML 파일: ${files.length}개`);

if (missingImages.length) {
  console.log(`\n⚠ 아직 배치되지 않은 이미지 (${missingImages.length}개)`);
  console.log("  docs/ASSETS.md 를 참고해 src/images/ 에 넣어 주세요.");
  for (const item of [...new Set(missingImages)]) console.log(`  - ${item}`);
}

if (brokenLinks.length) {
  console.error(`\n✗ 깨진 내부 링크 (${brokenLinks.length}개)`);
  for (const item of [...new Set(brokenLinks)]) console.error(`  - ${item}`);
  process.exit(1);
}

console.log("\n✓ 내부 링크 이상 없음");
