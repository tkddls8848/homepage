/**
 * 기존 .php URL → 새 URL 매핑.
 * 외부에 이미 퍼져 있는 링크와 검색엔진 색인을 잃지 않기 위한 301 목록입니다.
 *
 * 이 데이터로 두 가지가 생성됩니다.
 *   - /_redirects  : Netlify / Cloudflare Pages 형식
 *   - /.htaccess   : Apache (기존 호스팅) 형식
 *
 * GitHub Pages 는 서버 리다이렉트 설정을 지원하지 않으므로 이 목록이 적용되지
 * 않습니다. 기존 .php 주소를 살려야 하면 Netlify / Cloudflare Pages / Apache
 * 중 하나로 배포하거나, 도메인 앞단(CDN)에서 리다이렉트를 처리해 주세요.
 */
export default [
  // Product (기존에는 index.php 가 IBM Power UNIX Server 페이지였습니다)
  { from: "/index.php", to: "/products/ibm/power-unix-server/" },
  { from: "/product_ibm_linux-on-power.php", to: "/products/ibm/linux-on-power/" },
  { from: "/product_ibm_storage.php", to: "/products/ibm/storage/" },
  { from: "/product_lenovo_x86-server.php", to: "/products/lenovo/x86-server/" },
  { from: "/product_dell_x86-server.php", to: "/products/dell/x86-server/" },
  { from: "/product_sw_ibm-spectrum-scale.php", to: "/products/sw/ibm-spectrum-scale/" },

  // About Us
  { from: "/about-us_about.php", to: "/about/" },
  { from: "/about-us_history.php", to: "/about/history/" },
  { from: "/about-us_division.php", to: "/about/division/" },

  // IT Infra Service
  { from: "/it-infra-service_consulting.php", to: "/it-infra/" },
  { from: "/it-infra-service_it-infra-build.php", to: "/it-infra/build/" },
  { from: "/it-infra-service_maintenance.php", to: "/it-infra/maintenance/" },

  // Career / Contact
  { from: "/career.php", to: "/career/" },
  { from: "/contact-us_contact.php", to: "/contact/" },
  { from: "/contact-us_inquiry.php", to: "/contact/inquiry/" },

  // 기타
  { from: "/etc_recruit.php", to: "/etc/recruit/" },
  { from: "/etc_ethics.php", to: "/etc/ethics/" },
  { from: "/etc_privacy-policy.php", to: "/etc/privacy-policy/" },
];
