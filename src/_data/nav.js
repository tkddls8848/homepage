import catalog from "./catalog.js";

const vendors = [];
for (const page of catalog) {
  let vendor = vendors.find((v) => v.slug === page.vendorSlug);
  if (!vendor) {
    vendor = { label: page.vendor, slug: page.vendorSlug, categories: [] };
    vendors.push(vendor);
  }
  const items = (page.groups || []).flatMap((group) => group.items || []);
  vendor.categories.push({
    label: page.category,
    slug: page.categorySlug,
    url: `/products/${page.vendorSlug}/${page.categorySlug}/`,
    lead: page.lead,
    itemCount: items.length,
    image: page.cardImage || items.find((item) => item.image)?.image || null,
  });
}
for (const vendor of vendors) {
  vendor.url = vendor.categories[0].url;
}

const primary = [
  { label: "About Us", url: "/about/", key: "about" },
  { label: "Product", url: "/products/", key: "product" },
  { label: "IT Infra", url: "/it-infra/", key: "it-infra" },
  { label: "Tech Blog", url: "/blog/", key: "blog" },
  { label: "Career", url: "/career/", key: "career" },
  { label: "Contact Us", url: "/contact/", key: "contact" },
];

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
  blog: [{ label: "전체 글", url: "/blog/" }],
  career: [{ label: "Career", url: "/career/" }],
  contact: [
    { label: "오시는 길", url: "/contact/" },
    { label: "문의하기", url: "/contact/inquiry/" },
  ],
};

const utility = [
  { label: "채용정보", url: "/etc/recruit/" },
  { label: "윤리강령", url: "/etc/ethics/" },
  { label: "개인정보취급방침", url: "/etc/privacy-policy/" },
];

const byKey = Object.fromEntries(primary.map((item) => [item.key, item]));
const vendorsBySlug = Object.fromEntries(vendors.map((vendor) => [vendor.slug, vendor]));

export default { primary, children, vendors, utility, byKey, vendorsBySlug };
