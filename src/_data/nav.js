/**
 * 사이트 내비게이션 구조 (단일 원본)
 * ---------------------------------------------------------------------------
 * 기존 사이트는 상단 nav, 3분할 탭, 1·2차 탭, footer 링크를 모든 .php 파일에
 * 중복해서 갖고 있었고 그래서 메뉴 하나 추가하면 20개 파일을 고쳐야 했습니다.
 * 이제 이 파일만 고치면 헤더·탭·푸터·sitemap 이 함께 갱신됩니다.
 *
 * Product 하위 메뉴는 catalog.js 에서 자동으로 만들어집니다.
 */
import catalog from "./catalog.js";

/** 벤더 → URL (해당 벤더의 첫 카테고리 페이지로 이동) */
const vendors = [];
for (const page of catalog) {
  let vendor = vendors.find((v) => v.slug === page.vendorSlug);
  if (!vendor) {
    vendor = { label: page.vendor, slug: page.vendorSlug, categories: [] };
    vendors.push(vendor);
  }
  vendor.categories.push({
    label: page.category,
    slug: page.categorySlug,
    url: `/products/${page.vendorSlug}/${page.categorySlug}/`,
  });
}
for (const vendor of vendors) {
  vendor.url = vendor.categories[0].url;
}

/** 상단 주 메뉴 */
const primary = [
  { label: "About Us", url: "/about/", key: "about" },
  { label: "Product", url: "/products/", key: "product" },
  { label: "IT Infra", url: "/it-infra/", key: "it-infra" },
  { label: "Career", url: "/career/", key: "career" },
  { label: "Contact Us", url: "/contact/", key: "contact" },
];

/** 기존 사이트의 3분할 탭(회사소개 / IT Infra Service / Product) */
const sections = [
  {
    key: "about",
    label: "회사소개",
    url: "/about/",
    description:
      "20년 이상의 전문 경력을 바탕으로 IT Service 전문대표기업으로 새롭게 태어났습니다.",
  },
  {
    key: "it-infra",
    label: "IT Infra Service",
    url: "/it-infra/",
    description: "컨설팅부터 구축과 유지보수까지, IT 인프라 전 주기를 지원합니다.",
  },
  {
    key: "product",
    label: "Product",
    url: "/products/",
    description: "IBM·Lenovo·Dell 서버와 스토리지, 소프트웨어를 공급합니다.",
  },
];

/** 섹션별 하위 메뉴 (2차 탭 / 푸터 공용) */
const children = {
  about: [
    { label: "회사개요", url: "/about/" },
    { label: "회사연혁", url: "/about/history/" },
    { label: "조직도", url: "/about/division/" },
  ],
  "it-infra": [
    { label: "Consulting", url: "/it-infra/" },
    { label: "IT Infra 구축", url: "/it-infra/build/" },
    { label: "Maintenance", url: "/it-infra/maintenance/" },
  ],
  product: vendors.map((v) => ({ label: v.label, url: v.url })),
  career: [{ label: "Career", url: "/career/" }],
  contact: [
    { label: "오시는 길", url: "/contact/" },
    { label: "문의하기", url: "/contact/inquiry/" },
  ],
};

/** 푸터 하단 부가 메뉴 */
const utility = [
  { label: "채용정보", url: "/etc/recruit/" },
  { label: "윤리강령", url: "/etc/ethics/" },
  { label: "개인정보취급방침", url: "/etc/privacy-policy/" },
];

/** key → 주 메뉴 항목 조회용 (템플릿에서 nav.byKey[section] 으로 사용) */
const byKey = Object.fromEntries(primary.map((item) => [item.key, item]));

/** slug → 벤더 조회용 (2차 탭 생성에 사용) */
const vendorsBySlug = Object.fromEntries(vendors.map((vendor) => [vendor.slug, vendor]));

export default { primary, sections, children, vendors, utility, byKey, vendorsBySlug };
