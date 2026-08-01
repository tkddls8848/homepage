/**
 * 사이트 전역 정보.
 * 기존 사이트는 회사 주소·전화번호가 모든 페이지의 footer 마크업에
 * 하드코딩되어 있었습니다. 여기 한 곳만 고치면 전체에 반영됩니다.
 */

// 배포 환경에서 SITE_URL 을 주면 canonical / OG / sitemap 에 반영됩니다.
//
// 끝의 슬래시는 제거합니다. 대시보드에 주소를 붙여넣을 때 "https://…dev/" 처럼
// 슬래시가 딸려 들어오는 일이 흔한데, 이 값에 경로를 이어붙이는 곳(security.txt)
// 에서 "…dev//.well-known/…" 같은 잘못된 주소가 만들어지기 때문입니다.
const url = (process.env.SITE_URL || "https://www.trialinfo.com").replace(/\/+$/, "");

const formEndpoint = process.env.FORM_ENDPOINT || "";

// Web3Forms 의 access key. 비밀이 아니라 공개 키입니다 — 이 키로 할 수 있는 일은
// 등록된 수신 메일 주소로 폼을 전송하는 것뿐이라, 클라이언트에 노출되는 것이
// 정상 설계입니다. (그래서 Secret 이 아니라 일반 환경 변수로 둡니다.)
const formAccessKey = process.env.FORM_ACCESS_KEY || "";

// CSP 의 connect-src / form-action 에 넣을 폼 엔드포인트의 출처(origin).
// 나중에 FORM_ENDPOINT 를 설정했을 때 CSP 가 전송을 막아버리는 사고를 방지합니다.
let formEndpointOrigin = "";
if (formEndpoint) {
  try {
    formEndpointOrigin = new URL(formEndpoint).origin;
  } catch {
    throw new Error(`FORM_ENDPOINT 가 올바른 절대 URL 이 아닙니다: ${formEndpoint}`);
  }
}

// 키 없이 Web3Forms 로 보내면 전부 거부됩니다. 그 상태로 배포되면 문의가
// 조용히 사라지므로, 빌드를 세워서 알아차리게 합니다.
if (formEndpointOrigin.includes("web3forms.com") && !formAccessKey) {
  throw new Error(
    "FORM_ENDPOINT 가 Web3Forms 를 가리키는데 FORM_ACCESS_KEY 가 없습니다.\n" +
      "Cloudflare Pages → Settings → Environment variables 에 FORM_ACCESS_KEY 를 추가하세요."
  );
}

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
    /*
     * 대표 이메일. 사이트에 표시되는 모든 이메일이 여기서 나옵니다
     * (헤더·푸터·연락처 카드 2곳·문의 폼 mailto 폴백·security.txt·JSON-LD).
     *
     * 테스트 주소로 잠시 바꿔야 할 때는 코드를 고치지 말고 환경 변수를 쓰세요.
     *   Cloudflare Pages → Settings → Environment variables
     *   CONTACT_EMAIL = psi@trialinfo.com
     * 테스트가 끝나면 그 변수만 지우면 아래 기본값으로 돌아옵니다.
     * (코드 기본값을 테스트 주소로 바꾸면 되돌리는 걸 잊은 채 배포되기 쉽습니다.)
     *
     * ⚠️ 문의 폼으로 들어온 메일이 실제로 어디로 갈지는 이 값이 정하지 않습니다.
     *    Web3Forms 의 FORM_ACCESS_KEY 를 어느 주소로 발급받았는지가 정합니다.
     */
    email: process.env.CONTACT_EMAIL || "master@trialinfo.com",
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
  // 정적 사이트라 서버가 없으므로, 받으려면 Formspree 같은 외부 폼 서비스를
  // 연결해야 합니다. 설정하면 그 출처가 CSP 에도 자동 반영됩니다(_headers).
  // 비워 두면 폼은 메일 클라이언트(mailto) 로 대체 동작합니다.
  formEndpoint,
  formEndpointOrigin,
  formAccessKey,

  // 문의 폼 입력값 제한. 템플릿의 maxlength 와 JS 검증이 같은 값을 씁니다.
  // (한쪽만 고치면 검증이 어긋나므로 여기 한 곳에서 관리합니다.)
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
