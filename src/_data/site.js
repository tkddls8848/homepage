/**
 * 사이트 전역 정보.
 * 기존 사이트는 회사 주소·전화번호가 모든 페이지의 footer 마크업에
 * 하드코딩되어 있었습니다. 여기 한 곳만 고치면 전체에 반영됩니다.
 */

// 배포 환경에서 SITE_URL 을 주면 canonical / OG / sitemap 에 반영됩니다.
const url = process.env.SITE_URL || "https://www.trialinfo.com";

export default {
  url,
  lang: "ko",
  locale: "ko_KR",

  name: "(주)트라이얼정보통신",
  nameShort: "트라이얼정보통신",
  nameEn: "Trial Info Communication",
  tagline: "IT Service 전문기업",
  description:
    "(주)트라이얼정보통신은 20년 이상의 전문 경력을 바탕으로 IBM·Lenovo·Dell 서버와 스토리지 공급부터 IT 인프라 컨설팅·구축·유지보수까지 제공하는 IT Service 전문기업입니다.",

  copyrightFrom: 2020,

  contact: {
    tel: "02-6972-1521",
    fax: "02-6972-1525",
    email: "master@trialinfo.com",
    zip: "07282",
    address1: "서울특별시 영등포구 선유로 13길 25, 1312 ~ 1314호",
    address2: "(문래동6가, 에이스하이테크시티2차)",
    get addressFull() {
      return `(우) ${this.zip} ${this.address1} ${this.address2}`;
    },
    // 지도 검색용 질의어 (지도 API 키가 필요 없는 링크 방식)
    mapQuery: "서울특별시 영등포구 선유로13길 25 에이스하이테크시티2차",
  },

  // 문의하기 폼을 처리할 엔드포인트.
  // GitHub Pages 는 서버가 없으므로 Formspree 같은 외부 폼 서비스를 연결하세요.
  // 비워 두면 폼은 메일 클라이언트(mailto) 로 대체 동작합니다.
  formEndpoint: process.env.FORM_ENDPOINT || "",
};
