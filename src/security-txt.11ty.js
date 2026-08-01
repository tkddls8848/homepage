/**
 * security.txt (RFC 9116) 생성기 → /.well-known/security.txt
 *
 * 누군가 이 사이트에서 취약점을 발견했을 때 어디로 알려야 하는지를 적어 두는
 * 표준 파일입니다. 없으면 발견자가 연락할 곳을 못 찾아 그냥 공개해 버리거나,
 * 아무 주소로나 보내다 묻힙니다. 기업 홈페이지의 최소 항목으로 자리잡았습니다.
 *
 * Expires 는 필수 필드이고 1년 이내여야 합니다. 날짜를 손으로 박아 두면
 * 반드시 만료된 채로 방치되므로, 빌드할 때마다 1년 뒤로 다시 계산합니다.
 * (배포는 Dependabot PR 병합 등으로 최소 월 1회 일어나므로 자연히 갱신됩니다.)
 *
 * Cloudflare Pages 는 루트 배포라 이 파일이 도메인 루트의 /.well-known/ 에
 * 놓입니다. RFC 9116 이 요구하는 위치입니다.
 */
export default class SecurityTxt {
  data() {
    const expires = new Date();
    expires.setUTCFullYear(expires.getUTCFullYear() + 1);

    return {
      expires: expires.toISOString().replace(/\.\d{3}Z$/, "Z"),
      permalink: "/.well-known/security.txt",
      eleventyExcludeFromCollections: true,
      eleventyAllowMissingExtension: true,
    };
  }

  render({ expires, site }) {
    return [
      `Contact: mailto:${site.contact.email}`,
      `Expires: ${expires}`,
      "Preferred-Languages: ko, en",
      `Canonical: ${site.url}/.well-known/security.txt`,
      "",
    ].join("\n");
  }
}
