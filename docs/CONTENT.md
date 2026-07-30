# 콘텐츠 수정 가이드

HTML 을 몰라도 대부분의 내용은 `src/_data/` 안의 파일만 고쳐서 바꿀 수 있습니다.
파일을 저장하고 `npm run dev` 로 확인하세요.

---

## 채워야 하는 내용 (중요)

원본 사이트에서 아래 페이지의 본문을 가져올 수 없어, **형식만 잡아 둔 상태**입니다.
표시된 파일을 열어 실제 내용으로 바꿔 주세요.

| 우선순위 | 내용 | 수정할 곳 | 지금 상태 |
| --- | --- | --- | --- |
| 🔴 필수 | 개인정보취급방침 | `src/etc/privacy-policy.njk` | `[ ]` 로 표시된 빈칸이 있는 초안. **법적 문서이므로 공개 전 반드시 교체** |
| 🟠 높음 | 회사연혁 | `src/_data/company.js` → `history` | `TODO` 한 줄. 등록 전까지 페이지에 안내문이 표시됩니다 |
| 🟠 높음 | 조직도 | `src/_data/company.js` → `org` | 부문 이름이 `TODO` |
| 🟠 높음 | 제품 5종 상세 | `src/_data/catalog.js` | Linux on Power / IBM Storage / Lenovo x86 / Dell x86 / Spectrum Scale 이 빈 상태 → "콘텐츠 준비중" 표시 |
| 🟡 보통 | 윤리강령 | `src/etc/ethics.njk` | 일반적인 문안의 초안. 사내 확정본으로 교체 |
| 🟡 보통 | IT Infra 서비스 설명 | `src/_data/services.js` | 업무 범위를 일반적 표현으로 정리한 초안. 실제 서비스와 대조 필요 |
| 🟡 보통 | 채용 정보 | `src/_data/career.js` | 인재상·복리후생·전형절차 초안 |
| 🟢 낮음 | 회사개요 항목 | `src/_data/company.js` → `overview` | 설립일·대표자 등 항목이 비어 있음 (주석 참고) |
| 🟢 낮음 | 오시는 길 교통편 | `src/contact/index.njk` | 지하철·주차 안내가 대략적인 초안 |

> ✅ **확인된 실제 정보** (원본 사이트 그대로 유지): 회사명, 주소, 전화, 팩스, 이메일,
> 회사소개 문구, 메인 슬라이드 문구, IBM Power UNIX Server 제품 8종의 설명·특징·링크·사진 경로.

---

## 자주 하는 작업

### 연락처·주소 바꾸기

`src/_data/site.js`

```js
contact: {
  tel: "02-6972-1521",
  fax: "02-6972-1525",
  email: "master@trialinfo.com",
  ...
}
```

헤더·푸터·문의 페이지·오시는 길·구조화 데이터에 한 번에 반영됩니다.

### 제품 추가하기

`src/_data/catalog.js` 의 해당 제품 페이지에서 `groups[].items` 에 항목을 추가합니다.

```js
{
  line: "Power",                    // 카드 제목 첫 줄
  model: "S1024",                   // 카드 제목 둘째 줄 (크게 표시)
  label: "IBM Power UNIX Server",   // 위쪽 작은 분류 라벨
  summary: "한 줄 소개",
  features: [
    "성능 향상: 설명을 이렇게 쓰면 콜론 앞이 굵게 표시됩니다.",
    "짧은 특징은 그냥 한 줄로 써도 됩니다.",
  ],
  link: "https://www.ibm.com/kr-ko/products/power-s1024",  // 없으면 버튼 숨김
  image: "/images/photo/product/ibm/UnixServer/power10_s1024.png",
}
```

### 제품 페이지(카테고리) 추가하기

같은 파일의 배열에 객체를 하나 더 넣으면 **URL·1차 탭·2차 탭·sitemap 이 자동 생성**됩니다.

```js
{
  vendor: "Lenovo",
  vendorSlug: "lenovo",
  category: "Storage",
  categorySlug: "storage",
  lead: "페이지 상단 한 줄 설명",
  groups: [{ title: "그룹 이름", items: [ /* 위 형식 */ ] }],
}
```

→ `/products/lenovo/storage/` 가 만들어지고 Lenovo 의 2차 탭에 자동으로 들어갑니다.

### 메인 슬라이드 바꾸기

`src/_data/hero.js`. 항목을 늘리면 슬라이드와 인디케이터가 함께 늘어납니다.
사진이 없으면 브랜드 그라디언트만 표시되고 레이아웃은 그대로입니다.

### 메뉴 바꾸기

`src/_data/nav.js`

- `primary` : 상단 주 메뉴
- `children` : 각 섹션의 하위 메뉴 (푸터·하위 탭 공용)
- `utility` : 푸터 맨 아래 부가 링크
- Product 하위 메뉴는 `catalog.js` 에서 자동 생성되므로 손대지 않아도 됩니다

### 채용 공고 올리기

`src/_data/career.js` 의 `openings` 배열에 추가합니다. 비워 두면
"상시 지원 안내"가 대신 표시됩니다.

```js
openings: [
  {
    title: "IT 인프라 기술지원 (경력)",
    type: "정규직",
    place: "서울 영등포구",
    period: "채용 시 마감",
    tasks: ["UNIX/x86 서버 설치 및 유지보수", "장애 대응"],
    requires: ["관련 경력 3년 이상"],
  },
],
```

### 문의 폼을 실제로 받기

정적 사이트라서 폼을 처리할 곳이 필요합니다. 세 가지 방법이 있습니다.

1. **아무 설정도 안 함 (기본)** — 방문자의 메일 프로그램이 열리고 내용이 채워집니다.
2. **Netlify Forms** — `src/contact/inquiry.njk` 의 `<form>` 에 `netlify` 속성을 추가.
3. **외부 서비스(Formspree 등) 또는 자체 API** — 환경 변수 `FORM_ENDPOINT` 에 주소를 지정.
   폼은 `fetch` 로 전송하고, 실패하면 메일 주소를 안내합니다.

### 새 페이지 추가하기

`src/` 아래에 `.njk` 파일을 만들고 앞부분에 다음을 씁니다.

```
---
layout: layouts/page.njk
title: 페이지 제목          # h1 과 <title> 에 사용
lead: 제목 아래 한 줄 설명    # 생략 가능
section: about              # nav.primary 의 key. 브레드크럼·하위탭 생성용
description: 검색 결과에 나오는 설명
cta: false                  # 하단 문의 유도 영역을 숨기려면
---
```

본문에서 바로 쓸 수 있는 조각들:

| 클래스 | 용도 |
| --- | --- |
| `section`, `section--tint`, `section--dark` | 섹션 배경 |
| `section__eyebrow` / `section__title` / `section__lead` | 섹션 제목 묶음 |
| `grid grid--2` / `grid--3` / `grid--4` | 반응형 그리드 |
| `feature` | 아이콘·제목·설명 카드 |
| `steps` + `step` | 번호가 자동으로 붙는 절차 카드 |
| `datalist` + `datalist__row` | 항목/값 표 (`<dl>` 로 감싸세요) |
| `notice` | 안내 박스 |
| `prose` | 약관·정책처럼 글이 긴 본문 |
| `reveal` | 스크롤로 들어올 때 살짝 나타남 |

---

## 주의할 점

- `src/_data/*.js` 는 자바스크립트 파일입니다. 쉼표와 따옴표를 빠뜨리면
  빌드가 실패하고 터미널에 줄 번호가 표시됩니다.
- 문자열 안에 따옴표를 쓰려면 `"큰 \"따옴표\" 안"` 처럼 앞에 `\` 를 붙이세요.
- 이미지 경로는 항상 `/images/` 로 시작합니다 (앞의 슬래시 필수).
- 커밋 전에 `npm run build && npm run check:links` 로 링크가 깨지지 않았는지 확인하세요.
