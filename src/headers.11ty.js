/**
 * Cloudflare Pages 의 `_headers` 파일 생성기.
 *
 * GitHub Pages 는 HTTP 응답 헤더를 설정할 수 없어서 CSP 를 <meta> 로 넣어야 했고,
 * 그 방식으로는 `frame-ancestors`(클릭재킹 차단)와 HSTS 가 아예 동작하지 않았습니다.
 * Cloudflare Pages 로 옮기면서 전부 진짜 헤더로 내보냅니다.
 *
 * 생성 파일이라 손으로 고치지 마세요. 정책을 바꾸려면 이 파일을 고칩니다.
 * (`FORM_ENDPOINT` 를 설정하면 그 출처가 connect-src/form-action 에 자동 추가되므로
 *  정적 파일로 둘 수 없어 생성기로 만들었습니다.)
 */
export default class HeadersFile {
  data() {
    return {
      permalink: "/_headers",
      eleventyExcludeFromCollections: true,
      eleventyAllowMissingExtension: true,
    };
  }

  render({ site }) {
    const extra = site.formEndpointOrigin ? ` ${site.formEndpointOrigin}` : "";

    const csp = [
      "default-src 'self'",
      "base-uri 'none'",
      "object-src 'none'",
      "frame-src 'none'",
      // meta 로는 무시되던 지시어. 이 사이트를 iframe 에 넣지 못하게 합니다.
      "frame-ancestors 'none'",
      "script-src 'self'",
      // 템플릿의 style="..." 속성 때문에 남아 있습니다. 그 속성들을
      // main.css 클래스로 옮기면 제거할 수 있습니다.
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data:",
      `connect-src 'self'${extra}`,
      `form-action 'self'${extra}`,
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      "# 자동 생성 파일 — src/headers.11ty.js 에서 만듭니다. 직접 고치지 마세요.",
      "",
      "/*",
      `  Content-Security-Policy: ${csp}`,
      // 1년간 이 도메인은 https 로만 접속. 첫 요청의 중간자 공격을 막습니다.
      // includeSubDomains / preload 는 일부러 뺐습니다 — 다른 하위 도메인이
      // http 로 서비스 중이면 그것들까지 접속 불가가 되고, preload 는 브라우저에
      // 박혀서 되돌리는 데 몇 달이 걸립니다. 하위 도메인을 전부 확인한 뒤
      // 붙이세요.
      "  Strict-Transport-Security: max-age=31536000",
      // 선언된 Content-Type 을 브라우저가 멋대로 추측하지 않게 합니다.
      "  X-Content-Type-Options: nosniff",
      // CSP frame-ancestors 를 못 읽는 구형 브라우저용 보완.
      "  X-Frame-Options: DENY",
      "  Referrer-Policy: strict-origin-when-cross-origin",
      // 쓰지 않는 브라우저 기능을 아예 꺼 둡니다.
      "  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()",
      "",
      "# *.pages.dev 주소는 검색엔진이 색인하지 않게 합니다.",
      "# 실제 도메인과 pages.dev 가 같은 내용으로 둘 다 색인되면 중복 콘텐츠가 되고,",
      "# 검색 결과에 임시 주소가 뜨게 됩니다. 프리뷰 배포도 여기에 걸립니다.",
      "https://:project.pages.dev/*",
      "  X-Robots-Tag: noindex",
      "",
    ].join("\n");
  }
}
