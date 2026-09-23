const formEndpoint = process.env.FORM_ENDPOINT || "";

export default {
  url: (process.env.SITE_URL || "https://www.trialinfo.com").replace(/\/+$/, ""),
  lang: "ko",
  locale: "ko_KR",
  name: "(주)트라이얼정보통신",
  nameShort: "트라이얼정보통신",
  tagline: "IT Service 전문기업",
  description:
    "(주)트라이얼정보통신은 20년 이상의 전문 경력을 바탕으로 IBM·Lenovo·Dell 서버와 스토리지 공급부터 IT 인프라 컨설팅·구축·유지보수까지 제공하는 IT Service 전문기업입니다.",
  copyrightFrom: 2020,
  contact: {
    tel: "02-6972-1521",
    fax: "02-6972-1525",
    email: process.env.CONTACT_EMAIL || "master@trialinfo.com",
    zip: "07282",
    address1: "서울특별시 영등포구 선유로 13길 25, 1312 ~ 1314호",
    address2: "(문래동6가, 에이스하이테크시티2차)",
    mapQuery: "서울특별시 영등포구 선유로13길 25 에이스하이테크시티2차",
  },
  formEndpoint,
  formEndpointOrigin: formEndpoint ? new URL(formEndpoint).origin : "",
  formAccessKey: process.env.FORM_ACCESS_KEY || "",
  formLimits: {
    name: 40,
    position: 40,
    company: 60,
    department: 40,
    phone: 20,
    email: 100,
    message: 2000,
  },
};
