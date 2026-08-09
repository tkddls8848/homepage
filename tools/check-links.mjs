#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve("_site");

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(target)));
    else files.push(target);
  }
  return files;
}

function resolveTarget(reference) {
  const clean = reference.split(/[?#]/)[0];
  if (!clean || clean.startsWith("//")) return null;
  const target = path.join(root, decodeURIComponent(clean));
  if (existsSync(target)) return target;
  if (clean.endsWith("/") && existsSync(path.join(target, "index.html"))) {
    return path.join(target, "index.html");
  }
  if (existsSync(`${target}.html`)) return `${target}.html`;
  return null;
}

if (!existsSync(root)) {
  console.error("_site가 없습니다. 먼저 `npm run build:only`를 실행하세요.");
  process.exit(1);
}

const htmlFiles = (await walk(root)).filter((file) => file.endsWith(".html"));
const broken = [];

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const page = path.relative(root, file);
  const references = [
    ...[...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]),
    ...[...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1]),
  ];

  for (const reference of references) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(reference)) continue;
    if (!resolveTarget(reference)) broken.push(`${page} → ${reference}`);
  }
}

if (broken.length) {
  console.error(`깨진 내부 경로 ${broken.length}개`);
  for (const item of [...new Set(broken)]) console.error(`- ${item}`);
  process.exit(1);
}

console.log(`내부 경로 검사 완료: HTML ${htmlFiles.length}개`);
