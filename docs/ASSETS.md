# 사진 에셋 배치 위치

기존 사이트의 **사진 파일을 그대로** 이 디렉터리에 넣으면 됩니다.
템플릿이 참조하는 경로가 원본 사이트와 동일하게 맞춰져 있어, 파일명을 바꾸거나
이미지를 다시 가공할 필요가 없습니다.

## 옮겨야 하는 것

기존 사이트에는 이미지 루트가 두 군데였습니다.

| 기존 사이트 (HTML 안의 경로)                              | 실제 위치            | 새 위치 (여기)                        |
| --------------------------------------------------------- | -------------------- | ------------------------------------- |
| `../../images/logo/logo.svg`                              | 사이트 최상위 images | `src/images/logo/logo.svg`            |
| `../../images/logo/logo_wt.svg`                           | 사이트 최상위 images | `src/images/logo/logo_wt.svg`         |
| `images/photo/slide/slide_01.png`                         | 페이지 폴더 images   | `src/images/photo/slide/slide_01.png` |
| `images/photo/product/ibm/UnixServer/power11_e1180.png`    | 페이지 폴더 images   | 같은 하위 경로 그대로                 |

즉, **두 `images/` 폴더의 내용을 이 디렉터리 하나에 합치면** 끝입니다.
(`logo/`, `icon/`, `photo/` 세 폴더가 이 아래에 오게 됩니다.)

```
src/images/
├── logo/
│   ├── logo.svg
│   └── logo_wt.svg
└── photo/
    ├── slide/
    │   ├── slide_01.png
    │   └── slide_02.png
    └── product/
        └── ibm/
            └── UnixServer/
                ├── power11_e1180.png
                ├── power11_e1150.png
                ├── power11_s1124.png
                ├── power11_s1122.png
                ├── power9_e1080.png
                ├── power9_e1050.png
                ├── power10_s1024.png
                └── power9_s1022.png
```

## 옮기지 않아도 되는 것

`images/icon/nav/hamburger.png`, `close.png`, `arrow_down.png` 같은 **UI 아이콘은
더 이상 이미지 파일을 쓰지 않습니다.** 인라인 SVG / CSS 로 대체해서
화면 배율에 관계없이 선명하고, 요청 수도 줄었습니다. 그대로 두거나 삭제하셔도
동작에 영향이 없습니다.

## 파일이 아직 없을 때

이미지가 없어도 레이아웃은 깨지지 않습니다.

- 메인 슬라이드: 사진 없이 브랜드 그라디언트 배경으로 표시됩니다.
- 제품 카드: "이미지 준비중" 자리로 표시되고, 어떤 경로를 찾지 못했는지
  브라우저 콘솔에 경고로 남습니다.
- 로고: 회사명 텍스트로 대체 표시됩니다.

## 경로를 바꾸고 싶다면

파일 경로는 데이터 파일 한 곳에만 적혀 있습니다.

- 제품 사진: `src/_data/catalog.js` 의 각 항목 `image`
- 슬라이드 사진: `src/_data/hero.js` 의 `image`
- 로고: `src/_includes/partials/site-header.njk`, `site-footer.njk`
