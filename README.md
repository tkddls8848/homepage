# (주)트라이얼정보통신 홈페이지

기존 `www.trialinfo.com` (PHP include + jQuery + 페이지별 복사·붙여넣기 구조)를
**정적 사이트 + 데이터 기반 구조**로 다시 만든 것입니다.
콘텐츠와 URL 구조는 유지하고 마크업·스타일·스크립트·배포 방식을 교체했습니다.
로고·슬라이드·제품 이미지는 원본 사진 파일을 받을 수 없어 **같은 자리에 벡터로
그려 넣었습니다** (교체 방법: [docs/ASSETS.md](docs/ASSETS.md)).

## 무엇이 달라졌는가

| 항목 | 기존 | 지금 |
| --- | --- | --- |
| 페이지 생성 | `.php` 20개, header/nav/footer/제품 마크업을 파일마다 복사 | 레이아웃 1벌 + 데이터 파일. 제품·서비스 페이지는 데이터에서 자동 생성 |
| 메뉴 수정 | 20개 파일을 모두 수정 | `src/_data/nav.js` 한 곳 |
| 제품 추가 | 새 `.php` 파일 + 탭 메뉴 4곳 수정 | `src/_data/catalog.js` 에 항목 추가 (URL·탭·sitemap 자동) |
| CSS | `nav.css` + `base.css` + `product.css`, 고정 픽셀 폭 | `main.css` 1개. 커스텀 프로퍼티 토큰 + Grid/Flex 반응형 |
| JS | jQuery 3.5.1 (88KB) + 스크립트 7개 | 의존성 없는 ES module 1개 (약 7KB) |
| 슬라이더 | `left` 값을 픽셀로 계산 → 창 크기 변경 시 어긋남, 터치 불가 | CSS `scroll-snap` 기반. 터치·키보드 기본 지원 |
| 애니메이션 | 길고 큰 이동, 끌 수 없음 | 220~420ms 짧은 모션 + `prefers-reduced-motion` 존중 |
| 모바일 | 별도 마크업(`m_tab`)을 따로 유지 | 같은 마크업이 반응형으로 동작 |
| 접근성 | 이미지 텍스트, 키보드 이동 어려움 | 시맨틱 마크업, `aria-current`, 포커스 표시, 건너뛰기 링크, 텍스트 조직도 |
| HTTPS | 미적용 | 정적 호스팅의 기본 HTTPS + HSTS 헤더 + `.htaccess` 강제 리다이렉트 제공 |
| 기존 URL | — | `.php` 주소 → 새 주소 301 리다이렉트 자동 생성 |

## 시작하기

```bash
npm install
npm run dev           # http://localhost:8080 (파일 저장 시 자동 반영)
npm run build         # _site/ 에 정적 파일 생성
npm run check:links   # 빌드 결과의 내부 링크·이미지 경로 점검
npm run make:og       # SNS 미리보기 이미지(og:image) 다시 생성
```

Node 20 이상이 필요합니다.

## 디렉터리 구조

```
src/
├── _data/                 ← 콘텐츠는 대부분 여기에 있습니다
│   ├── site.js            회사명·주소·연락처 (전역)
│   ├── nav.js             메뉴 구조 (헤더·푸터·탭이 여기서 파생)
│   ├── catalog.js         제품 카탈로그 → 제품 페이지 자동 생성
│   ├── services.js        IT Infra 서비스 → 서비스 페이지 자동 생성
│   ├── company.js         회사개요·연혁·조직도
│   ├── career.js          인재상·복리후생·채용공고
│   ├── hero.js            메인 슬라이드
│   └── redirects.js       기존 .php URL 매핑
├── _includes/
│   ├── layouts/           base.njk (문서 골격), page.njk (일반 페이지)
│   └── partials/          헤더·푸터·히어로·탭·제품카드·CTA
├── assets/
│   ├── css/main.css       스타일 전체 (@layer 로 정리)
│   └── js/main.js         스크립트 전체
├── images/                로고·슬라이드·제품 이미지 (docs/ASSETS.md 참고)
└── *.njk                  각 페이지
```

## URL 구조

기존 주소는 모두 301 리다이렉트로 연결됩니다.

| 기존 | 새 주소 |
| --- | --- |
| `/index.php` | `/products/ibm/power-unix-server/` |
| `/product_lenovo_x86-server.php` | `/products/lenovo/x86-server/` |
| `/about-us_about.php` | `/about/` |
| `/about-us_history.php` | `/about/history/` |
| `/it-infra-service_consulting.php` | `/it-infra/` |
| `/contact-us_inquiry.php` | `/contact/inquiry/` |

전체 목록은 `src/_data/redirects.js` 에 있습니다.
기존 사이트는 `index.php` 가 제품 페이지였는데, 새 구조에서는 `/` 를 회사 소개
성격의 홈으로 두고 제품 페이지는 `/products/…` 로 분리했습니다.

## 콘텐츠 수정 방법

자주 하는 작업만 정리했습니다. 자세한 내용은 [docs/CONTENT.md](docs/CONTENT.md).

- **연락처·주소 변경** → `src/_data/site.js`
- **제품 추가/수정** → `src/_data/catalog.js`
- **메뉴 추가** → `src/_data/nav.js`
- **사진 교체** → `src/images/` (경로는 기존 사이트와 동일, [docs/ASSETS.md](docs/ASSETS.md))

## 배포

정적 파일이므로 어디에 올려도 되고, 아래 세 방법 모두 HTTPS 가 기본입니다.

### 1. GitHub Pages (설정 파일 포함)

`.github/workflows/deploy.yml` 이 `main` 브랜치 푸시마다 빌드·배포합니다.

**최초 1회 설정** (이걸 하지 않으면 deploy 단계가 `404 Ensure GitHub Pages has been
enabled` 로 실패합니다. 저장소 설정이라 코드로는 켤 수 없습니다.)

1. 저장소 **Settings → Pages → Source** 를 `GitHub Actions` 로 변경
2. **Actions → Build & Deploy → Re-run all jobs** 로 재실행

이 상태에서 `https://tkddls8848.github.io/homepage/` 로 접속됩니다.

#### 하위 경로(`/homepage/`) 주의

프로젝트 사이트는 주소에 저장소 이름이 붙습니다. 그래서 `/assets/css/main.css`,
`/images/...` 같은 **루트 기준 경로가 모두 404** 가 되고, 결과적으로 스타일과
이미지가 전부 사라진 것처럼 보입니다.

워크플로가 `actions/configure-pages` 로 실제 배포 주소를 받아 빌드에 넘기므로
(`PATH_PREFIX=/homepage/`) 별도 설정 없이 맞춰집니다. 로컬에서 같은 조건을
확인하려면:

```bash
PATH_PREFIX=/homepage/ npm run build
PATH_PREFIX=/homepage/ npm run check:links
```

커스텀 도메인(루트 배포)에서는 접두사가 붙지 않습니다.

#### HTTPS

`*.github.io` 는 GitHub 이 인증서를 제공하고 http 요청을 https 로 리다이렉트합니다.
`http://tkddls8848.github.io/homepage/` 로 들어와도 https 로 바뀝니다.
빌드는 canonical·OG·sitemap 주소도 실제 배포 주소(https)로 맞추므로,
검색엔진이 http 판이나 다른 도메인을 색인하지 않습니다.

#### www.trialinfo.com 을 HTTPS 로 붙이기

GitHub Pages 는 커스텀 도메인에 Let's Encrypt 인증서를 무료로 자동 발급합니다.
**순서를 지키는 것이 중요합니다.** DNS 가 준비되기 전에 CNAME 파일을 올리면
사이트에 접속할 수 없게 됩니다.

1. **DNS 레코드 추가** (도메인 등록업체 관리 화면)

   | 종류 | 이름 | 값 |
   | --- | --- | --- |
   | CNAME | `www` | `tkddls8848.github.io.` |

   `trialinfo.com`(www 없는 주소)까지 함께 쓰려면 A 레코드 4개를 추가합니다.
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   (IPv6 는 AAAA 로 `2606:50c0:8000::153` ~ `2606:50c0:8003::153`)

2. **DNS 전파 확인** — `dig www.trialinfo.com CNAME +short` 가 위 값을 돌려주면 완료.
   보통 몇 분~수 시간 걸립니다.

3. **저장소 Variables 에 `CUSTOM_DOMAIN` 추가**
   Settings → Secrets and variables → Actions → Variables → New variable
   이름 `CUSTOM_DOMAIN`, 값 `www.trialinfo.com`
   → 다음 빌드에서 `CNAME` 파일이 자동 생성됩니다.

4. **Settings → Pages → Custom domain** 에 `www.trialinfo.com` 입력 후 저장.
   DNS 검증이 끝나면 **Enforce HTTPS** 체크박스가 활성화되므로 켜 주세요.
   (인증서 발급에 보통 15분 이내 소요)

`CUSTOM_DOMAIN` 을 설정하면 canonical·OG·sitemap 주소가 그 도메인으로 맞춰지고
경로 접두사도 사라집니다(루트 배포). 따로 `SITE_URL` 을 넣을 필요는 없습니다.

> ⚠️ 현재 `www.trialinfo.com` 은 기존 서버를 가리키고 있습니다. 3번 이전에
> DNS 를 GitHub 로 돌리면 그 시점부터 기존 사이트는 보이지 않습니다.
> 전환 시점을 정한 뒤 진행하세요. 기존 서버를 계속 쓰실 거면 아래 3번 방법을 보세요.

### 2. Netlify / Cloudflare Pages

`netlify.toml` 이 있습니다. 빌드 명령 `npm run build`, 출력 디렉터리 `_site`.
빌드 결과에 포함되는 `_redirects`(301 목록)와 `_headers`(HSTS·CSP 등)를 그대로 인식합니다.

### 3. 기존 Apache 호스팅 유지

`npm run build` 결과인 `_site/` 의 내용을 웹 루트에 올리면 됩니다.
함께 생성되는 `.htaccess` 가 다음을 처리합니다.

- http → https 301 (기존 HTTPS 미적용 문제 해결)
- 기존 `.php` 주소 → 새 주소 301
- 보안 헤더(HSTS 등), gzip 압축, 캐시 설정

> 인증서가 아직 없다면 Let's Encrypt 무료 인증서를 먼저 발급하세요.
> 인증서 없이 `.htaccess` 의 HTTPS 강제만 켜면 사이트에 접속할 수 없습니다.
> `www` 통일 규칙이 필요 없으면 `src/htaccess.njk` 의 해당 블록을 지우세요.

### 환경 변수

| 이름 | 용도 | 기본값 |
| --- | --- | --- |
| `SITE_URL` | canonical·OG·sitemap 에 쓰는 사이트 주소 (항상 https 로 정규화됨) | `https://www.trialinfo.com` |
| `PATH_PREFIX` | 하위 경로 배포용 접두사 (예: `/homepage/`) | `/` |
| `FORM_ENDPOINT` | 문의 폼을 받을 주소. 비우면 메일 클라이언트(mailto)로 대체 | (없음) |
| `CUSTOM_DOMAIN` | 설정하면 `CNAME` 생성 + 루트 배포로 간주 | (없음) |

GitHub Actions 배포에서는 `SITE_URL` 과 `PATH_PREFIX` 를 워크플로가 실제 배포
주소에서 계산하므로 직접 넣지 않아도 됩니다. 저장소 Variables 로는
`CUSTOM_DOMAIN` 과 `FORM_ENDPOINT` 만 다루면 됩니다.

## 남은 작업

원본 사이트에서 가져올 수 없었던 콘텐츠가 있습니다.
[docs/CONTENT.md](docs/CONTENT.md) 의 "채워야 하는 내용" 목록을 확인해 주세요.
특히 **개인정보취급방침**은 법적 문서이므로 공개 전 반드시 실제 내용으로 교체해야 합니다.

이미지도 마찬가지입니다. 현재 로고·슬라이드·제품 이미지는 브랜드 색으로 직접
그린 벡터 이미지이고, 제품 이미지는 특정 모델의 사진이 아니라 폼팩터(2U / 4U /
랙)를 나타내는 그림입니다. 실제 로고 파일과 제조사 제품 사진이 준비되면
[docs/ASSETS.md](docs/ASSETS.md) 의 방법으로 교체해 주세요.
