# (주)트라이얼정보통신 홈페이지

기존 `www.trialinfo.com` (PHP include + jQuery + 페이지별 복사·붙여넣기 구조)를
**정적 사이트 + 데이터 기반 구조**로 다시 만든 것입니다.
콘텐츠와 URL 구조는 유지하고 마크업·스타일·스크립트·배포 방식을 교체했습니다.
로고·슬라이드·제품 이미지는 **원본 사이트의 에셋을 원본 경로 그대로** 가져와
사용합니다 (`npm run crawl:old-site`, `npm run import:images`).

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
| 호스팅 | 자체 서버 (PHP) | Cloudflare Pages. 푸시하면 자동 빌드·배포 |
| HTTPS | 미적용 | Cloudflare 가 인증서를 발급·갱신, http → https 리다이렉트 |
| 기존 `.php` 주소 | — | 28개 전부 301 로 새 주소 연결 (`src/_redirects`) |
| 보안 헤더 | 없음 | CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy |
| 문의 수신 | 서버 스크립트(`inquiry_post.php`) | Web3Forms. 실패 시 mailto 자동 폴백 |
| 문의 폼 보안 | 개인정보 동의 절차 없음, 길이·형식 제한 없음 | 동의 체크박스(법정 고지 4항목), 길이·형식 검증, 중복 전송·봇 차단 |
| 의존성 관리 | — | Dependabot 월 1회 PR + 빌드 시 `npm audit` 차단 |

## 시작하기

```bash
npm install
npm run dev           # http://localhost:8080 (파일 저장 시 자동 반영)
npm run build         # npm audit → 빌드 → 링크·리다이렉트 점검 (배포와 동일)
npm run build:only    # 검증 없이 빌드만 (빠른 반복용)
npm run check:links   # 빌드 결과의 내부 링크·이미지·_redirects 대상 점검

npm run crawl:old-site   # 기존 사이트(http) 미러링 → ./old-site
npm run import:images    # 받은 images 폴더를 src/images/ 로 합치고 누락 검사
```

**Node 24 (LTS "Krypton")** 이 필요합니다. 버전은 `.nvmrc` 한 곳에 적어 두고
로컬(`nvm use`)과 CI(`setup-node`의 `node-version-file`)가 같은 값을 씁니다.

> Node 20 "Iron" 은 2026년 4월, Node 23 은 2025년 6월에 지원이 끝났습니다.
> `node -v` 가 24.x 가 아니면 먼저 올려 주세요.

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
│   └── hero.js            메인 슬라이드
├── _includes/
│   ├── layouts/           base.njk (문서 골격), page.njk (일반 페이지)
│   └── partials/          헤더·푸터·히어로·탭·제품카드·CTA
├── assets/
│   ├── css/main.css       스타일 전체 (@layer 로 정리)
│   └── js/main.js         스크립트 전체
├── images/                로고·슬라이드·제품 이미지 (원본 사이트 경로 유지)
└── *.njk                  각 페이지
```

## URL 구조

기존 `.php` 주소와 새 주소의 대응은 다음과 같습니다.

| 기존 | 새 주소 |
| --- | --- |
| `/index.php` | `/products/ibm/power-unix-server/` |
| `/product_lenovo_x86-server.php` | `/products/lenovo/x86-server/` |
| `/about-us_about.php` | `/about/` |
| `/about-us_history.php` | `/about/history/` |
| `/it-infra-service_consulting.php` | `/it-infra/` |
| `/contact-us_inquiry.php` | `/contact/inquiry/` |

기존 사이트는 `index.php` 가 제품 페이지였는데, 새 구조에서는 `/` 를 회사 소개
성격의 홈으로 두고 제품 페이지는 `/products/…` 로 분리했습니다.

기존 `.php` 주소 **28개 전부**가 `src/_redirects` 에서 301 로 새 주소를 가리킵니다.
Cloudflare Pages 가 서버에서 처리하므로 기존 주소로 들어오는 방문자와 검색엔진이
404 를 보지 않고, 검색엔진은 기존 주소의 평가를 새 주소로 넘깁니다.

> GitHub Pages 를 쓰던 동안에는 이게 불가능했습니다(서버 리다이렉트 미지원).
> Cloudflare 로 옮기면서 해결된 항목입니다.

규칙이 실제 존재하는 페이지를 가리키는지는 `npm run check:links` 가 빌드마다
확인합니다. 페이지 URL 을 바꿀 때 `src/_redirects` 를 같이 고치지 않으면
빌드가 실패합니다.

## 콘텐츠 수정 방법

콘텐츠는 대부분 `src/_data/` 안에 있습니다. 각 파일 상단 주석에 형식이 적혀 있습니다.

- **연락처·주소 변경** → `src/_data/site.js`
- **대표 이메일** → `src/_data/site.js` 의 `contact.email` **한 곳**. 헤더·푸터·
  연락처 카드 2곳·채용 접수 안내·문의 폼 mailto 폴백·security.txt·JSON-LD 가
  모두 여기서 나옵니다. 테스트 주소로 잠깐 바꿀 때는 코드를 고치지 말고
  환경 변수 `CONTACT_EMAIL` 을 쓰세요 (아래 "환경 변수" 참고)
- **제품 추가/수정** → `src/_data/catalog.js`
- **메뉴 추가** → `src/_data/nav.js`
- **사진 교체** → `src/images/` (경로는 기존 사이트와 동일)

## 배포

**Cloudflare Pages (Git 연동)** 입니다. `main` 브랜치에 푸시하면 Cloudflare 가
저장소를 가져다 직접 빌드·배포합니다. GitHub Actions 워크플로는 없습니다.

Git 연동을 고른 이유는 **API 토큰을 만들지 않기 위해서**입니다. GitHub Actions 에서
`wrangler` 로 올리는 방식도 가능하지만, 그러려면 장기 유효한 Cloudflare 토큰을
GitHub Secrets 에 보관해야 합니다. 회전·폐기를 챙길 사람이 없으면 그 토큰은
그대로 방치되므로, 아예 만들지 않는 쪽을 택했습니다.

대신 검증이 배포 경로에서 빠지지 않도록 `npm run build` 자체에 엮었습니다.

```
build = verify:deps (npm audit) → eleventy → check:links
```

Cloudflare 는 `npm run build` 만 실행하지만, 취약점이 있거나 내부 링크·리다이렉트
대상이 깨져 있으면 **빌드가 실패해 배포가 멈춥니다.** 빌드만 하려면 `build:only`.

### 최초 1회 설정 (Cloudflare 대시보드)

저장소 코드로는 켤 수 없는 부분이라 직접 하셔야 합니다.

1. **Workers & Pages → Create → Pages → Connect to Git**
   GitHub 앱을 승인하고 이 저장소를 선택합니다.

2. **빌드 설정**

   | 항목 | 값 |
   | --- | --- |
   | Framework preset | None |
   | Build command | `npm run build` |
   | Build output directory | `_site` |
   | Root directory | (비움) |

3. **환경 변수** (Settings → Environment variables)

   | 이름 | 값 | 비고 |
   | --- | --- | --- |
   | `SITE_URL` | 배포 주소 | 아래 주의 참고 |

   > **Node 버전은 설정하지 마세요.** Cloudflare Pages 는 저장소 루트의 `.nvmrc`
   > 를 읽습니다(`24`). `NODE_VERSION` 환경 변수로도 지정할 수 있지만, 둘 다 두면
   > 진실의 출처가 두 곳이 되어 나중에 어긋납니다. 버전을 올릴 때는 `.nvmrc`
   > 한 곳만 고치세요.

   > ⚠️ **`SITE_URL` 을 처음부터 `https://www.trialinfo.com` 으로 두지 마세요.**
   > 도메인을 붙이기 전까지는 사이트가 `*.pages.dev` 에 있는데, canonical·OG·sitemap
   > 이 아직 살아 있지 않은 주소를 가리키게 됩니다. 도메인 연결 전에는
   > `https://<프로젝트>.pages.dev`, 연결 후에 `https://www.trialinfo.com` 으로
   > 바꾸세요. (`*.pages.dev` 는 `_headers` 가 `X-Robots-Tag: noindex` 를 붙여
   > 검색엔진이 색인하지 않으므로 중복 콘텐츠 문제는 생기지 않습니다.)

4. **저장 후 첫 배포**가 돌면 `https://<프로젝트>.pages.dev` 로 접속됩니다.

### HTTPS

**설정할 것이 없습니다.** Cloudflare 가 인증서 발급·갱신과 http → https 리다이렉트를
전부 처리합니다. `*.pages.dev` 도, 나중에 붙일 커스텀 도메인도 동일합니다.

```
$ curl -sI http://<프로젝트>.pages.dev
HTTP/1.1 301 Moved Permanently
Location: https://<프로젝트>.pages.dev/     ← 설정 없이 자동
```

> **대시보드에서 SSL/TLS 메뉴를 찾지 마세요.** 그 메뉴는 **도메인(Zone) 단위**라
> `Workers & Pages` 아래에 없습니다. Cloudflare 에 도메인을 추가했을 때 그 도메인
> 대시보드에 생기며, DNS 를 기존 등록업체에 두고 CNAME 만 걸면 끝까지 생기지
> 않습니다. 어느 경우든 HTTPS 는 정상 동작합니다.
>
> `Full (strict)` 같은 암호화 모드도 신경 쓸 필요가 없습니다. 그건 Cloudflare 와
> **원본 서버** 사이의 구간 설정인데, Pages 는 원본 서버 없이 Cloudflare 가 정적
> 파일을 직접 서빙하므로 해당 사항이 없습니다.

HSTS(`Strict-Transport-Security`)는 대시보드가 아니라 `_headers` 에서 나갑니다
(`src/headers.11ty.js`). 두 곳에서 관리하면 어긋나므로 대시보드 HSTS 는 켜지 마세요.

### www.trialinfo.com 붙이기

1. **Cloudflare Pages → 프로젝트 → Custom domains → Set up a domain** 에
   `www.trialinfo.com` 입력
2. 화면에 표시되는 **CNAME 레코드를 도메인 등록업체 DNS 에 추가**
   (도메인 자체를 Cloudflare 로 이관했다면 레코드가 자동 생성됩니다)
3. 검증이 끝나면 인증서가 자동 발급됩니다 (보통 몇 분)
4. 환경 변수 `SITE_URL` 을 `https://www.trialinfo.com` 으로 바꾸고 재배포

> ⚠️ 현재 `www.trialinfo.com` 은 기존 서버를 가리킵니다. DNS 를 Cloudflare 로
> 돌리는 시점부터 기존 사이트는 보이지 않습니다. 전환 시점을 정한 뒤 진행하세요.

### 하위 경로 배포는 이제 없습니다

GitHub Pages 프로젝트 사이트는 주소에 저장소 이름이 붙어서(`/homepage/`)
`PATH_PREFIX` 로 맞춰 줘야 했습니다. Cloudflare Pages 는 루트 배포라 접두사가
없습니다. `PATH_PREFIX` 환경 변수는 기본값 `/` 로 남겨 두었고 설정할 필요가
없습니다.

### 보안 헤더

`src/headers.11ty.js` 가 `_headers` 파일을 생성하고, Cloudflare Pages 가 이를
**진짜 HTTP 응답 헤더**로 내보냅니다. `_headers` 는 생성물이므로 직접 고치지 마세요.

| 헤더 | 역할 |
| --- | --- |
| `Content-Security-Policy` | 아래 참고 |
| `Strict-Transport-Security` | 1년간 이 도메인은 https 로만 접속 |
| `X-Frame-Options: DENY` | 클릭재킹 차단 (CSP 를 못 읽는 구형 브라우저용 보완) |
| `X-Content-Type-Options: nosniff` | 브라우저의 Content-Type 추측 금지 |
| `Referrer-Policy` | 외부로 나갈 때 전체 URL 대신 출처만 전달 |
| `Permissions-Policy` | 위치·마이크·카메라·결제·USB 기능 차단 |

```
default-src 'self'; base-uri 'none'; object-src 'none'; frame-src 'none';
frame-ancestors 'none'; script-src 'self';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com; img-src 'self' data:;
connect-src 'self'; form-action 'self'; upgrade-insecure-requests
```

핵심은 `script-src 'self'` 입니다. 어떤 경로로든 스크립트가 주입되어도
`/assets/js/main.js` 외에는 실행되지 않습니다.

**GitHub Pages 시절과 달라진 점** — 그때는 헤더를 설정할 수 없어 CSP 를 `<meta>` 로
넣었고, 그 방식에서는 `frame-ancestors` 와 HSTS 가 **무시됐습니다**. 즉 클릭재킹을
막을 방법이 없었습니다. 지금은 둘 다 동작합니다. 정책이 두 곳으로 갈리지 않도록
`base.njk` 의 meta 판은 제거했습니다.

**의도적으로 넣지 않은 것**

- `style-src` 의 `'unsafe-inline'` 은 남아 있습니다. 템플릿 여러 곳에 `style="..."`
  속성이 있기 때문입니다 (`src/index.njk`, `src/about/*.njk`,
  `src/it-infra/service.njk`, `src/etc/recruit.njk`). 이 속성들을 `main.css` 의
  클래스로 옮기면 제거할 수 있습니다.
- HSTS 에 `includeSubDomains` 와 `preload` 를 **빼 두었습니다.** 다른 하위 도메인이
  http 로 서비스 중이면 그것들까지 접속 불가가 되고, `preload` 는 브라우저에 박혀
  되돌리는 데 몇 달이 걸립니다. 하위 도메인을 전부 확인한 뒤 붙이세요.

`FORM_ENDPOINT` 를 설정하면 그 출처가 `connect-src` 와 `form-action` 에
자동으로 추가됩니다 (`src/_data/site.js` 의 `formEndpointOrigin`).
CSP 가 폼 전송을 막아버리는 사고를 방지하기 위한 것입니다.

### 의존성 보안

- **Node 24 (LTS "Krypton")** — 버전은 `.nvmrc` 한 곳. 로컬(`nvm use`)과
  Cloudflare 빌드 환경이 같은 파일을 읽으므로 어긋날 여지가 없습니다.
- **Dependabot** (`.github/dependabot.yml`) — npm 의존성의 새 버전이 나오면
  매월 PR 을 엽니다. 이 설정이 없어서 예전 GitHub Actions 들이 2~3 메이저
  뒤처져 있었습니다. PR 은 자동 병합되지 않으니 확인 후 병합하세요.
  (`github-actions` 항목은 워크플로를 없앤 뒤에도 남겨 뒀습니다. 나중에 액션을
  다시 쓰게 되면 그때부터 자동으로 따라갑니다.)
- **`npm audit --audit-level=high`** — `npm run build` 의 첫 단계입니다.
  고위험 취약점이 있으면 빌드가 실패해 배포가 멈춥니다.
- **`/.well-known/security.txt`** (RFC 9116) — 취약점 발견자가 연락할 곳.
  `src/security-txt.11ty.js` 가 생성하며, 필수 필드인 `Expires` 는 빌드할 때마다
  1년 뒤로 다시 계산됩니다(만료된 채 방치되지 않도록).

## 기술 블로그

`/blog/` — 기존 사이트에 없던 기능입니다.

```
src/blog/index.njk              글 목록
src/blog/posts/*.md             글 (파일 하나 = 글 하나)
src/blog/posts/posts.11tydata.js  글 공통 설정
src/_includes/layouts/post.njk  글 본문 골격
```

### 글 쓰기

`src/blog/posts/` 에 `YYYY-MM-DD-슬러그.md` 로 만들면 됩니다.
주소는 날짜를 뗀 `/blog/슬러그/` 가 됩니다.

```markdown
---
title: 글 제목
date: 2026-08-01
summary: 목록에 보이는 한 줄 요약
topics: [스토리지, IBM]      # 선택
draft: true                   # 있으면 발행되지 않음
---
본문 (Markdown)
```

> ⚠️ 분류는 `tags` 가 아니라 **`topics`** 입니다. `tags` 는 Eleventy 가 컬렉션을
> 만드는 데 쓰는 이름이라, 글에서 덮어쓰면 그 글이 목록에서 사라집니다.

**`draft: true` 인 글은 페이지 자체가 만들어지지 않습니다.** 목록에서만 빼면
주소를 아는 사람에게는 열리므로, 검토 전 글이 공개된 것과 같기 때문입니다.

### AI 초안 (IBM Bob)

`.github/workflows/draft-post.yml` 이 매주 월요일에 돌면서, 업계 기사를 모아
IBM Bob 으로 초안을 만들고 **PR 을 엽니다.** 자동 발행이 아닙니다 —
사람이 읽고 `draft: true` 를 지워야 사이트에 나옵니다.

```
RSS 수집 → 키워드로 선별 → Bob Shell 로 초안 → draft PR → (사람 검토) → 발행
```

수동 실행: `npm run draft:post` (Bob Shell 설치 + `BOBSHELL_API_KEY` 필요)

**설계상 정한 것**

- **Bob 은 저장소 밖 빈 임시 디렉터리에서 실행합니다.** Bob 은 텍스트 생성
  API 가 아니라 **에이전트**라 파일을 읽고 쓰고 명령을 실행할 수 있습니다.
  우리에게 필요한 건 글 한 편이므로, 애초에 건드릴 것이 없는 곳에서 돌리고
  글 파일은 Bob 이 아니라 스크립트가 직접 씁니다. 프롬프트에도 "글쓰기 작업이며
  파일·명령을 건드리지 말라"고 명시했습니다.
- **기사 본문을 모델에 넣지 않습니다.** 제목과 링크만 넘기고, 회사 관점의 글을
  새로 쓰게 합니다. 기사를 요약해 옮기면 저작권 문제가 될 수 있습니다.
  참고한 기사는 본문에 옮기지 않고 **원문 링크로만** 남깁니다.
- AI 가 초안을 쓴 글에는 `aiDraft: true` 가 붙어 **목록과 본문에 그 사실이
  표시됩니다.** 회사가 사실관계를 보증하는 글과 구분하기 위한 것입니다.
- 전자신문은 IT 전용 RSS 가 없어 종합 피드를 받아 **키워드로 걸러냅니다**
  (`tools/draft-post.mjs` 의 `KEYWORDS`). 실행 로그에 매체별 수집·선별 건수가
  찍히므로, 피드 주소가 바뀌어 0건이 되는 상황을 알아챌 수 있습니다.

**필요한 Secret** (저장소 Settings → Secrets and variables → Actions)

| 이름 | 내용 |
| --- | --- |
| `BOBSHELL_API_KEY` | IBM Bob API 키 |

> **진짜 비밀입니다.** 사이트 빌드와 무관하므로 Cloudflare 가 아니라
> GitHub Secrets 에 넣으세요. 초안 생성은 GitHub Actions 에서만 돕니다.

**다른 LLM 으로 바꾸려면** `tools/draft-post.mjs` 의 `generate()` 함수 하나만
고치면 됩니다. 수집·선별·저장은 그 함수와 분리되어 있습니다.

### 문의 폼 수신 (Web3Forms)

원본 사이트는 `<form action="./inquiry_post.php">` 로 **서버가 문의를 받았습니다.**
정적 호스팅에는 서버가 없으므로, 그 자리를 Web3Forms 가 대신합니다.
무료 250건/월이고 문의는 `master@trialinfo.com` 으로 도착합니다.

**설정 (1회)**

1. <https://web3forms.com> 에서 `master@trialinfo.com` 을 입력해 **Access Key** 발급
   (메일로 옵니다. 가입 절차 없음)
2. Cloudflare Pages → Settings → Environment variables 에 **두 개** 추가

   | 이름 | 값 |
   | --- | --- |
   | `FORM_ENDPOINT` | `https://api.web3forms.com/submit` |
   | `FORM_ACCESS_KEY` | 발급받은 키 |

3. 재배포

**동작**

- 설정하면 `fetch` 로 전송 → 누르면 바로 접수 (원본과 같은 사용감)
- **전송에 실패하면 자동으로 mailto 로 넘어갑니다.** 서비스 장애나 월 한도
  초과로 문의가 통째로 사라지는 일이 없습니다
- `FORM_ENDPOINT` 를 비우면 mailto 로만 동작합니다 (되돌리기가 변수 하나)

**설계 메모**

- `access_key` 는 **비밀이 아닙니다.** 이 키로 할 수 있는 일은 등록된 주소로
  폼을 보내는 것뿐이라 클라이언트에 노출되는 것이 정상 설계입니다. Secret 이
  아니라 일반 환경 변수로 두세요.
- **답장 주소는 자동입니다.** Web3Forms 가 폼의 `email` 필드를 reply-to 로
  잡으므로, 받은 메일에서 그냥 답장하면 문의자에게 갑니다.
- 엔드포인트 출처(`https://api.web3forms.com`)는 CSP 의 `connect-src`·`form-action`
  에 **자동으로 추가**됩니다. CSP 가 전송을 막는 사고를 방지합니다.
- `FORM_ENDPOINT` 가 Web3Forms 인데 `FORM_ACCESS_KEY` 가 없으면 **빌드가
  실패합니다.** 그 조합은 전송이 전부 거부되는데, 화면상으로는 멀쩡해 보여서
  문의가 조용히 사라지기 때문입니다.

### 문의 폼 검증

`src/contact/inquiry.njk` 와 `src/assets/js/main.js` 의 `initForm()` 입니다.
입력 길이 제한은 `src/_data/site.js` 의 `formLimits` 한 곳에서 관리하고
템플릿의 `maxlength` 와 JS 검증이 같은 값을 씁니다.

- **개인정보 수집·이용 동의 체크박스** — 개인정보 보호법 제15조. 고지해야 하는
  4항목(수집 항목·이용 목적·보유 기간·거부 권리와 불이익)을 폼에 직접 적고
  개인정보취급방침으로 링크합니다. 체크하지 않으면 전송되지 않습니다.
  별도 저장소가 없으므로 동의 시각은 문의 메일 본문에 함께 기록됩니다.
- **길이·형식 검증** — 브라우저 기본 검사(`required`/`type`/`pattern`/`maxlength`)
  위에, 공백만 입력·길이 초과·제어문자를 JS 에서 한 번 더 걸러냅니다.
  (`required` 는 `"   "` 를 통과시키고, `maxlength` 는 자동완성으로 들어온
  값이나 개발자 도구로 속성을 지운 폼은 막지 못합니다.)
- **봇·중복 전송** — 함정 필드 2종(`_gotcha` 는 우리 JS 가, `botcheck` 는
  Web3Forms 서버가 확인), 페이지를 연 지 3초 안의 제출 차단, 전송 중 재클릭 차단.

### 환경 변수

Cloudflare Pages 대시보드의 **Settings → Environment variables** 에서 설정합니다.
`.env` 파일은 쓰지 않습니다 — 이 프로젝트에는 `.env` 를 읽는 코드가 없고
(`dotenv` 의존성 없음), 빌드를 실행하는 환경이 `process.env` 로 직접 주입합니다.

| 이름 | 용도 | 기본값 |
| --- | --- | --- |
| `SITE_URL` | canonical·OG·sitemap 에 쓰는 사이트 주소 (항상 https 로 정규화됨) | `https://www.trialinfo.com` |
| `FORM_ENDPOINT` | 문의 폼을 받을 주소. 비우면 mailto 로 대체. 설정하면 그 출처가 CSP 에 자동 추가됨 | (없음) |
| `FORM_ACCESS_KEY` | Web3Forms access key. 공개 키라 Secret 이 아닙니다 | (없음) |
| `CONTACT_EMAIL` | 사이트에 표시되는 대표 이메일 전체를 덮어씁니다 (테스트용) | `master@trialinfo.com` |
| `PATH_PREFIX` | 하위 경로 배포용 접두사. Cloudflare 는 루트 배포라 쓸 일이 없습니다 | `/` |

실제로 손댈 것은 `SITE_URL` 과 폼 관련 2개입니다. Node 버전은 `.nvmrc` 가 담당합니다.

여기 값들은 **비밀이 아닙니다.** `SITE_URL` 과 `FORM_ENDPOINT` 는 빌드 결과 HTML 에
그대로 들어가 공개되므로, Secret 저장소에 넣을 성격이 아닙니다.

로컬에서 값을 바꿔 확인하려면 명령 앞에 붙이면 됩니다.

```bash
SITE_URL=https://example.pages.dev npm run build          # Git Bash
$env:SITE_URL="https://example.pages.dev"; npm run build  # PowerShell
```

## 남은 작업

기존 사이트를 통째로 크롤(`npm run crawl:old-site`)해 콘텐츠와 이미지를 모두
옮겨 왔습니다. 개인정보취급방침·윤리강령·채용정보는 원본 전문 그대로이고,
제품 카탈로그는 16개 카테고리 45개 제품이 원본 사진과 함께 들어 있습니다.

남은 것은 하나입니다.

- **S/W 5개 카테고리** (`src/_data/catalog.js` 의 IBM Spectrum Scale, DB2,
  WebSphere, Instana, Cider) — 원본이 제품 카드가 아니라 설명형 레이아웃
  (`.product_sw_wrapper`: headline / body / additional 구조)이라 카드로 옮기지
  않고 비워 두었습니다. 탭과 URL 은 생성되며 "콘텐츠 준비중"으로 표시됩니다.
  원본대로 살리려면 설명형 전용 템플릿이 필요합니다.
