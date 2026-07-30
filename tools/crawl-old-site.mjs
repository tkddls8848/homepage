#!/usr/bin/env node
/**
 * Legacy Trial Info site mirror.
 *
 * The source server is intentionally accessed over plain HTTP because its
 * HTTPS certificate chain is invalid. Only GET requests to www.trialinfo.com
 * are allowed; redirects or links to other hosts are recorded and skipped.
 *
 * Usage:
 *   npm run crawl:old-site
 *   npm run crawl:old-site -- -- --output ./old-site --max-files 1500
 */
import http from "node:http";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_URL = "http://www.trialinfo.com/index.php";
const DEFAULT_OUTPUT = "old-site";
const DEFAULT_MAX_FILES = 1000;
const DEFAULT_TIMEOUT_MS = 20_000;
const DEFAULT_DELAY_MS = 80;
const USER_AGENT =
  "TrialInfoMigrationBot/1.0 (+offline site modernization; contact: master@trialinfo.com)";

function usage() {
  console.log(`
기존 Trial Info 사이트를 로컬 디렉터리에 미러링합니다.

사용법:
  npm run crawl:old-site
  npm run crawl:old-site -- -- [옵션]

옵션:
  --url <url>          시작 URL (기본값: ${DEFAULT_URL})
  --output <dir>       저장 디렉터리 (기본값: ${DEFAULT_OUTPUT})
  --max-files <number> 최대 다운로드 파일 수 (기본값: ${DEFAULT_MAX_FILES})
  --delay <ms>         요청 사이 대기 시간 (기본값: ${DEFAULT_DELAY_MS})
  --timeout <ms>       요청 제한 시간 (기본값: ${DEFAULT_TIMEOUT_MS})
  --help               도움말

주의:
  - 보안상 http://www.trialinfo.com 만 요청합니다.
  - 기존 파일은 같은 URL을 다시 받으면 덮어씁니다.
  - 결과와 실패 목록은 <output>/crawl-manifest.json 에 기록됩니다.
`);
}

function parseArgs(argv) {
  const options = {
    url: DEFAULT_URL,
    output: DEFAULT_OUTPUT,
    maxFiles: DEFAULT_MAX_FILES,
    delayMs: DEFAULT_DELAY_MS,
    timeoutMs: DEFAULT_TIMEOUT_MS,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    }
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`${arg} 옵션의 값이 없습니다.`);
    }
    if (arg === "--url") options.url = value;
    else if (arg === "--output") options.output = value;
    else if (arg === "--max-files") options.maxFiles = positiveInteger(value, arg);
    else if (arg === "--delay") options.delayMs = nonNegativeInteger(value, arg);
    else if (arg === "--timeout") options.timeoutMs = positiveInteger(value, arg);
    else throw new Error(`알 수 없는 옵션입니다: ${arg}`);
    i += 1;
  }
  return options;
}

function positiveInteger(value, option) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${option} 값은 1 이상의 정수여야 합니다.`);
  }
  return parsed;
}

function nonNegativeInteger(value, option) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error(`${option} 값은 0 이상의 정수여야 합니다.`);
  }
  return parsed;
}

function normalizeUrl(input, base) {
  let url;
  try {
    url = new URL(input, base);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" || url.hostname !== "www.trialinfo.com") {
    return null;
  }
  if (url.port && url.port !== "80") return null;

  url.hash = "";
  // The legacy site uses static page URLs. Ignoring query strings prevents
  // calendar/search-style links from creating an unbounded crawl.
  url.search = "";
  return url;
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function localRelativePath(url) {
  let pathname = safeDecode(url.pathname).replaceAll("\\", "/");
  if (pathname.endsWith("/")) pathname += "index.html";
  if (!path.posix.extname(pathname)) pathname += "/index.html";

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      if (segment === "." || segment === "..") return "_";
      return segment.replace(/[<>:"|?*\u0000-\u001f]/g, "_");
    });
  return segments.join(path.sep) || "index.html";
}

function decodeHtmlEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function extractCssReferences(css) {
  const references = [];
  for (const match of css.matchAll(/url\(\s*(?:(["'])(.*?)\1|([^)"'\s][^)]*))\s*\)/gi)) {
    references.push((match[2] ?? match[3] ?? "").trim());
  }
  for (const match of css.matchAll(/@import\s+(?:url\(\s*)?(?:(["'])(.*?)\1|([^\s;)]+))/gi)) {
    references.push((match[2] ?? match[3] ?? "").trim());
  }
  return references;
}

function extractHtmlReferences(html, pageUrl) {
  const references = [];
  const baseMatch = html.match(/<base\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/i);
  const documentBase = baseMatch ? new URL(decodeHtmlEntities(baseMatch[2]), pageUrl) : pageUrl;

  for (const match of html.matchAll(
    /\b(?:href|src|poster|data-src)\s*=\s*(?:(["'])(.*?)\1|([^\s"'=<>`]+))/gi,
  )) {
    references.push({ value: decodeHtmlEntities(match[2] ?? match[3] ?? ""), base: documentBase });
  }

  for (const match of html.matchAll(/\bsrcset\s*=\s*(["'])(.*?)\1/gi)) {
    for (const candidate of match[2].split(",")) {
      references.push({
        value: decodeHtmlEntities(candidate.trim().split(/\s+/)[0] ?? ""),
        base: documentBase,
      });
    }
  }

  for (const value of extractCssReferences(html)) {
    references.push({ value: decodeHtmlEntities(value), base: documentBase });
  }
  return references;
}

function extractJavaScriptAssetReferences(source) {
  const references = [];
  const assetPattern =
    /(["'`])((?:\.{0,2}\/|\/)[^"'`\s?#]+\.(?:css|js|mjs|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|otf))(?:[?#][^"'`]*)?\1/gi;
  for (const match of source.matchAll(assetPattern)) references.push(match[2]);
  return references;
}

function contentKind(contentType, url) {
  const type = contentType.split(";")[0].trim().toLowerCase();
  const extension = path.posix.extname(url.pathname).toLowerCase();
  if (type === "text/html" || type === "application/xhtml+xml" || [".php", ".html", ".htm"].includes(extension)) {
    return "html";
  }
  if (type === "text/css" || extension === ".css") return "css";
  if (
    ["application/javascript", "text/javascript", "application/x-javascript"].includes(type) ||
    [".js", ".mjs"].includes(extension)
  ) {
    return "javascript";
  }
  return "asset";
}

function request(url, timeoutMs, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      url,
      {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "*/*",
          "Accept-Encoding": "identity",
          Connection: "close",
        },
      },
      (response) => {
        const status = response.statusCode ?? 0;
        const location = response.headers.location;

        if (status >= 300 && status < 400 && location) {
          response.resume();
          if (redirectCount >= 5) {
            reject(new Error("리다이렉트를 5회 이상 반복했습니다."));
            return;
          }
          const redirected = normalizeUrl(location, url);
          if (!redirected) {
            reject(new Error(`허용되지 않은 리다이렉트: ${location}`));
            return;
          }
          request(redirected, timeoutMs, redirectCount + 1).then(resolve, reject);
          return;
        }

        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          resolve({
            url,
            status,
            headers: response.headers,
            body: Buffer.concat(chunks),
          });
        });
      },
    );
    req.setTimeout(timeoutMs, () => req.destroy(new Error(`요청 시간 초과 (${timeoutMs}ms)`)));
    req.on("error", reject);
  });
}

function sleep(ms) {
  return ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const startUrl = normalizeUrl(options.url);
  if (!startUrl) {
    throw new Error("시작 URL은 http://www.trialinfo.com 주소여야 합니다.");
  }

  const outputRoot = path.resolve(options.output);
  const manifestPath = path.join(outputRoot, "crawl-manifest.json");
  await mkdir(outputRoot, { recursive: true });

  const queue = [startUrl];
  const queued = new Set([startUrl.href]);
  const downloaded = [];
  const failures = [];
  const skippedExternal = new Set();

  console.log(`원본: ${startUrl.href}`);
  console.log(`저장: ${outputRoot}`);
  console.log(`최대 파일: ${options.maxFiles}\n`);

  while (queue.length > 0 && downloaded.length < options.maxFiles) {
    const current = queue.shift();
    const relativePath = localRelativePath(current);

    try {
      const response = await request(current, options.timeoutMs);
      if (response.status < 200 || response.status >= 300) {
        failures.push({ url: current.href, status: response.status, error: `HTTP ${response.status}` });
        console.error(`[실패 ${response.status}] ${current.href}`);
        await sleep(options.delayMs);
        continue;
      }

      const destination = path.join(outputRoot, relativePath);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, response.body);

      const contentType = String(response.headers["content-type"] ?? "");
      const kind = contentKind(contentType, current);
      downloaded.push({
        url: current.href,
        path: relativePath.replaceAll("\\", "/"),
        status: response.status,
        contentType,
        bytes: response.body.length,
      });
      console.log(`[${downloaded.length}] ${current.pathname} -> ${relativePath}`);

      const text = kind === "asset" ? "" : response.body.toString("utf8");
      let references = [];
      if (kind === "html") references = extractHtmlReferences(text, current);
      else if (kind === "css") references = extractCssReferences(text).map((value) => ({ value, base: current }));
      else if (kind === "javascript") {
        references = extractJavaScriptAssetReferences(text).map((value) => ({ value, base: current }));
      }

      for (const reference of references) {
        const raw = reference.value.trim();
        if (!raw || raw.startsWith("#") || /^(?:data|mailto|tel|javascript):/i.test(raw)) continue;
        const resolved = normalizeUrl(raw, reference.base);
        if (!resolved) {
          try {
            const external = new URL(raw, reference.base);
            if (external.protocol === "http:" || external.protocol === "https:") {
              skippedExternal.add(external.origin);
            }
          } catch {
            // Invalid references are harmless in a best-effort legacy mirror.
          }
          continue;
        }
        if (!queued.has(resolved.href)) {
          queued.add(resolved.href);
          queue.push(resolved);
        }
      }
    } catch (error) {
      failures.push({ url: current.href, error: error.message });
      console.error(`[오류] ${current.href}: ${error.message}`);
    }

    await sleep(options.delayMs);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    startUrl: startUrl.href,
    output: outputRoot,
    limits: {
      maxFiles: options.maxFiles,
      delayMs: options.delayMs,
      timeoutMs: options.timeoutMs,
    },
    summary: {
      downloaded: downloaded.length,
      failed: failures.length,
      pending: queue.length,
    },
    downloaded,
    failures,
    skippedExternalOrigins: [...skippedExternal].sort(),
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log("\n완료");
  console.log(`- 다운로드: ${downloaded.length}개`);
  console.log(`- 실패: ${failures.length}개`);
  console.log(`- 남은 대기열: ${queue.length}개`);
  console.log(`- 기록: ${manifestPath}`);

  if (queue.length > 0) {
    console.warn(`\n최대 파일 수에 도달했습니다. --max-files 값을 늘려 다시 실행하세요.`);
  }
  if (failures.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`crawl:old-site 실패: ${error.message}`);
  process.exitCode = 1;
});
