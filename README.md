# 트라이얼정보통신 홈페이지

Eleventy 3 기반 정적 사이트입니다. Cloudflare Pages가 `main` 브랜치를 빌드해 배포합니다.

## 실행

Node.js 24가 필요합니다.

```bash
npm ci
npm run dev
```

배포와 같은 검증은 다음 명령으로 실행합니다.

```bash
npm run build
```

`build`는 사이트를 `_site/`에 생성한 뒤 내부 링크와 이미지 경로를 검사합니다. 의존성 보안 감사는 배포와 분리해 필요할 때 `npm audit`으로 실행합니다.

## 구조

```text
src/
  _data/       회사·메뉴·제품·서비스 데이터
  _includes/   레이아웃과 공용 컴포넌트
  assets/      CSS, 브라우저 JavaScript, 아이콘, 본문 폰트
  images/      사이트가 사용하는 이미지
  blog/posts/  기술 블로그 Markdown
lib/
  images.js    이미지 WebP 변환·반응형 srcset 생성
  assets.js    CSS/JS 캐시 무효화용 내용 해시
  svg.js       빌드 산출물 SVG 정리
  fonts.js     폰트 서브셋에 없는 글자 감지
tools/
  check-links.mjs  빌드 결과 경로 검사
  build-fonts.mjs  본문 폰트 서브셋 생성
  draft-post.mjs   블로그 초안 생성
```

주요 수정 위치:

- 회사 및 연락처: `src/_data/site.js`
- 메뉴: `src/_data/nav.js`
- 제품: `src/_data/catalog.js`
- 서비스: `src/_data/services.js`
- 채용: `src/_data/career.js`
- 전역 스타일: `src/assets/css/main.css`
- 브라우저 동작: `src/assets/js/main.js`
- 공유 미리보기 이미지: `src/images/og/og-brand-v2.jpg`

## 환경 변수

Cloudflare Pages의 빌드 환경 변수로 설정합니다.

| 이름 | 용도 | 기본값 |
| --- | --- | --- |
| `SITE_URL` | canonical, Open Graph, sitemap 기준 URL | `https://www.trialinfo.com` |
| `CONTACT_EMAIL` | 화면에 표시할 대표 이메일 | `master@trialinfo.com` |
| `FORM_ENDPOINT` | 문의 폼 POST URL. 없으면 mailto 사용 | 없음 |
| `FORM_ACCESS_KEY` | Web3Forms access key | 없음 |

Web3Forms를 쓸 때 `FORM_ENDPOINT=https://api.web3forms.com/submit`과 발급받은 `FORM_ACCESS_KEY`를 함께 설정합니다.

## 블로그

글은 `src/blog/posts/`에 Markdown으로 둡니다. 공개 전 초안에는 다음 front matter를 사용합니다.

```yaml
draft: true
```

`npm run draft:post`와 `.github/workflows/draft-post.yml`은 Cloudflare Workers AI로 초안을 만들며 아래 GitHub Actions secrets를 사용합니다.

- `CF_ACCOUNT_ID`
- `CF_API_TOKEN`

생성된 글은 사실관계와 출처를 확인한 뒤 `draft` 항목을 제거해 발행합니다.

## 배포 설정

- Build command: `npm run build`
- Build output directory: `_site`
- Node version: `.nvmrc`의 `24`

HTTP 보안 헤더와 캐시 정책은 `src/headers.11ty.js`가 `_site/_headers`로 생성합니다.

## 성능

첫 방문 전송량을 줄이기 위해 빌드가 다음을 자동으로 처리합니다.

- `src/images/photo/`의 PNG는 `_site/img/`에 WebP로 변환되어 나갑니다. 원본 PNG는 배포에
  포함되지 않습니다.
- 템플릿의 `<img>`는 `eleventy:widths` 속성에 적은 폭으로 `srcset`이 생성됩니다.
  화면에서 차지하는 크기가 바뀌면 이 값과 `sizes`를 함께 조정합니다.
- 파일명에 내용 해시가 들어가는 `/img/*`, `/assets/fonts/*`와 `?v=`가 붙는
  `/assets/css`, `/assets/js`는 1년 immutable로 캐시됩니다. 배포하면 URL이 바뀌므로
  갱신이 바로 반영됩니다.
- 로고 SVG는 빌드 시 SVGO로 정리됩니다.

새 사진을 추가할 때는 `src/images/photo/` 아래에 원본을 두고 템플릿에서 평소처럼
`<img src="/images/photo/...">`로 참조하면 됩니다. 변환은 빌드가 맡습니다.
`<picture>`로 모바일 전용 이미지를 따로 쓰는 자리(`about/division`, `etc/recruit`)만
`imageSrcset` 필터로 직접 처리합니다.

## 본문 폰트

본문 폰트(Noto Sans KR)는 자체 호스팅합니다. Google Fonts에서 받으면 한글 페이지 하나가
서브셋 수십 개를 제3자 도메인에서 내려받습니다(홈 기준 요청 33개, 184~552KB). 사이트가
실제로 쓰는 글자만 담은 가변 폰트 한 벌이면 같은 화면을 73KB로 그립니다.

`src/assets/fonts/`의 woff2 두 개는 `tools/build-fonts.mjs`가 만들어 저장소에 커밋합니다.

| 파일 | 담는 글자 | 언제 받아 가나 |
| --- | --- | --- |
| `noto-sans-kr.*.woff2` | 빌드 결과에 실제로 나온 글자 | 거의 모든 방문 |
| `noto-sans-kr-ext.*.woff2` | KS X 1001 완성형 중 나머지 | 앞엣것에 없는 글자가 화면에 나올 때만 |

본문에 새 글자가 생기면 서브셋을 다시 만듭니다. 빌드가 누락된 글자를 찾아 알려 주므로
경고가 보일 때만 실행하면 됩니다.

```bash
npm run build:only
npm run build:fonts
```

원본 폰트는 실행할 때 Google Fonts 저장소에서 받아 `.cache/fonts/`에 둡니다. 폰트는
SIL Open Font License를 따르며 `src/assets/fonts/OFL.txt`로 함께 배포됩니다.
