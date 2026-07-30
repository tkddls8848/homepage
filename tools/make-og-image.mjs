#!/usr/bin/env node
/**
 * SNS 미리보기 이미지(og:image) 생성기.
 *
 *   npm run make:og      → src/images/og/og-default.png (1200×630)
 *
 * 왜 스크립트인가:
 * 카카오톡·슬랙·페이스북 등 대부분의 미리보기는 SVG 를 지원하지 않아 og:image
 * 만은 PNG 여야 합니다. 그렇다고 이미지 편집 도구나 무거운 이미지 라이브러리를
 * 의존성으로 들이고 싶지는 않았기 때문에, Node 내장 zlib 만으로 PNG 를 직접
 * 씁니다. (외부 패키지 0개)
 *
 * 결과 파일은 저장소에 커밋되어 있으므로 배포 과정에서 실행할 필요는 없습니다.
 * 브랜드 색이나 구성을 바꿀 때만 다시 돌리면 됩니다.
 */
import { deflateSync } from "node:zlib";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const WIDTH = 1200;
const HEIGHT = 630;
const SCALE = 2; // 2배로 그린 뒤 축소해서 경계를 매끄럽게 만듭니다(안티에일리어싱).

const BRAND_LIGHT = [15, 82, 153]; // #0f5299
const BRAND_DARK = [4, 28, 60]; // #041c3c
const ACCENT = [0, 166, 200]; // #00a6c8
const WHITE = [255, 255, 255];

/* ── 캔버스 ────────────────────────────────────────────────────────────── */
const W = WIDTH * SCALE;
const H = HEIGHT * SCALE;
const canvas = new Uint8Array(W * H * 3);

function blend(x, y, color, alpha) {
  if (x < 0 || y < 0 || x >= W || y >= H || alpha <= 0) return;
  const i = (y * W + x) * 3;
  if (alpha >= 1) {
    canvas[i] = color[0];
    canvas[i + 1] = color[1];
    canvas[i + 2] = color[2];
    return;
  }
  for (let c = 0; c < 3; c += 1) {
    canvas[i + c] = Math.round(canvas[i + c] * (1 - alpha) + color[c] * alpha);
  }
}

/** 좌상 → 우하 대각선 그라디언트 */
function fillDiagonalGradient(from, to) {
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const t = (x / W + y / H) / 2;
      blend(x, y, [
        Math.round(from[0] + (to[0] - from[0]) * t),
        Math.round(from[1] + (to[1] - from[1]) * t),
        Math.round(from[2] + (to[2] - from[2]) * t),
      ], 1);
    }
  }
}

function fillRect(x, y, w, h, color, alpha = 1) {
  const x0 = Math.round(x * SCALE);
  const y0 = Math.round(y * SCALE);
  const x1 = Math.round((x + w) * SCALE);
  const y1 = Math.round((y + h) * SCALE);
  for (let py = y0; py < y1; py += 1) {
    for (let px = x0; px < x1; px += 1) blend(px, py, color, alpha);
  }
}

/** 둥근 사각형 (모서리 반지름 r) */
function fillRoundRect(x, y, w, h, r, color, alpha = 1) {
  const x0 = x * SCALE;
  const y0 = y * SCALE;
  const x1 = (x + w) * SCALE;
  const y1 = (y + h) * SCALE;
  const rr = r * SCALE;
  for (let py = Math.floor(y0); py < Math.ceil(y1); py += 1) {
    for (let px = Math.floor(x0); px < Math.ceil(x1); px += 1) {
      // 모서리 안쪽 원의 중심까지 거리로 판정합니다.
      const cx = Math.min(Math.max(px + 0.5, x0 + rr), x1 - rr);
      const cy = Math.min(Math.max(py + 0.5, y0 + rr), y1 - rr);
      const dx = px + 0.5 - cx;
      const dy = py + 0.5 - cy;
      if (dx * dx + dy * dy <= rr * rr) blend(px, py, color, alpha);
    }
  }
}

function fillCircle(cx, cy, r, color, alpha = 1) {
  const c = [cx * SCALE, cy * SCALE];
  const rr = r * SCALE;
  for (let py = Math.floor(c[1] - rr); py <= Math.ceil(c[1] + rr); py += 1) {
    for (let px = Math.floor(c[0] - rr); px <= Math.ceil(c[0] + rr); px += 1) {
      const dx = px + 0.5 - c[0];
      const dy = py + 0.5 - c[1];
      if (dx * dx + dy * dy <= rr * rr) blend(px, py, color, alpha);
    }
  }
}

function strokeCircle(cx, cy, r, width, color, alpha = 1) {
  const inner = r - width;
  const c = [cx * SCALE, cy * SCALE];
  const outerR = r * SCALE;
  const innerR = inner * SCALE;
  for (let py = Math.floor(c[1] - outerR); py <= Math.ceil(c[1] + outerR); py += 1) {
    for (let px = Math.floor(c[0] - outerR); px <= Math.ceil(c[0] + outerR); px += 1) {
      const dx = px + 0.5 - c[0];
      const dy = py + 0.5 - c[1];
      const d2 = dx * dx + dy * dy;
      if (d2 <= outerR * outerR && d2 >= innerR * innerR) blend(px, py, color, alpha);
    }
  }
}

/* ── 그림 ──────────────────────────────────────────────────────────────── */
fillDiagonalGradient(BRAND_LIGHT, BRAND_DARK);

// 오른쪽 위에서 퍼지는 은은한 원들
for (const r of [560, 460, 360, 260]) {
  strokeCircle(1010, 150, r, 2, WHITE, 0.05);
}

// 왼쪽 아래 랙 실루엣 (형태만 암시)
for (let i = 0; i < 7; i += 1) {
  fillRect(70 + i * 46, 470 - i * 6, 30, 120 + i * 6, WHITE, 0.05);
}

// 브랜드 마크 — favicon.svg / logo.svg 와 같은 조형 (64 단위 좌표를 확대)
const MARK = 260;
const markX = (WIDTH - MARK) / 2;
const markY = 150;
const u = MARK / 64; // 64 단위 → 픽셀
fillRoundRect(markX, markY, MARK, MARK, 14 * u, WHITE, 0.97);
fillRect(markX + 15 * u, markY + 20 * u, 34 * u, 7 * u, BRAND_DARK);
fillRect(markX + 28 * u, markY + 27 * u, 8.5 * u, 22 * u, BRAND_DARK);
fillCircle(markX + 49 * u, markY + 46 * u, 4.5 * u, ACCENT);

// 마크 아래 액센트 밑줄
fillRoundRect(WIDTH / 2 - 90, markY + MARK + 46, 180, 8, 4, ACCENT, 0.95);

/* ── 축소 (2×2 평균) ───────────────────────────────────────────────────── */
const out = new Uint8Array(WIDTH * HEIGHT * 3);
for (let y = 0; y < HEIGHT; y += 1) {
  for (let x = 0; x < WIDTH; x += 1) {
    for (let c = 0; c < 3; c += 1) {
      let sum = 0;
      for (let sy = 0; sy < SCALE; sy += 1) {
        for (let sx = 0; sx < SCALE; sx += 1) {
          sum += canvas[((y * SCALE + sy) * W + (x * SCALE + sx)) * 3 + c];
        }
      }
      out[(y * WIDTH + x) * 3 + c] = Math.round(sum / (SCALE * SCALE));
    }
  }
}

/* ── PNG 인코딩 ────────────────────────────────────────────────────────── */
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(WIDTH, 0);
ihdr.writeUInt32BE(HEIGHT, 4);
ihdr[8] = 8; // 비트 심도
ihdr[9] = 2; // 컬러 타입 2 = RGB
ihdr[10] = 0; // 압축
ihdr[11] = 0; // 필터
ihdr[12] = 0; // 비인터레이스

// 스캔라인마다 필터 1(Sub) 을 씁니다. 그라디언트에서 압축률이 크게 좋아집니다.
const stride = WIDTH * 3;
const raw = Buffer.alloc((stride + 1) * HEIGHT);
for (let y = 0; y < HEIGHT; y += 1) {
  const rowStart = y * (stride + 1);
  raw[rowStart] = 1;
  for (let i = 0; i < stride; i += 1) {
    const left = i >= 3 ? out[y * stride + i - 3] : 0;
    raw[rowStart + 1 + i] = (out[y * stride + i] - left) & 0xff;
  }
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

const target = path.resolve("src/images/og/og-default.png");
await mkdir(path.dirname(target), { recursive: true });
await writeFile(target, png);
console.log(`${path.relative(process.cwd(), target)} — ${WIDTH}×${HEIGHT}, ${(png.length / 1024).toFixed(1)}KB`);
