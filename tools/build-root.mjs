#!/usr/bin/env node
import { cp, mkdir, rename } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

// 도메인 루트(/)는 개인 소개 페이지(site/)가, /trialinfo/ 는 보관된 회사 홈페이지가 쓴다.
// trialinfo 빌드가 먼저 _site/trialinfo/ 를 만든 뒤 이 스크립트가 실행된다.

const OUT = path.resolve("_site");
const ARCHIVE = path.join(OUT, "trialinfo");

if (!existsSync(ARCHIVE)) {
  console.error("_site/trialinfo/ 가 없습니다. 먼저 `npm run build:trialinfo` 를 실행하세요.");
  process.exit(1);
}

// 루트 정적 파일(index.html, 404.html, _redirects)을 그대로 복사한다.
await cp("site", OUT, { recursive: true });

// 브라우저·크롤러·Cloudflare Pages가 도메인 루트에서만 찾는 파일들.
// 아직 루트 사이트가 따로 만들지 않으므로 trialinfo 빌드가 만든 것을 끌어올린다.
for (const file of ["_headers", "robots.txt", ".well-known/security.txt"]) {
  const from = path.join(ARCHIVE, file);
  const to = path.join(OUT, file);
  await mkdir(path.dirname(to), { recursive: true });
  await rename(from, to);
}

console.log("루트 파일 배치 완료");
