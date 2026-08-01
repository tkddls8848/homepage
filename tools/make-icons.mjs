/**
 * 아이콘 PNG 생성기 — src/assets/img/favicon.svg 를 읽어 그대로 래스터화합니다.
 *
 *   node tools/make-icons.mjs      (= npm run make:icons)
 *
 * 왜 필요한가:
 * iOS 는 apple-touch-icon 에 SVG 를 지원하지 않습니다. 홈 화면에 추가하면
 * 아이콘 자리가 비거나 페이지 스크린샷이 대신 쓰입니다. PNG 가 있어야 합니다.
 *
 * 왜 직접 그리는가:
 * SVG → PNG 변환에는 보통 sharp / resvg 같은 네이티브 의존성이 필요합니다.
 * 이 프로젝트의 의존성은 Eleventy 하나뿐이고, 아이콘 하나 때문에 빌드에
 * 네이티브 모듈을 들이는 것은 과합니다. 필요한 기능(패스 채우기)만 직접
 * 구현하면 결과가 환경에 상관없이 똑같습니다.
 *
 * 예전 버전은 도형을 이 파일에 손으로 다시 적어 두고 favicon.svg 와 따로
 * 관리했습니다. 지금은 favicon.svg 하나만 고치면 됩니다 — 아래 코드는
 * 그 파일의 <rect>/<circle>/<polygon>/<path> 를 파싱해 폴리곤으로 편 뒤
 * 채웁니다(nonzero winding, 세로 4배 슈퍼샘플 + 가로 방향은 면적 계산).
 *
 * 지원하는 범위는 favicon.svg 가 쓰는 만큼입니다:
 *   요소       rect(rx) / circle / polygon / path
 *   path 명령  M m L l H h V v C c Z z
 *   변환       <g transform="translate(...) scale(...)">
 * 그 밖의 문법을 만나면 조용히 잘못 그리는 대신 예외를 던집니다.
 */
import { deflateSync } from "node:zlib";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const SRC = path.resolve("src/assets/img/favicon.svg");
const OUT_DIR = path.resolve("src/assets/img");

/** favicon.svg 의 좌표계 (viewBox="0 0 64 64") */
const VIEW = 64;

/** 곡선 하나를 몇 조각의 직선으로 펼지. 64 좌표계에서는 16 이면 충분합니다. */
const CURVE_STEPS = 16;

/** 픽셀 하나를 세로로 몇 번 샘플링할지(계단 현상 방지). 가로는 면적으로 계산합니다. */
const SS = 4;

/* ── SVG 파싱 ──────────────────────────────────────────────────────────── */

/** "translate(8, 20.93) scale(0.6935)" → [a,b,c,d,e,f] */
function parseTransform(str) {
  let m = [1, 0, 0, 1, 0, 0];
  if (!str) return m;
  const mul = (n) => [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ];

  for (const [, name, argStr] of str.matchAll(/([a-z]+)\s*\(([^)]*)\)/g)) {
    const a = argStr.split(/[\s,]+/).filter(Boolean).map(Number);
    if (name === "translate") m = mul([1, 0, 0, 1, a[0], a[1] ?? 0]);
    else if (name === "scale") m = mul([a[0], 0, 0, a[1] ?? a[0], 0, 0]);
    else if (name === "matrix") m = mul(a);
    else throw new Error(`지원하지 않는 transform: ${name}`);
  }
  return m;
}

const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

/** #rgb / #rrggbb → [r,g,b] */
function parseColor(value) {
  const hex = value.trim().replace("#", "");
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`지원하지 않는 색: ${value}`);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

// 속성 이름 앞에 공백을 요구합니다. 없으면 x 를 찾을 때 rx="13" 이 걸립니다.
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`)) || [])[1];
const num = (tag, name, fallback = 0) => {
  const v = attr(tag, name);
  return v === undefined ? fallback : Number(v);
};

/** 3차 베지어를 직선 조각으로 폅니다. */
function flattenCubic(pts, p0, p1, p2, p3) {
  for (let i = 1; i <= CURVE_STEPS; i++) {
    const t = i / CURVE_STEPS;
    const u = 1 - t;
    pts.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]);
  }
}

/** path 의 d 속성 → 폴리곤(닫힌 점 배열) 목록 */
function parsePathData(d) {
  const tokens = d.match(/[MmLlHhVvCcZz]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  const rings = [];
  let ring = [];
  let cur = [0, 0];
  let start = [0, 0];
  let cmd = null;
  let i = 0;

  const next = () => Number(tokens[i++]);
  const push = (p) => {
    ring.push(p);
    cur = p;
  };
  const closeRing = () => {
    if (ring.length > 2) rings.push(ring);
    ring = [];
  };

  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) cmd = tokens[i++];
    // 좌표만 이어지면 직전 명령을 반복합니다(SVG 규칙). M 뒤의 반복은 L 입니다.
    else if (cmd === "M") cmd = "L";
    else if (cmd === "m") cmd = "l";

    const rel = cmd === cmd.toLowerCase();
    const base = rel ? cur : [0, 0];

    switch (cmd.toUpperCase()) {
      case "M": {
        closeRing();
        const p = [base[0] + next(), base[1] + next()];
        start = p;
        push(p);
        break;
      }
      case "L":
        push([base[0] + next(), base[1] + next()]);
        break;
      case "H":
        push([base[0] + next(), cur[1]]);
        break;
      case "V":
        push([cur[0], base[1] + next()]);
        break;
      case "C": {
        const p1 = [base[0] + next(), base[1] + next()];
        const p2 = [base[0] + next(), base[1] + next()];
        const p3 = [base[0] + next(), base[1] + next()];
        flattenCubic(ring, cur, p1, p2, p3);
        cur = p3;
        break;
      }
      case "Z":
        closeRing();
        cur = start;
        break;
      default:
        throw new Error(`지원하지 않는 path 명령: ${cmd}`);
    }
  }
  closeRing();
  return rings;
}

/** 둥근 사각형 → 폴리곤 하나 */
function roundedRect(x, y, w, h, r) {
  if (!r) return [[[x, y], [x + w, y], [x + w, y + h], [x, y + h]]];
  const ring = [];
  const corners = [
    [x + w - r, y + r, -Math.PI / 2, 0],
    [x + w - r, y + h - r, 0, Math.PI / 2],
    [x + r, y + h - r, Math.PI / 2, Math.PI],
    [x + r, y + r, Math.PI, (3 * Math.PI) / 2],
  ];
  for (const [cx, cy, a0, a1] of corners) {
    for (let s = 0; s <= CURVE_STEPS; s++) {
      const a = a0 + ((a1 - a0) * s) / CURVE_STEPS;
      ring.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  }
  return [ring];
}

/** 원 → 폴리곤 하나 */
function circleRing(cx, cy, r) {
  const ring = [];
  const steps = CURVE_STEPS * 4;
  for (let s = 0; s < steps; s++) {
    const a = (2 * Math.PI * s) / steps;
    ring.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return [ring];
}

/**
 * favicon.svg → 칠할 도형 목록(그리는 순서대로).
 * @param {boolean} rounded 배경 사각형의 둥근 모서리를 살릴지
 */
function readShapes(rounded) {
  const svg = readFileSync(SRC, "utf8");
  const shapes = [];
  let matrix = [1, 0, 0, 1, 0, 0];

  for (const [tag] of svg.matchAll(/<(?:g|rect|circle|polygon|path)\b[^>]*>/g)) {
    if (tag.startsWith("<g")) {
      matrix = parseTransform(attr(tag, "transform"));
      continue;
    }

    const fill = attr(tag, "fill");
    if (!fill || fill === "none") continue;

    let rings;
    if (tag.startsWith("<rect")) {
      const r = rounded ? num(tag, "rx") : 0;
      rings = roundedRect(num(tag, "x"), num(tag, "y"), num(tag, "width"), num(tag, "height"), r);
    } else if (tag.startsWith("<circle")) {
      rings = circleRing(num(tag, "cx"), num(tag, "cy"), num(tag, "r"));
    } else if (tag.startsWith("<polygon")) {
      const n = attr(tag, "points").split(/[\s,]+/).filter(Boolean).map(Number);
      rings = [Array.from({ length: n.length / 2 }, (_, k) => [n[k * 2], n[k * 2 + 1]])];
    } else {
      rings = parsePathData(attr(tag, "d"));
    }

    const m = matrix;
    shapes.push({
      color: parseColor(fill),
      rings: rings.map((ring) => ring.map(([x, y]) => apply(m, x, y))),
    });
  }
  return shapes;
}

/* ── 래스터화 ──────────────────────────────────────────────────────────── */

/**
 * 도형 하나의 픽셀별 커버리지(0~1)를 구합니다.
 * 세로는 SS 번 샘플링하고, 가로는 교차점 사이 구간의 길이를 그대로 더합니다
 * (가로로는 샘플 수와 상관없이 정확한 값이라 경계가 매끄럽습니다).
 */
function coverageOf(shape, size) {
  const cov = new Float64Array(size * size);
  const scale = size / VIEW; // 64 좌표계 → 출력 픽셀

  const edges = [];
  for (const ring of shape.rings) {
    for (let k = 0; k < ring.length; k++) {
      const [x0, y0] = ring[k];
      const [x1, y1] = ring[(k + 1) % ring.length];
      if (y0 !== y1) edges.push([x0 * scale, y0 * scale, x1 * scale, y1 * scale]);
    }
  }
  if (!edges.length) return cov;

  const yMin = Math.max(0, Math.floor(Math.min(...edges.flatMap((e) => [e[1], e[3]]))));
  const yMax = Math.min(size - 1, Math.ceil(Math.max(...edges.flatMap((e) => [e[1], e[3]]))));

  const hits = [];
  for (let py = yMin; py <= yMax; py++) {
    for (let s = 0; s < SS; s++) {
      const y = py + (s + 0.5) / SS;

      hits.length = 0;
      for (const [x0, y0, x1, y1] of edges) {
        if (y < Math.min(y0, y1) || y >= Math.max(y0, y1)) continue;
        hits.push([x0 + ((y - y0) / (y1 - y0)) * (x1 - x0), y1 > y0 ? 1 : -1]);
      }
      if (hits.length < 2) continue;
      hits.sort((a, b) => a[0] - b[0]);

      // nonzero winding: 감김수가 0 이 아닌 구간만 칠합니다.
      let winding = 0;
      for (let h = 0; h < hits.length - 1; h++) {
        winding += hits[h][1];
        if (winding === 0) continue;
        addSpan(cov, size, py, hits[h][0], hits[h + 1][0], 1 / SS);
      }
    }
  }
  return cov;
}

/** [xa, xb) 구간을 한 줄에 더합니다. 양 끝 픽셀은 겹치는 길이만큼만 칠합니다. */
function addSpan(cov, size, py, xa, xb, weight) {
  const from = Math.max(0, xa);
  const to = Math.min(size, xb);
  if (to <= from) return;

  const row = py * size;
  const first = Math.floor(from);
  const last = Math.min(size - 1, Math.ceil(to) - 1);

  for (let px = first; px <= last; px++) {
    const overlap = Math.min(to, px + 1) - Math.max(from, px);
    if (overlap > 0) cov[row + px] += overlap * weight;
  }
}

/** src 를 dst 위에 올립니다. 색은 0~255, 알파는 0~1. */
function over(dst, srcColor, srcA) {
  if (srcA <= 0) return dst;
  const outA = srcA + dst[3] * (1 - srcA);
  if (outA <= 0) return [0, 0, 0, 0];
  const mix = (i) => (srcColor[i] * srcA + dst[i] * dst[3] * (1 - srcA)) / outA;
  return [mix(0), mix(1), mix(2), outA];
}

/**
 * @param {number} size 출력 크기(px)
 * @param {boolean} rounded 모서리를 둥글릴지.
 *   apple-touch-icon 은 iOS 가 스스로 모서리를 깎으므로 꽉 찬 사각형이어야
 *   합니다. 여기서 미리 둥글리면 모서리가 두 번 깎여 어색해집니다.
 */
function render(size, rounded) {
  const shapes = readShapes(rounded);
  const covs = shapes.map((shape) => coverageOf(shape, size));
  const rgba = Buffer.alloc(size * size * 4);

  for (let i = 0; i < size * size; i++) {
    let px = [0, 0, 0, 0];
    for (let s = 0; s < shapes.length; s++) {
      px = over(px, shapes[s].color, Math.min(1, covs[s][i]));
    }
    const o = i * 4;
    rgba[o] = Math.round(px[0]);
    rgba[o + 1] = Math.round(px[1]);
    rgba[o + 2] = Math.round(px[2]);
    rgba[o + 3] = Math.round(px[3] * 255);
  }
  return rgba;
}

/* ── PNG 인코딩 (RGBA, 필터 없음) ──────────────────────────────────────── */
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(size, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // 채널당 8비트
  ihdr[9] = 6; // RGBA
  // 나머지(압축·필터·인터레이스)는 0 = 기본값

  const stride = size * 4;
  const raw = Buffer.alloc(size * (stride + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // 스캔라인 필터: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ── 출력 ──────────────────────────────────────────────────────────────── */
const TARGETS = [
  // iOS 홈 화면. 모서리는 iOS 가 깎으므로 꽉 찬 사각형.
  { file: "apple-touch-icon.png", size: 180, rounded: false },
  // SVG 를 못 읽는 환경(구형 브라우저, 일부 RSS 리더·크롤러)용 대체.
  { file: "favicon-32.png", size: 32, rounded: true },
];

for (const { file, size, rounded } of TARGETS) {
  const out = path.join(OUT_DIR, file);
  writeFileSync(out, encodePng(size, render(size, rounded)));
  console.log(`${file}  ${size}×${size}`);
}
