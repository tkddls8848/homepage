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

    /*
     * 카카오 "지도 퍼가기"에 필요한 출처.
     *
     * 오시는 길 페이지의 지도는 카카오 CDN 에서 스크립트를 받아 실행합니다.
     * 즉 script-src 에 외부 출처가 들어가며, 이는 이 사이트에서 가장 강한
     * 방어(주입된 스크립트의 실행 차단)를 그만큼 넓히는 일입니다.
     * 카카오가 신뢰할 만한 상대라 실질 위험은 낮다고 보고 받아들였습니다.
     *
     * 불러오는 순서가 여러 단계라 서브도메인을 특정할 수 없습니다.
     *   1. ssl.daumcdn.net/dmaps/.../roughmapLoader.js   최초 로더
     *   2. t1.kakaocdn.net/.../roughmapLander.js         위젯 본체
     *   3. t1.kakaocdn.net/roughmap/{key}.json           등록된 지도 데이터
     *   4. ssl.daumcdn.net/dmaps/map_js_init/v3.js       카카오맵 SDK
     *   5. SDK 가 지도 타일 이미지를 받아옴  ← 여기가 문제였습니다
     *
     * 처음에는 위 두 호스트만 허용했더니 4번까지는 통과하고 5번이 막혀서,
     * 지도 자리에 빈 네모만 남았습니다. 타일 서버는 map1~4.daumcdn.net 처럼
     * 여러 개이고 언제든 늘 수 있어 개별 지정이 어렵습니다. 두 CDN 도메인
     * 전체를 허용합니다.
     *
     * 로그 수집 서버(stlog1-local.kakao.com)는 일부러 넣지 않았습니다.
     * 지도 표시에 필요하지 않고, 방문자 데이터를 넘길 이유도 없습니다.
     *
     * ⚠️ Cloudflare _headers 는 경로별로 정책을 나눠도 두 정책이 함께
     *    적용(교집합)되므로, 지도 페이지만 따로 완화할 수 없습니다.
     *    그래서 전역 정책에 넣습니다. 지도 스크립트를 실제로 불러오는 페이지는
     *    front matter 에 kakaoMap: true 를 준 곳뿐입니다.
     */
    const KAKAO = "https://*.daumcdn.net https://*.kakaocdn.net";

    const csp = [
      "default-src 'self'",
      "base-uri 'none'",
      "object-src 'none'",
      "frame-src 'none'",
      // meta 로는 무시되던 지시어. 이 사이트를 iframe 에 넣지 못하게 합니다.
      "frame-ancestors 'none'",
      `script-src 'self' ${KAKAO}`,
      // 템플릿의 style="..." 속성 때문에 남아 있습니다. 그 속성들을
      // main.css 클래스로 옮기면 제거할 수 있습니다.
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com ${KAKAO}`,
      "font-src 'self' https://fonts.gstatic.com",
      // blob: 은 지도 SDK 가 타일을 합성해 그릴 때 씁니다.
      `img-src 'self' data: blob: ${KAKAO}`,
      `connect-src 'self'${extra} ${KAKAO}`,
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
