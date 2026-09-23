import path from "node:path";
import eleventyImage, { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { OUTPUT_DIR as SITE_OUTPUT_DIR } from "./paths.js";

// 원본 PNG 사진은 1~3MB로 첫 방문 전송량의 대부분을 차지한다.
// 빌드된 HTML의 <img>를 후처리해 AVIF/WebP로 변환하고 표시 크기에 맞는 폭만 생성한다.
// 템플릿에서는 eleventy:widths와 sizes 속성으로 이미지별 크기를 지정한다.
// 파일명에 내용 해시가 들어가므로 _headers에서 immutable 캐시를 걸 수 있다.

const INPUT_ROOT = "src";
const OUTPUT_DIR = `${SITE_OUTPUT_DIR}/img/`;
const URL_PATH = "/img/";

// 같은 화질에서 AVIF가 WebP보다 40~60% 작다. 브라우저가 <picture>의 type으로
// 고르므로 AVIF를 못 읽는 환경은 WebP를 받는다.
const FORMATS = ["avif", "webp"];

// 사진 대비 화질 손실이 드러나지 않으면서 전송량이 크게 줄어드는 지점.
// 두 코덱의 품질 눈금이 달라 값이 다르다.
const SHARP_WEBP_OPTIONS = { quality: 80 };
const SHARP_AVIF_OPTIONS = { quality: 50 };

const SHARP_OPTIONS = {
  sharpWebpOptions: SHARP_WEBP_OPTIONS,
  sharpAvifOptions: SHARP_AVIF_OPTIONS,
};

// 사이트 절대경로(/images/...)를 디스크 경로(src/images/...)로 바꾼다.
const toDiskPath = (src) => path.join(INPUT_ROOT, src.replace(/^\/+/, ""));

// <picture>의 <source srcset>은 transform 플러그인이 건드리지 않아 직접 생성한다.
async function imageSrcset(src, widths, format = "webp") {
  const metadata = await eleventyImage(toDiskPath(src), {
    widths,
    formats: [format],
    outputDir: OUTPUT_DIR,
    urlPath: URL_PATH,
    ...SHARP_OPTIONS,
  });
  return metadata[format].map((file) => `${file.url} ${file.width}w`).join(", ");
}

// CSS background-image처럼 srcset을 쓸 수 없는 자리에서 단일 URL을 얻는다.
// image-set()은 지원하지 않는 브라우저에서 배경이 통째로 사라지므로 WebP만 쓴다.
async function imageUrl(src, width) {
  const srcset = await imageSrcset(src, [width], "webp");
  return srcset.split(", ").pop().split(" ")[0];
}

export default function images(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: FORMATS,
    // 템플릿에서 eleventy:widths로 덮어쓰지 않으면 원본 폭 그대로 한 장만 만든다.
    widths: ["auto"],
    outputDir: OUTPUT_DIR,
    urlPath: URL_PATH,
    ...SHARP_OPTIONS,
    // loading은 템플릿이 이미지별로 지정한다. 여기서 기본값을 주면
    // 히어로 첫 슬라이드(LCP)까지 지연 로딩돼 오히려 느려진다.
    defaultAttributes: { decoding: "async" },
  });

  eleventyConfig.addAsyncFilter("imageUrl", imageUrl);
  eleventyConfig.addAsyncFilter("imageSrcset", imageSrcset);
}
