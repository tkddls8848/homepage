# 이미지 에셋

`src/images/` 는 그대로 사이트의 `/images/` 로 복사됩니다.
**지금은 필요한 이미지가 모두 들어 있어서, 아무것도 넣지 않아도 화면에
빈 자리가 생기지 않습니다.** 아래 목록이 현재 들어 있는 파일입니다.

```
src/images/
├── logo/
│   ├── logo.svg                        헤더(밝은 배경) · 로고
│   └── logo_wt.svg                     헤더(히어로 위) · 푸터 로고
├── og/
│   └── og-default.png                  SNS 미리보기 1200×630
└── photo/
    ├── slide/
    │   ├── slide_01.svg                메인 슬라이드 1 (데이터센터)
    │   └── slide_02.svg                메인 슬라이드 2 (네트워크)
    └── product/
        ├── server-2u.svg               2U 랙마운트 서버
        ├── server-4u.svg               4U 랙마운트 서버
        └── server-enterprise-rack.svg  엔터프라이즈 랙 서버
```

로고·슬라이드·제품 이미지는 **벡터(SVG)로 직접 그린 이미지**입니다.
브랜드 조형(둥근 사각형 + T + 액센트 점)은 `src/assets/img/favicon.svg` 와
같습니다. 제품 이미지는 특정 모델의 사진이 아니라 **폼팩터(2U / 4U / 랙)를
보여 주는 그림**이고, 카드에는 제품명·모델명이 함께 표시됩니다.
제조사 제공 사진이 준비되면 아래 방법으로 교체하세요.

`og-default.png` 만 PNG 입니다. 카카오톡·슬랙·페이스북 등 대부분의 미리보기가
SVG 를 지원하지 않기 때문입니다. 생성 스크립트는 `tools/make-og-image.mjs` 이고,
브랜드 색이나 구성을 바꿀 때만 다시 실행하면 됩니다.

```bash
npm run make:og
```

## 실제 사진으로 교체하기

경로는 데이터 파일 한 곳에만 적혀 있습니다. 파일을 넣고 그 값만 바꾸면 됩니다.

| 무엇          | 어디를 고치나                                                 |
| ------------- | ------------------------------------------------------------- |
| 제품 사진     | `src/_data/catalog.js` 의 각 항목 `image` (와 `imageAlt`)      |
| 슬라이드 사진 | `src/_data/hero.js` 의 `image`                                |
| 로고          | `src/images/logo/logo.svg`, `logo_wt.svg` 를 덮어쓰기          |
| SNS 미리보기  | `tools/make-og-image.mjs` 로 다시 생성하거나 PNG 로 덮어쓰기   |

예를 들어 Power E1180 의 실제 사진을 쓰려면

```bash
cp ~/받은사진/power11_e1180.jpg src/images/photo/product/ibm/UnixServer/
```

```js
// src/_data/catalog.js
image: "/images/photo/product/ibm/UnixServer/power11_e1180.jpg",
imageAlt: "IBM Power E1180 제품 사진",
```

로고는 파일명을 유지한 채 덮어쓰면 템플릿을 고칠 필요가 없습니다.
(권장 비율 180 × 34, SVG. 비율이 달라도 헤더 높이에 맞춰 축소됩니다.)

## 기존 사이트의 images 폴더를 가져오려면

기존 사이트는 이미지 루트가 두 군데였습니다.

| 기존 사이트 (HTML 안의 경로)             | 실제 위치            | 새 위치                               |
| ---------------------------------------- | -------------------- | ------------------------------------- |
| `../../images/logo/logo.svg`             | 사이트 최상위 images | `src/images/logo/logo.svg`            |
| `images/photo/slide/slide_01.png`        | 페이지 폴더 images   | `src/images/photo/slide/slide_01.png` |
| `images/photo/product/ibm/...png`        | 페이지 폴더 images   | 같은 하위 경로 그대로                 |

두 폴더를 `src/images/` 하나로 합치면 되고, 스크립트를 쓰면 합친 뒤에
데이터 파일이 참조하는 경로가 실제로 있는지까지 검사해 줍니다.

```bash
npm run import:images -- ./old-site/images ./old-site/product/images

# 인수 없이 실행하면 지금 무엇이 있고 없는지만 검사합니다
npm run import:images
```

같은 이름의 파일은 덮어써집니다(로고를 원본으로 되돌리고 싶을 때 유용).
`.png` 원본을 넣었다면 `catalog.js` / `hero.js` 의 `image` 경로도 `.png` 로
바꿔 주세요.

## 옮기지 않아도 되는 것

`images/icon/nav/hamburger.png`, `close.png`, `arrow_down.png` 같은 **UI 아이콘은
더 이상 이미지 파일을 쓰지 않습니다.** 인라인 SVG / CSS 로 대체해서 화면 배율에
관계없이 선명하고, 요청 수도 줄었습니다.

## 경로가 틀렸는지 확인하기

빌드 결과의 이미지 경로가 실제 파일과 맞는지 검사합니다.

```bash
npm run build && npm run check:links
```

없는 이미지는 경고로 표시됩니다. 이미지가 없어도 레이아웃은 깨지지 않습니다.
(제품 카드는 "이미지 준비중" 자리, 슬라이드는 그라디언트 배경, 로고는 회사명
텍스트로 대체됩니다.)
