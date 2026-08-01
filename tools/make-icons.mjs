/**
 * 아이콘 PNG 생성기 — src/assets/img/favicon.svg 와 같은 도형을 래스터화합니다.
 *
 * 왜 필요한가:
 * iOS 는 apple-touch-icon 에 SVG 를 지원하지 않습니다. 홈 화면에 추가하면
 * 아이콘 자리가 비거나 페이지 스크린샷이 대신 쓰입니다. PNG 가 있어야 합니다.
 *
 * 왜 직접 그리는가:
 * SVG → PNG 변환에는 보통 sharp / resvg 같은 네이티브 의존성이 필요합니다.
 * 이 프로젝트의 의존성은 Eleventy 하나뿐이고, 아이콘 하나 때문에 빌드에
 * 네이티브 모듈을 들이는 것은 과합니다. 도형이 사각형·원·둥근사각형뿐이라
 * 직접 계산하는 편이 간단하고, 결과가 환경에 상관없이 똑같습니다.
 *
 *   node tools/make-icons.mjs
 *
 * ⚠️ favicon.svg 의 도형을 고치면 아래 SHAPES 도 같이 고치고 다시 실행하세요.
 *    (두 곳을 손으로 맞춰야 하는 대신, 빌드에 의존성이 늘지 않습니다.)
 */
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve("src/assets/img");

/* favicon.svg 와 동일한 64×64 좌표계 */
const BG = [0x16, 0x15, 0x19]; // 워드마크 검정
const FG = [0xff, 0xff, 0xff]; // 흰 T
const ACCENT = [0xd7, 0x00, 0x0f]; // 로고의 빨간 점

const SHAPES = {
  /** 둥근 사각형: 안쪽 사각형으로 클램프한 뒤 거리로 판정 */
  panel: (x, y) => {
    const cx = Math.min(Math.max(x, 13), 64 - 13);
    const cy = Math.min(Math.max(y, 13), 64 - 13);
    const dx = x - cx;
    const dy = y - cy;
    return dx * dx + dy * dy <= 13 * 13;
  },
  /** T: 가로획 ∪ 세로획 */
  tee: (x, y) =>
    (x >= 13 && x <= 51 && y >= 24 && y <= 33) || (x >= 27 && x <= 37 && y >= 24 && y <= 51),
  /** 강조 점 */
  dot: (x, y) => {
    const dx = x - 46;
    const dy = y - 15.5;
    return dx * dx + dy * dy <= 5.5 * 5.5;
  },
};

/** 픽셀 하나를 SS×SS 로 나눠 샘플링합니다(계단 현상 방지). */
const SS = 4;

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
  const rgba = Buffer.alloc(size * size * 4);
  const unit = 64 / size; // 출력 픽셀 → 64 좌표계

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let panel = 0;
      let tee = 0;
      let dot = 0;

      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = (px + (sx + 0.5) / SS) * unit;
          const y = (py + (sy + 0.5) / SS) * unit;
          if (rounded ? SHAPES.panel(x, y) : true) panel++;
          if (SHAPES.tee(x, y)) tee++;
          if (SHAPES.dot(x, y)) dot++;
        }
      }

      const n = SS * SS;
      let px4 = over([0, 0, 0, 0], BG, panel / n);
      px4 = over(px4, FG, tee / n);
      px4 = over(px4, ACCENT, dot / n);

      const o = (py * size + px) * 4;
      rgba[o] = Math.round(px4[0]);
      rgba[o + 1] = Math.round(px4[1]);
      rgba[o + 2] = Math.round(px4[2]);
      rgba[o + 3] = Math.round(px4[3] * 255);
    }
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
