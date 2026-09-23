import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";

// CSS/JS는 파일명이 고정이라 캐시를 길게 걸면 배포해도 갱신되지 않는다.
// 내용 해시를 쿼리로 붙여 배포마다 URL이 바뀌게 하고,
// _headers에서 immutable 장기 캐시를 걸어 재방문 요청을 없앤다.

const cache = new Map();

function contentHash(assetPath) {
  const diskPath = path.join("src", assetPath.replace(/^\/+/, ""));
  const { mtimeMs } = statSync(diskPath);
  const cached = cache.get(diskPath);
  if (cached && cached.mtimeMs === mtimeMs) return cached.hash;

  const hash = createHash("sha256")
    .update(readFileSync(diskPath))
    .digest("hex")
    .slice(0, 8);
  cache.set(diskPath, { mtimeMs, hash });
  return hash;
}

export default function assets(eleventyConfig) {
  eleventyConfig.addFilter("assetUrl", (assetPath) =>
    `${assetPath}?v=${contentHash(assetPath)}`
  );
}
