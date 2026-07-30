/**
 * 제품 카탈로그 (Product 섹션의 단일 원본)
 * ---------------------------------------------------------------------------
 * 기존 사이트는 제품 페이지마다 1·2차 탭 메뉴와 제품 카드 마크업을 전부
 * 복사해서 갖고 있었습니다(product_ibm_*.php, product_lenovo_*.php ...).
 * 이제 이 파일이 유일한 원본이고,
 *   - 페이지          : src/products/product.njk  (pagination 으로 자동 생성)
 *   - 1차 탭(벤더)    : src/_data/nav.js 에서 자동 생성
 *   - 2차 탭(카테고리): src/_data/nav.js 에서 자동 생성
 * 이 모두 이 배열에서 파생됩니다.
 *
 * ── 항목(item) 필드 ─────────────────────────────────────────────────────────
 *   line     : 제품군 이름 (카드 제목 첫 줄)          예) "Power"
 *   model    : 모델명      (카드 제목 둘째 줄)        예) "E1180"
 *   label    : 카드 상단 분류 라벨                    예) "IBM Power UNIX Server"
 *   summary  : 한 줄 소개
 *   features : 주요 특징 목록 (문자열 배열)
 *   link     : 제조사 상세 페이지 URL (없으면 버튼 숨김)
 *   image    : 사진 에셋 경로. 기존 사이트 경로를 그대로 사용합니다.
 *   imageAlt : 대체 텍스트 (미지정 시 "line model 제품 이미지")
 *
 * ── 새 제품 페이지를 추가할 때 ──────────────────────────────────────────────
 *   아래 배열에 { vendor, vendorSlug, category, categorySlug, ... } 객체를
 *   하나 추가하면 URL·탭·sitemap 이 함께 생성됩니다. 별도 파일 작업 없음.
 *   items 가 비어 있으면 "콘텐츠 준비중" 안내가 표시됩니다.
 */

const IBM_UNIX = "IBM Power UNIX Server";

export default [
  // ═══════════════════════════════════════════════════════════════════════
  // IBM
  // ═══════════════════════════════════════════════════════════════════════
  {
    vendor: "IBM",
    vendorSlug: "ibm",
    category: "Power UNIX Server",
    categorySlug: "power-unix-server",
    titleLines: ["Power UNIX", "Server"],
    lead: "AIX·IBM i·Linux 미션 크리티컬 워크로드를 위한 IBM Power 서버 전 라인업을 공급합니다.",
    groups: [
      {
        title: "Power11",
        description: "AI 시대의 확장성과 복원력을 갖춘 최신 세대 Power 서버입니다.",
        items: [
          {
            line: "Power",
            model: "E1180",
            label: IBM_UNIX,
            summary: "가장 강력한 Power 서버",
            features: [
              "비즈니스 연속성: 배포 모델 전반의 미션 크리티컬 워크로드를 위한 복원력 있는 기반을 제공합니다.",
              "생산성 및 효율성: 효율성을 극대화하고 복잡성을 줄이도록 설계되었습니다.",
              "AI 시대를 위한 확장 가능한 성장: 보안과 일관성에 중점을 두고 AI 기반 혁신과 워크로드 확장을 지원하도록 설계되었습니다.",
            ],
            link: "https://www.ibm.com/kr-ko/products/power-e1180",
            image: "/images/photo/product/server-enterprise-rack.svg",
            imageAlt: "IBM Power E1180 엔터프라이즈 랙 서버 이미지",
          },
          {
            line: "Power",
            model: "E1150",
            label: IBM_UNIX,
            summary: "공간 효율적인 엔터프라이즈 서버",
            features: [
              "비즈니스 연속성: 미션 크리티컬 워크로드를 위한 복원력을 갖춘 플랫폼입니다. 배포 모델 전반에서 위험 완화 및 규정 준수를 지원하는 기능이 있습니다.",
              "생산성 및 효율성: 다양한 툴과 자동화를 통해 복잡성을 줄이고 가동 시간을 개선하며 운영을 간소화하여 비용을 절감할 수 있습니다.",
              "AI 시대에 확장 가능한 성장: AI 및 차세대 애플리케이션의 배포를 빠르고, 유연하게, 일관성 있으면서 안전하게 지원하도록 설계된 인프라입니다.",
            ],
            link: "https://www.ibm.com/kr-ko/products/power-e1150",
            image: "/images/photo/product/server-4u.svg",
            imageAlt: "IBM Power E1150 4U 랙마운트 서버 이미지",
          },
          {
            line: "Power",
            model: "S1124",
            label: IBM_UNIX,
            summary: "가격대비 뛰어난 성능",
            features: [
              "비즈니스 연속성: 미션 크리티컬 워크로드를 위한 복원력 있는 안정적인 기반을 제공하여 배포 모델에 관계없이 위협 및 규제에 대한 위험을 줄여줍니다.",
              "생산성 및 효율성: 인프라가 새로운 수준의 가동 시간과 운영 효율성을 달성하도록 지원하여 복잡성과 비용을 크게 줄입니다.",
              "AI 시대를 위한 가속화된 성장과 확장성: 미션 크리티컬 프로세스를 위한 광범위한 AI 사용 사례와 새로운 애플리케이션을 일관되고 안전하고 원활하게 배포하여 빠른 성장과 확장성을 지원합니다.",
            ],
            link: "https://www.ibm.com/kr-ko/products/power-s1124",
            image: "/images/photo/product/server-2u.svg",
            imageAlt: "IBM Power S1124 2U 랙마운트 서버 이미지",
          },
          {
            line: "Power",
            model: "S1122",
            label: IBM_UNIX,
            summary: "가격대비 뛰어난 성능",
            features: [
              "비즈니스 연속성: 미션 크리티컬 워크로드를 위한 복원력 있고 안정적인 기반을 제공하여 배포 모델에 관계없이 위협 및 규제에 대한 위험 노출을 최소화합니다.",
              "생산성 및 효율성: 인프라가 새로운 수준의 가용성과 운영 효율성을 달성하도록 지원하며, 복잡성과 비용을 획기적으로 줄여줍니다.",
              "AI 시대를 위한 가속화된 성장과 확장성: 보다 광범위한 AI 활용 사례와 신규 애플리케이션을 미션 크리티컬한 업무 환경에 일관되고 안전하고 원활하게 배포함으로써, 빠른 성장과 확장성을 지원합니다.",
            ],
            link: "https://www.ibm.com/kr-ko/products/power-s1122",
            image: "/images/photo/product/server-2u.svg",
            imageAlt: "IBM Power S1122 2U 랙마운트 서버 이미지",
          },
        ],
      },
      {
        title: "Power10",
        description: "하이브리드 클라우드 환경에서 검증된 이전 세대 Power 서버입니다.",
        items: [
          {
            line: "Power",
            model: "E1080",
            label: IBM_UNIX,
            summary:
              "하이브리드 클라우드 전반에 코어 운영 워크로드 및 AI 애플리케이션을 안전하고 효율적으로 확장하도록 설계되었습니다.",
            features: ["계층적 보호 제공", "효율성 향상", "손쉬운 AI 배포", "가용성 향상"],
            link: "https://www.ibm.com/kr-ko/products/power-e1080",
            image: "/images/photo/product/server-enterprise-rack.svg",
            imageAlt: "IBM Power E1080 엔터프라이즈 랙 서버 이미지",
          },
          {
            line: "Power",
            model: "E1050",
            label: IBM_UNIX,
            summary:
              "IBM Power E1050 미드레인지 서버는 안정적이고 안전하며 공간 효율적인 4U 랙에서 엔터프라이즈급 기능을 제공합니다.",
            features: ["보안 향상", "효율적인 확장", "가용성 극대화", "인사이트 간소화"],
            link: "https://www.ibm.com/kr-ko/products/power-e1050",
            image: "/images/photo/product/server-4u.svg",
            imageAlt: "IBM Power E1050 4U 랙마운트 서버 이미지",
          },
          {
            line: "Power",
            model: "S1024",
            label: IBM_UNIX,
            summary:
              "IBM Power S1024는 IBM Power9 기반 서버의 코어를 두 배로 늘려 보다 적은 수의 서버에서 워크로드를 통합할 수 있습니다.",
            features: [
              "애플리케이션 성능 향상",
              "인프라 비용 절감",
              "코어부터 클라우드까지 강력한 보안",
              "업계를 선도하는 RAS",
              "AI 추론",
              "유연한 소비 모델",
            ],
            link: "https://www.ibm.com/kr-ko/products/power-s1024",
            image: "/images/photo/product/server-2u.svg",
            imageAlt: "IBM Power S1024 2U 랙마운트 서버 이미지",
          },
          {
            line: "Power",
            model: "S1022",
            label: IBM_UNIX,
            summary:
              "IBM AIX, IBM i, Linux에서 실행하는 비즈니스 크리티컬 워크로드에 적합하게 설계된 2소켓, 2U 서버입니다.",
            features: [
              "앱 기능 확장",
              "IT 비용 절감",
              "보안 향상",
              "최적의 RAS 제공",
              "AI 추론 실행",
              "필요한 만큼만 결제",
            ],
            link: "https://www.ibm.com/kr-ko/products/power-s1022",
            image: "/images/photo/product/server-2u.svg",
            imageAlt: "IBM Power S1022 2U 랙마운트 서버 이미지",
          },
        ],
      },
    ],
  },

  {
    vendor: "IBM",
    vendorSlug: "ibm",
    category: "Linux on Power",
    categorySlug: "linux-on-power",
    titleLines: ["Linux on", "Power"],
    lead: "Power 아키텍처에서 리눅스 워크로드를 실행하는 서버 라인업입니다.",
    // TODO: 기존 product_ibm_linux-on-power.php 의 제품 카드 내용을 옮겨 주세요.
    //       형식은 위 Power UNIX Server 항목과 동일합니다.
    groups: [],
  },

  {
    vendor: "IBM",
    vendorSlug: "ibm",
    category: "Storage",
    categorySlug: "storage",
    titleLines: ["Storage"],
    lead: "IBM 스토리지 제품군으로 데이터 보호와 확장성을 확보합니다.",
    // TODO: 기존 product_ibm_storage.php 의 제품 카드 내용을 옮겨 주세요.
    groups: [],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Lenovo
  // ═══════════════════════════════════════════════════════════════════════
  {
    vendor: "Lenovo",
    vendorSlug: "lenovo",
    category: "x86 Server",
    categorySlug: "x86-server",
    titleLines: ["x86", "Server"],
    lead: "Lenovo ThinkSystem 기반 x86 서버를 공급합니다.",
    // TODO: 기존 product_lenovo_x86-server.php 의 제품 카드 내용을 옮겨 주세요.
    groups: [],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Dell
  // ═══════════════════════════════════════════════════════════════════════
  {
    vendor: "Dell",
    vendorSlug: "dell",
    category: "x86 Server",
    categorySlug: "x86-server",
    titleLines: ["x86", "Server"],
    lead: "Dell PowerEdge 기반 x86 서버를 공급합니다.",
    // TODO: 기존 product_dell_x86-server.php 의 제품 카드 내용을 옮겨 주세요.
    groups: [],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // S/W
  // ═══════════════════════════════════════════════════════════════════════
  {
    vendor: "S/W",
    vendorSlug: "sw",
    category: "IBM Spectrum Scale",
    categorySlug: "ibm-spectrum-scale",
    titleLines: ["IBM Spectrum", "Scale"],
    lead: "대용량 데이터를 위한 병렬 파일 시스템 소프트웨어입니다.",
    // TODO: 기존 product_sw_ibm-spectrum-scale.php 의 제품 카드 내용을 옮겨 주세요.
    groups: [],
  },
];
