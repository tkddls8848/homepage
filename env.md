  0단계 — PR 병합

  먼저 [https://github.com/tkddls8848/homepage/pull/1](https://github.com/tkddls8848/homepage/pull/1) 을 병합해 main을 최신으로 만드세요. Cloudflare는 main을 빌드합니다.

  1단계 — Web3Forms 키 발급 (먼저 해두면 편합니다)

  1. [https://web3forms.com](https://web3forms.com) 접속

  2. [psi@trialinfo.com](mailto:psi@trialinfo.com) 입력 → Create Access Key

  3. 그 메일함으로 키가 옵니다 (가입 절차 없음)

  ▎ 문의 메일이 어디로 갈지는 이 키가 정합니다. 나중에 운영 전환 시 master@로 키를 새로 발급받아 교체하세요.

  2단계 — Cloudflare Pages 프로젝트 생성

  1. [https://dash.cloudflare.com](https://dash.cloudflare.com) → Workers &amp; Pages → Create → Pages → Connect to Git

  2. GitHub 앱 승인 → tkddls8848/homepage 선택

  3. 빌드 설정:

  ┌────────────────────────┬───────────────┐

  │          항목          │      값       │

  ├────────────────────────┼───────────────┤

  │ Production branch      │ main          │

  ├────────────────────────┼───────────────┤

  │ Framework preset       │ None          │

  ├────────────────────────┼───────────────┤

  │ Build command          │ npm run build │

  ├────────────────────────┼───────────────┤

  │ Build output directory │ _site         │

  ├────────────────────────┼───────────────┤

  │ Root directory         │ (비움)        │

  └────────────────────────┴───────────────┘

  ▎ Node 버전은 넣지 마세요. .nvmrc(=24)를 자동으로 읽습니다.

  3단계 — 환경변수 4개

  Settings → Environment variables → Production 에 추가:

  ┌─────────────────┬──────────────────────────────────┐

  │      이름       │                값                │

  ├─────────────────┼──────────────────────────────────┤

  │ SITE_URL        │ https://&lt;프로젝트명&gt;.[pages.dev](http://pages.dev)   │

  ├─────────────────┼──────────────────────────────────┤

  │ FORM_ENDPOINT   │ [https://api.web3forms.com/submit](https://api.web3forms.com/submit) │

  ├─────────────────┼──────────────────────────────────┤

  │ FORM_ACCESS_KEY │ 1단계에서 받은 키                │

  ├─────────────────┼──────────────────────────────────┤

  │ CONTACT_EMAIL   │ [psi@trialinfo.com](mailto:psi@trialinfo.com)                │

  └─────────────────┴──────────────────────────────────┘

  ⚠️  SITE_URL을 처음부터 [www.trialinfo.com](http://www.trialinfo.com)으로 두지 마세요. 아직 그 도메인이 이 사이트를 안 가리키므로 canonical/OG/sitemap이 죽은

  주소를 가리키게 됩니다.

  전부 일반 변수로 넣으세요. Secret이 아닙니다 — access_key는 공개 키이고, 나머지는 어차피 HTML에 박힙니다.

  4단계 — 배포 후 확인

  Save and Deploy → 첫 빌드가 돕니다. 로그에서 ✓ _redirects 규칙 28개 이상 없음이 보이면 정상입니다.

  # 보안 헤더가 실제로 나가는지

  curl -I https://&lt;프로젝트&gt;.[pages.dev](http://pages.dev) | grep -i "content-security\|strict-transport\|x-frame"

  # 기존 .php 주소가 301 되는지

  curl -sI https://&lt;프로젝트&gt;.pages.dev/about-us_about.php | head -3

  그리고 문의 폼에 실제로 한 건 넣어보세요. [psi@trialinfo.com](mailto:psi@trialinfo.com)으로 도착해야 합니다.

  5단계 — SSL 설정

  SSL/TLS → Overview → Full (strict), Edge Certificates → Always Use HTTPS 켜기.

  HSTS는 _headers가 이미 보내므로 대시보드 HSTS는 켜지 마세요(두 곳에서 관리하면 어긋납니다).