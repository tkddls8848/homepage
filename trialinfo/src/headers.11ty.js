import { PATH_PREFIX } from "../lib/paths.js";

// Cloudflare Pages는 배포 루트의 _headers만 읽는다. 이 파일은 _site/trialinfo/_headers로
// 나간 뒤 루트 빌드(tools/build-root.mjs)가 _site/_headers로 옮긴다.
export default class HeadersFile {
  data() {
    return {
      permalink: "/_headers",
      eleventyExcludeFromCollections: true,
      eleventyAllowMissingExtension: true,
    };
  }

  render({ site }) {
    const formOrigin = site.formEndpointOrigin ? ` ${site.formEndpointOrigin}` : "";
    const kakao = "https://*.daumcdn.net https://*.kakaocdn.net";
    const csp = [
      "default-src 'self'",
      "base-uri 'none'",
      "object-src 'none'",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      `script-src 'self' ${kakao}`,
      `style-src 'self' 'unsafe-inline' ${kakao}`,
      "font-src 'self'",
      `img-src 'self' data: blob: ${kakao}`,
      `connect-src 'self'${formOrigin} ${kakao}`,
      `form-action 'self'${formOrigin}`,
      "upgrade-insecure-requests",
    ].join("; ");

    // Cloudflare Pages는 기본으로 정적 파일에 max-age=0, must-revalidate를 붙여
    // 재방문마다 모든 자산을 재검증한다. 파일명이나 쿼리에 내용 해시가 있는 자산은
    // 배포할 때 URL이 바뀌므로 1년 immutable로 두어 재요청 자체를 없앤다.
    const immutable = "public, max-age=31536000, immutable";
    // 로고·파비콘·OG 이미지는 버전이 붙지 않아 갱신이 반영되도록 7일만 캐시한다.
    const shortLived = "public, max-age=604800";

    return [
      "/*",
      `  Content-Security-Policy: ${csp}`,
      "  Strict-Transport-Security: max-age=31536000",
      "  X-Content-Type-Options: nosniff",
      "  Referrer-Policy: strict-origin-when-cross-origin",
      "  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()",
      "",
      // eleventy-img가 파일명에 내용 해시를 넣어 출력한다.
      `${PATH_PREFIX}img/*`,
      `  Cache-Control: ${immutable}`,
      "",
      // assetUrl 필터가 ?v=<내용 해시>를 붙인다.
      `${PATH_PREFIX}assets/css/*`,
      `  Cache-Control: ${immutable}`,
      "",
      `${PATH_PREFIX}assets/js/*`,
      `  Cache-Control: ${immutable}`,
      "",
      // build-fonts.mjs가 파일명에 내용 해시를 넣어 출력한다.
      `${PATH_PREFIX}assets/fonts/*`,
      `  Cache-Control: ${immutable}`,
      "",
      `${PATH_PREFIX}assets/img/*`,
      `  Cache-Control: ${shortLived}`,
      "",
      `${PATH_PREFIX}images/*`,
      `  Cache-Control: ${shortLived}`,
      "",
      "https://:project.pages.dev/*",
      "  X-Robots-Tag: noindex",
      "",
    ].join("\n");
  }
}
