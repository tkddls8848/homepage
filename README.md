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
  assets/      CSS, 브라우저 JavaScript, 아이콘
  images/      사이트가 사용하는 이미지
  blog/posts/  기술 블로그 Markdown
tools/
  check-links.mjs  빌드 결과 경로 검사
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

HTTP 보안 헤더는 `src/headers.11ty.js`가 `_site/_headers`로 생성합니다.
