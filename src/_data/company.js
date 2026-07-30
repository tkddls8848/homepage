/**
 * 회사 개요 / 연혁 / 조직도 데이터.
 *
 * ⚠️ 확인 필요
 * 원본 사이트(about-us_about.php, about-us_history.php, about-us_division.php)의
 * 본문을 가져올 수 없어, 아래 `overview` 중 일부와 `history`, `org` 는
 * 형식만 잡아 둔 자리(placeholder)입니다. `TODO` 표시된 값을 실제 내용으로
 * 바꿔 주세요. 표시만 바꾸면 페이지·조직도·타임라인이 자동으로 갱신됩니다.
 */
export default {
  /** 회사개요 표 — 아래 항목은 footer 등에서 확인된 실제 정보입니다. */
  overview: [
    { key: "회사명", value: "(주)트라이얼정보통신" },
    { key: "영문명", value: "Trial Info Communication Co., Ltd." },
    { key: "사업분야", value: "IT 인프라 컨설팅 · 구축 · 유지보수, 서버 · 스토리지 · 소프트웨어 공급" },
    { key: "주소", value: "(우) 07282 서울특별시 영등포구 선유로 13길 25, 1312 ~ 1314호 (문래동6가, 에이스하이테크시티2차)" },
    { key: "대표전화", value: "02-6972-1521" },
    { key: "팩스", value: "02-6972-1525" },
    { key: "이메일", value: "master@trialinfo.com" },
    // TODO: 설립일 / 대표자 / 자본금 / 사업자등록번호 등 공개 가능한 항목을 추가하세요.
    // { key: "설립일", value: "" },
    // { key: "대표자", value: "" },
  ],

  /** 회사 소개 문단 (원본 사이트의 회사소개 문구) */
  introduction: [
    "20년 이상의 전문 경력을 바탕으로 IT Service 전문대표기업으로 새롭게 태어났습니다.",
    "정보통신산업의 든든한 기둥! 정보강국의 첨병이 되어 대한민국 종합정보통신의 살아있는 역사를 바로 세워가겠습니다.",
  ],

  /** 핵심 역량 */
  strengths: [
    {
      title: "검증된 전문 인력",
      text: "20년 이상 현장에서 축적한 UNIX·x86·스토리지 운영 경험을 바탕으로 설계와 구축을 수행합니다.",
    },
    {
      title: "멀티 벤더 대응",
      text: "IBM, Lenovo, Dell 등 주요 제조사 제품을 함께 다루므로 특정 벤더에 얽매이지 않은 구성을 제안합니다.",
    },
    {
      title: "생애주기 서비스",
      text: "컨설팅과 구축에서 끝나지 않고, 운영 단계의 유지보수까지 한 창구에서 책임집니다.",
    },
  ],

  /**
   * 연혁 — 최신 연도가 위로 오도록 정렬합니다.
   * TODO: 실제 연혁으로 교체하세요. 형식: { year, items: [{ date, text }] }
   */
  history: [
    {
      year: "TODO",
      items: [{ date: "", text: "원본 사이트의 회사연혁 내용을 이 자리에 옮겨 주세요." }],
    },
  ],

  /**
   * 조직도 — root 아래 부문(row)을 배열로 둡니다.
   * TODO: 실제 조직 구성으로 교체하세요.
   */
  org: {
    root: { title: "대표이사", desc: "" },
    rows: [
      [
        { title: "경영지원", desc: "TODO: 담당 업무" },
        { title: "영업본부", desc: "TODO: 담당 업무" },
        { title: "기술본부", desc: "TODO: 담당 업무" },
      ],
    ],
  },
};
