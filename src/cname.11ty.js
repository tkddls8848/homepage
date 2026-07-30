/**
 * GitHub Pages 커스텀 도메인 설정 파일(CNAME) 생성기.
 *
 * 환경 변수 CUSTOM_DOMAIN 이 있을 때만 /CNAME 을 만듭니다.
 *   CUSTOM_DOMAIN=www.trialinfo.com npm run build
 *
 * 왜 조건부인가:
 * CNAME 파일이 있으면 GitHub Pages 는 그 도메인으로만 사이트를 서비스합니다.
 * DNS 설정이 끝나기 전에 이 파일을 넣으면 사이트에 접속할 수 없게 되므로,
 * DNS 준비가 된 뒤에 변수를 설정해 켜는 방식으로 두었습니다.
 *
 * GitHub Actions 에서는 저장소 Variables 에 CUSTOM_DOMAIN 을 추가하면 됩니다.
 * (Settings → Secrets and variables → Actions → Variables)
 */
export default class CnameFile {
  data() {
    const domain = (process.env.CUSTOM_DOMAIN || "").trim();
    return {
      domain,
      permalink: domain ? "/CNAME" : false,
      eleventyExcludeFromCollections: true,
      // CNAME 은 확장자가 없는 것이 정상입니다.
      eleventyAllowMissingExtension: true,
    };
  }

  render({ domain }) {
    return `${domain}\n`;
  }
}
