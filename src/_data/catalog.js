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
            image: "/images/photo/product/ibm/UnixServer/power11_e1180.png",
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
            image: "/images/photo/product/ibm/UnixServer/power11_e1150.png",
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
            image: "/images/photo/product/ibm/UnixServer/power11_s1124.png",
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
            image: "/images/photo/product/ibm/UnixServer/power11_s1122.png",
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
            label: "Unix Server",
            summary:
              "하이브리드 클라우드 전반에 코어 운영 워크로드 및 AI 애플리케이션을 안전하고 효율적으로 확장하도록 설계되었습니다.",
            features: ["계층적 보호 제공", "효율성 향상", "손쉬운 AI 배포", "가용성 향상"],
            link: "https://www.ibm.com/kr-ko/products/power-e1080?mhsrc=ibmsearch_a&mhq=e1080",
            image: "/images/photo/product/ibm/UnixServer/power9_e1080.png",
            imageAlt: "IBM Power E1080 엔터프라이즈 랙 서버 이미지",
          },
          {
            line: "Power",
            model: "E1050",
            label: "Unix Server",
            summary:
              "IBM Power E1050 미드레인지 서버는 안정적이고 안전하며 공간 효율적인 4U 랙에서 엔터프라이즈급 기능을 제공합니다.",
            features: ["보안 향상", "효율적인 확장", "가용성 극대화", "인사이트 간소화"],
            link: "https://www.ibm.com/kr-ko/products/power-e1050?mhsrc=ibmsearch_a&mhq=e1050",
            image: "/images/photo/product/ibm/UnixServer/power9_e1050.png",
            imageAlt: "IBM Power E1050 4U 랙마운트 서버 이미지",
          },
          {
            line: "Power",
            model: "S1024",
            label: "Unix Server",
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
            link: "https://www.ibm.com/kr-ko/products/power-s1024?mhsrc=ibmsearch_a&mhq=s1024",
            image: "/images/photo/product/ibm/UnixServer/power10_s1024.png",
            imageAlt: "IBM Power S1024 2U 랙마운트 서버 이미지",
          },
          {
            line: "Power",
            model: "S1022",
            label: "Unix Server",
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
            link: "https://www.ibm.com/kr-ko/products/power-s1022?mhsrc=ibmsearch_a&mhq=S1022",
            image: "/images/photo/product/ibm/UnixServer/power9_s1022.png",
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
    groups: [
      {
        title: "Linux on Power",
        items: [
          {
            line: "Power System",
            model: "L1024",
            label: "IBM Linux on Power",
            summary: "유연하고 안전하게 보호받는 하이브리드 클라우드 인프라로 민첩성을 창출합니다.",
            features: [
              "프로세서 수준에서 메모리를 암호화하고 POWER9에 비해 각 코어에서 4배 더 많은 암호화 엔진을 통해 코어에서 클라우드까지 데이터를 보호합니다.",
              "코어당 4개의 매트릭스 매스 액셀러레이터(MMA)를 통해 인사이트와 자동화를 간소화하여 AI 추론 속도를 높입니다.",
              "액티브 메모리 미러링을 통해 업계 표준 DIMM보다 2배 향상된 메모리 안정성과 가용성을 제공합니다.",
            ],
            link: "https://www.ibm.com/kr-ko/products/power/linux",
            image: "/images/photo/product/ibm/LinuxonPower/l1024.png",
            imageAlt: "IBM Power System L1024 서버 제품 이미지",
          },
          {
            line: "Power System",
            model: "L1022",
            label: "IBM Linux on Power",
            summary: "유연하고 안전한 하이브리드 클라우드 인프라를 통해 민첩성을 창출합니다.",
            features: [
              "프로세서 레벨의 메모리 암호화와 더불어 POWER9 대비 코어마다 4배 더 늘어난 암호화 엔진을 통해 코어부터 클라우드까지 데이터 보호",
              "코어당 4개의 MMA를 통해 인사이트 및 자동화를 간소화하여 AI 추론 속도 향상",
              "액티브 메모리 미러링을 통해 업계 표준 DIMM보다 2배 향상된 메모리 안정성 및 가용성 제공",
            ],
            link: "https://www.ibm.com/kr-ko/products/power/linux",
            image: "/images/photo/product/ibm/LinuxonPower/l1022.png",
            imageAlt: "IBM Power System L1022 서버 제품 이미지",
          },
        ],
      },
    ],
  },

  {
    vendor: "IBM",
    vendorSlug: "ibm",
    category: "Storage",
    categorySlug: "storage",
    titleLines: ["Storage"],
    lead: "IBM 스토리지 제품군으로 데이터 보호와 확장성을 확보합니다.",
    groups: [
      {
        title: "Storage",
        items: [
          {
            line: "",
            model: "FlashSystem 9500",
            label: "Storage",
            summary: "엔터프라이즈 비즈니스 뿐만 아니라 AI/Big Data 분석 환경을 위한 하이엔드 스토리지입니다.",
            features: [],
            link: "https://www.ibm.com/products/flashsystem-9500",
            image: "/images/photo/product/ibm/Storage/fs9500.png",
            imageAlt: "IBM FlashSystem 9500 스토리지 제품 이미지",
          },
          {
            line: "",
            model: "FlashSystem 7300",
            label: "Storage",
            summary: "NVMe 및 고성능 SCM 모듈을 통한 성능가속화와 IBM만의 하드웨어 기반 압축 모듈을 통한 확장성을 지원하는 미드레인지 스토리지입니다.",
            features: [],
            link: "https://www.ibm.com/products/flashsystem-7300",
            image: "/images/photo/product/ibm/Storage/fs7300.png",
            imageAlt: "IBM FlashSystem 7300 스토리지 제품 이미지",
          },
          {
            line: "",
            model: "FlashSystem 5300",
            label: "Storage",
            summary: "기업의 요구 사항에 맞는 경제성, 성능, 데이터 보호, 확장성 및 관리 편의성을 제공하는 하나의 강력한 컴팩트 플래시 스토리지 솔루션입니다.",
            features: [],
            link: "https://www.ibm.com/kr-ko/products/flashsystem-5300",
            image: "/images/photo/product/ibm/Storage/fs5300.png",
            imageAlt: "IBM FlashSystem 5300 스토리지 제품 이미지",
          },
          {
            line: "",
            model: "FlashSystem 5015/5045",
            label: "Storage",
            summary: "빠른 속도, 스마트한 운영, 합리적인 가격의 하이브리드 클라우드 지원 스토리지 솔루션입니다.",
            features: [],
            link: "https://www.ibm.com/kr-ko/products/flashsystem-5000?mhsrc=ibmsearch_a&mhq=FlashSystem%205035",
            image: "/images/photo/product/ibm/Storage/fs5045.png",
            imageAlt: "IBM FlashSystem 5015 및 5045 스토리지 제품 이미지",
          },
          {
            line: "",
            model: "Storage Scale System 6000",
            label: "Storage",
            summary: "AI 훈련 및 추론 성능 가속화 NVIDIA GPUDirect를 지원하는 글로벌 데이터 플랫폼",
            features: [
              "최대 330GB/s 처리량",
              "최대 1,300만 IOPS 입출력 처리속도",
              "최대 3.4PBe 유효 용량 제공",
              "최대 48개의 3.84TB, 7.68TB, 15.36TB 또는 30.72TB 2.5인치 NVMe 플래시 드라이브 및 38.4TB FlashCore Module(FCM)4 모듈 지원",
            ],
            link: "https://www.ibm.com/kr-ko/products/storage-scale-system",
            image: "/images/photo/product/ibm/Storage/sss6000.png",
            imageAlt: "IBM Storage Scale System 6000 스토리지 제품 이미지",
          },
          {
            line: "",
            model: "Storage Scale System 3500",
            label: "Storage",
            summary: "까다로운 AI, HPC, 분석 및 하이브리드 클라우드 워크로드를 위한 분산 파일 및 객체 스토리지 제공",
            features: [
              "최대 126GB/s 처리량",
              "최대 120만 IOPS 입출력 처리속도",
              "표준 2U 랙 공간에서 최대 500TB 사용 가능 용량",
              "최대 24개의 3.84TB, 7.68TB, 15.36TB 또는 30.72TB 2.5인치 NVMe 플래시 드라이브 지원",
            ],
            link: "https://www.ibm.com/kr-ko/products/storage-scale-system",
            image: "/images/photo/product/ibm/Storage/sss3500.png",
            imageAlt: "IBM Storage Scale System 3500 스토리지 제품 이미지",
          },
          {
            line: "",
            model: "TS7700",
            label: "Storage",
            summary: "데이터 보호와 비즈니스 연속성을 최적화하는 메인 프레임 가상 테이프 입니다.",
            features: [
              "데이터 보호와 비즈니스 연속성을 최적화하는 메인프레임 가상 테이프 솔루션",
              "기존 테이프 작업과의 호환성을 유지하면서 TS7700을 디스크 속도로 작동시킬 수 있습니다",
              "그리드 통신 기능으로 모든 호스트에 대한 액세스를 제공하여 탁월한 비즈니스 연속성을 제공",
              "IBM 플랫폼에 빌드되어 향상된 성능, 고밀도의 디스크 용량을 제공",
            ],
            link: "https://www.ibm.com/kr-ko/products/ts7700",
            image: "/images/photo/product/ibm/Storage/ts7700.png",
            imageAlt: "IBM TS7700 가상 테이프 스토리지 제품 이미지",
          },
          {
            line: "",
            model: "TS4300",
            label: "Storage",
            summary: "확장성이 뛰어난 테이프 라이브러리에서 사이버 복원 장기 데이터 스토리지를 강화합니다.",
            features: [],
            link: "https://www.ibm.com/kr-ko/products/ts4300",
            image: "/images/photo/product/ibm/Storage/ts4300.png",
            imageAlt: "IBM TS4300 테이프 스토리지 제품 이미지",
          },
        ],
      },
    ],
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
    groups: [
      {
        title: "x86 Server",
        items: [
          {
            line: "ThinkSystem",
            model: "SR250",
            label: "X86 Server",
            summary: "성능, 안정성 및 유연성을 제공하는 1소켓 랙 서버",
            features: [],
            link: "https://www.lenovo.com/kr/ko/data-center/servers/racks/ThinkSystem-SR250/p/77XX7SRSR25",
            image: "/images/photo/product/lenovo/x86/sr250.png",
            imageAlt: "Lenovo ThinkSystem SR250 랙 서버 제품 이미지",
          },
          {
            line: "ThinkSystem",
            model: "SR650",
            label: "X86 Server",
            summary: "최고의 안정성을 통해 속도와 확장성을 제공 하도록 설계 된 2소켓 랙 서버",
            features: [],
            link: "https://www.lenovo.com/kr/ko/data-center/servers/racks/ThinkSystem-SR650/p/77XX7SRSR65",
            image: "/images/photo/product/lenovo/x86/sr650.png",
            imageAlt: "Lenovo ThinkSystem SR650 랙 서버 제품 이미지",
          },
          {
            line: "ThinkSystem",
            model: "SR850",
            label: "X86 Server",
            summary: "2U 랙 형 서버에 2~4소켓 CPU 장착",
            features: [],
            link: "https://www.lenovo.com/kr/ko/data-center/servers/mission-critical/ThinkSystem-SR850/p/77XX7HSSR85",
            image: "/images/photo/product/lenovo/x86/sr850.png",
            imageAlt: "Lenovo ThinkSystem SR850 랙 서버 제품 이미지",
          },
          {
            line: "ThinkSystem",
            model: "SR950",
            label: "X86 Server",
            summary: "대용량 메모리 및 뛰어난 확장성 보유 시스템으로 최고의 컴퓨팅 성능을 제공하는 8소켓 랙 서버",
            features: [],
            link: "https://www.lenovo.com/kr/ko/data-center/servers/mission-critical/Lenovo-ThinkSystem-SR950/p/77XX7HSSR95",
            image: "/images/photo/product/lenovo/x86/sr950.png",
            imageAlt: "Lenovo ThinkSystem SR950 랙 서버 제품 이미지",
          },
        ],
      },
    ],
  },
  {
    vendor: "Lenovo",
    vendorSlug: "lenovo",
    category: "GPU Server",
    categorySlug: "gpu-server",
    titleLines: ["GPU", "Server"],
    lead: "Lenovo ThinkSystem GPU 서버를 공급합니다.",
    groups: [
      {
        title: "GPU Server",
        items: [
          {
            line: "ThinkSystem",
            model: "SR670",
            label: "GPU Server",
            summary: "HPC 및 AI 워크로드를 위한 2U노드에 최대 8개의 GPU를 장착 가능한 2소켓 서버",
            features: [],
            link: "https://www.lenovo.com/kr/ko/data-center/servers/racks/Thinksystem-SR670/p/77XX7SRSR67",
            image: "/images/photo/product/lenovo/gpu/sr670.png",
            imageAlt: "Lenovo ThinkSystem SR670 GPU 서버 제품 이미지",
          },
          {
            line: "ThinkSystem",
            model: "SR860",
            label: "GPU Server",
            summary: "HPC 및 AI 워크로드를 위한 2U노드에 최대 8개의 GPU를 장착 가능한 2~4소켓 서버",
            features: [],
            link: "https://www.lenovo.com/kr/ko/data-center/servers/mission-critical/ThinkSystem-SR860-V2/p/77XX7HS86V2",
            image: "/images/photo/product/lenovo/gpu/sr860.png",
            imageAlt: "Lenovo ThinkSystem SR860 GPU 서버 제품 이미지",
          },
        ],
      },
    ],
  },
  {
    vendor: "Lenovo",
    vendorSlug: "lenovo",
    category: "HCI Server",
    categorySlug: "hci-server",
    titleLines: ["HCI", "Server"],
    lead: "Lenovo ThinkAgile 하이퍼컨버지드 서버를 공급합니다.",
    groups: [
      {
        title: "HCI Server",
        items: [
          {
            line: "Think Agile",
            model: "VX3320",
            label: "HCI Server",
            summary: "VMware의 하이퍼 컨버전스 소프트웨와 Lenovo 엔터프라이즈 플랫폼을 결합한 1U 하이퍼 컨버지드 시스템",
            features: [],
            link: "https://www.lenovo.com/kr/ko/data-center/software-defined-infrastructure/ThinkAgile-VX-Series/p/WMD00000340",
            image: "/images/photo/product/lenovo/hci/vx3320.png",
            imageAlt: "Lenovo ThinkAgile VX3320 HCI 서버 제품 이미지",
          },
          {
            line: "Think Agile",
            model: "VX7520",
            label: "HCI Server",
            summary: "VMware의 하이퍼 컨버전스 소프트웨와 Lenovo 엔터프라이즈 플랫폼을 결합한 2U 하이퍼 컨버지드 시스템",
            features: [],
            link: "https://www.lenovo.com/kr/ko/data-center/software-defined-infrastructure/ThinkAgile-VX-Series/p/WMD00000340",
            image: "/images/photo/product/lenovo/hci/vx7520.png",
            imageAlt: "Lenovo ThinkAgile VX7520 HCI 서버 제품 이미지",
          },
          {
            line: "Think Agile",
            model: "HX3320",
            label: "HCI Server",
            summary: "Nutanix의 하이퍼 컨버전스 소프트웨와 Lenovo 엔터프라이즈 플랫폼을 결합한 1U 하이퍼 컨버지드 시스템",
            features: [],
            link: "https://www.lenovo.com/kr/ko/data-center/software-defined-infrastructure/ThinkAgile-HX-Series/p/WMD00000326",
            image: "/images/photo/product/lenovo/hci/hx3320.png",
            imageAlt: "Lenovo ThinkAgile HX3320 HCI 서버 제품 이미지",
          },
          {
            line: "Think Agile",
            model: "HX7520",
            label: "HCI Server",
            summary: "Nutanix의 하이퍼 컨버전스 소프트웨와 Lenovo 엔터프라이즈 플랫폼을 결합한 2U 하이퍼 컨버지드 시스템",
            features: [],
            link: "https://www.lenovo.com/kr/ko/data-center/software-defined-infrastructure/ThinkAgile-HX-Series/p/WMD00000326",
            image: "/images/photo/product/lenovo/hci/hx7520.png",
            imageAlt: "Lenovo ThinkAgile HX7520 HCI 서버 제품 이미지",
          },
        ],
      },
    ],
  },
  {
    vendor: "Lenovo",
    vendorSlug: "lenovo",
    category: "Storage",
    categorySlug: "storage",
    titleLines: ["Storage"],
    lead: "Lenovo ThinkSystem 스토리지를 공급합니다.",
    groups: [
      {
        title: "Storage",
        items: [
          {
            line: "ThinkSystem",
            model: "DM5000H",
            label: "Storage",
            summary: "성능, 단순성, 용량, 보안 및 고가용성을 제공하도록 설계된 미드레인지 급의 하이브리드 스토리지",
            features: [],
            link: "https://www.lenovo.com/kr/ko/data-center/storage/unified-storage/thinksystem-dm-series/ThinkSystem-DM-Series-Hybrid-Flash-Array/p/WMD00000376",
            image: "/images/photo/product/lenovo/storage/dm5000h.png",
            imageAlt: "Lenovo ThinkSystem DM5000H 스토리지 제품 이미지",
          },
          {
            line: "ThinkSystem",
            model: "DM7000H",
            label: "Storage",
            summary: "성능, 단순성, 용량, 보안 및 고가용성을 제공하도록 설계된 엔터프라이즈 급의 하이브리드 스토리지",
            features: [],
            link: "https://www.lenovo.com/kr/ko/data-center/storage/unified-storage/thinksystem-dm-series/ThinkSystem-DM-Series-Hybrid-Flash-Array/p/WMD00000376",
            image: "/images/photo/product/lenovo/storage/dm7000h.png",
            imageAlt: "Lenovo ThinkSystem DM7000H 스토리지 제품 이미지",
          },
          {
            line: "ThinkSystem",
            model: "DM5000F",
            label: "Storage",
            summary: "성능, 단순성, 용량, 보안 및 고가용성을 제공하도록 설계된 미드레인지 급의 ALL FLASH 스토리지",
            features: [],
            link: "https://www.lenovo.com/kr/ko/data-center/storage/unified-storage/thinksystem-dm-series/ThinkSystem-DM-Series-All-Flash-Array/p/WMD00000375",
            image: "/images/photo/product/lenovo/storage/dm5000f.png",
            imageAlt: "Lenovo ThinkSystem DM5000F 스토리지 제품 이미지",
          },
          {
            line: "ThinkSystem",
            model: "DM7000F",
            label: "Storage",
            summary: "성능, 단순성, 용량, 보안 및 고가용성을 제공하도록 설계된 엔터프라이즈 급의 ALL FLASH 스토리지",
            features: [],
            link: "https://www.lenovo.com/kr/ko/data-center/storage/unified-storage/thinksystem-dm-series/ThinkSystem-DM-Series-All-Flash-Array/p/WMD00000375",
            image: "/images/photo/product/lenovo/storage/dm7000f.png",
            imageAlt: "Lenovo ThinkSystem DM7000F 스토리지 제품 이미지",
          },
        ],
      },
    ],
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
    groups: [
      {
        title: "x86 Server",
        items: [
          {
            line: "PowerEdge",
            model: "R340",
            label: "X86 Server",
            summary: "데이터 워크로드를 요구하는 간소화된 환경에서 생산성을 높인 단일 소켓 1U 랙 서버",
            features: [],
            link: "https://www.dell.com/ko-kr/work/shop/povw/poweredge-r340",
            image: "/images/photo/product/dell/x86/r340.png",
            imageAlt: "Dell PowerEdge R340 랙 서버 제품 이미지",
          },
          {
            line: "PowerEdge",
            model: "R740",
            label: "X86 Server",
            summary: "애플리케이션 성능을 가속화하도록 설계된 2소켓 2U 랙 서버",
            features: [],
            link: "https://www.dell.com/ko-kr/work/shop/povw/poweredge-r740",
            image: "/images/photo/product/dell/x86/r740.png",
            imageAlt: "Dell PowerEdge R740 랙 서버 제품 이미지",
          },
          {
            line: "PowerEdge",
            model: "R740xd",
            label: "X86 Server",
            summary: "스토리지 확장성이 극대화하여 VDI업무에 적합한 2소켓 2U 랙 서버",
            features: [],
            link: "https://www.dell.com/ko-kr/work/shop/povw/poweredge-r740xd",
            image: "/images/photo/product/dell/x86/r740xd.png",
            imageAlt: "Dell PowerEdge R740xd 랙 서버 제품 이미지",
          },
          {
            line: "PowerEdge",
            model: "R740xd2",
            label: "X86 Server",
            summary: "빠른 네트워킹 옵션으로 스트리밍에 필요한 요건을 충족할 수 있는 2소켓 2U 랙 서버",
            features: [],
            link: "https://www.dell.com/ko-kr/work/shop/povw/poweredge-r740xd2",
            image: "/images/photo/product/dell/x86/r740xd2.png",
            imageAlt: "Dell PowerEdge R740xd2 랙 서버 제품 이미지",
          },
        ],
      },
    ],
  },
  {
    vendor: "Dell",
    vendorSlug: "dell",
    category: "GPU Server",
    categorySlug: "gpu-server",
    titleLines: ["GPU", "Server"],
    lead: "Dell PowerEdge GPU 서버를 공급합니다.",
    groups: [
      {
        title: "GPU Server",
        items: [
          {
            line: "PowerEdge",
            model: "R840",
            label: "GPU Server",
            summary: "데이터 분석 정보를 빠르게 제공하도록 설계된 고집적 4소켓 2U GPU 서버",
            features: [],
            link: "https://www.dell.com/ko-kr/work/shop/povw/poweredge-r840",
            image: "/images/photo/product/dell/gpu/r840.png",
            imageAlt: "Dell PowerEdge R840 GPU 서버 제품 이미지",
          },
        ],
      },
    ],
  },
  {
    vendor: "Dell",
    vendorSlug: "dell",
    category: "HCI Server",
    categorySlug: "hci-server",
    titleLines: ["HCI", "Server"],
    lead: "Dell VxRail 하이퍼컨버지드 서버를 공급합니다.",
    groups: [
      {
        title: "HCI Server",
        items: [
          {
            line: "VxRail",
            model: "E560/E560F",
            label: "HCI Server",
            summary: "스케일 아웃을 이용한 공간 최적화 방식의 HCI 노드(All-Flash 지원)",
            features: [],
            link: "https://www.delltechnologies.com/ko-kr/converged-infrastructure/vxrail/index.htm#accordion0",
            image: "/images/photo/product/dell/hci/e560.png",
            imageAlt: "Dell VxRail E560 및 E560F HCI 서버 제품 이미지",
          },
          {
            line: "VxRail",
            model: "P570/P570F",
            label: "HCI Server",
            summary: "대규모 워크로드에 최적화된 고성능 HCI 노드(All-Flash 지원)",
            features: [],
            link: "https://www.delltechnologies.com/ko-kr/converged-infrastructure/vxrail/index.htm#accordion0",
            image: "/images/photo/product/dell/hci/p570.png",
            imageAlt: "Dell VxRail P570 및 P570F HCI 서버 제품 이미지",
          },
          {
            line: "VxRail",
            model: "V570/V570F",
            label: "HCI Server",
            summary: "2D/3D 시각화와 같은 특수한 용도의 GPU 지원 노드(All-Flash 지원)",
            features: [],
            link: "https://www.delltechnologies.com/ko-kr/converged-infrastructure/vxrail/index.htm#accordion0",
            image: "/images/photo/product/dell/hci/v570.png",
            imageAlt: "Dell VxRail V570 및 V570F HCI 서버 제품 이미지",
          },
          {
            line: "VxRail",
            model: "S570",
            label: "HCI Server",
            summary: "공동작업, 데이터 분석을 위한 확장된 스토리지 HCI 노드",
            features: [],
            link: "https://www.delltechnologies.com/ko-kr/converged-infrastructure/vxrail/index.htm#accordion0",
            image: "/images/photo/product/dell/hci/s570.png",
            imageAlt: "Dell VxRail S570 HCI 서버 제품 이미지",
          },
        ],
      },
    ],
  },
  {
    vendor: "Dell",
    vendorSlug: "dell",
    category: "Storage",
    categorySlug: "storage",
    titleLines: ["Storage"],
    lead: "Dell EMC 스토리지를 공급합니다.",
    groups: [
      {
        title: "Storage",
        items: [
          {
            line: "EMC",
            model: "SC5020",
            label: "Storage",
            summary: "자체 최적화 SSD, HDD 또는 하이브리드 구성은 혼합 애플리케이션 환경을 위한 경제적인 고성능 솔루션을 제공합니다.",
            features: [],
            link: "https://www.dell.com/ko-kr/work/shop/povw/storage-sc5000",
            image: "/images/photo/product/dell/storage/sc5020.png",
            imageAlt: "Dell EMC SC5020 스토리지 제품 이미지",
          },
          {
            line: "EMC",
            model: "SC7020",
            label: "Storage",
            summary: "유연하고 성능이 우수하며 미래에 대비하는 SC7020으로 다양한 스토리지 과제를 극복할 수 있습니다.",
            features: [],
            link: "https://www.dell.com/ko-kr/work/shop/povw/storage-sc7020",
            image: "/images/photo/product/dell/storage/sc7020.png",
            imageAlt: "Dell EMC SC7020 스토리지 제품 이미지",
          },
          {
            line: "EMC",
            model: "SC9000",
            label: "Storage",
            summary: "빠르고 확장성이 뛰어난 Dell EMC SC9000으로 데이터 센터를 가속화하고 TCO를 절감할 수 있습니다.",
            features: [],
            link: "https://www.dell.com/ko-kr/work/shop/povw/storage-sc9000",
            image: "/images/photo/product/dell/storage/sc9000.png",
            imageAlt: "Dell EMC SC9000 스토리지 제품 이미지",
          },
          {
            line: "EMC",
            model: "All-Flash",
            label: "Storage",
            summary: "최신 워크로드에 대한 스마트한 AFA 선택은 자체 최적화 성능, 페더레이션된 확장 및 이동성, 포괄적 소프트웨어 가치를 제공합니다.",
            features: [],
            link: "https://www.dell.com/ko-kr/work/shop/povw/storage-sc-all-flash",
            image: "/images/photo/product/dell/storage/all.png",
            imageAlt: "Dell EMC All-Flash 스토리지 제품 이미지",
          },
        ],
      },
    ],
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
    lead: "빠르게 인사이트를 제공하며 빠르게 확장하는 인프라를 관리할 수 있는 조직이 곧 업계의 리더가 됩니다.",
    groups: [],
  },
  {
    vendor: "S/W",
    vendorSlug: "sw",
    category: "IBM DB2",
    categorySlug: "ibm-db2",
    titleLines: ["IBM", "DB2"],
    lead: "IBM 데이터베이스 관리 툴 제품군을 통해 데이터베이스 시스템을 통합적으로 설계, 개발, 테스트, 모니터링, 마이그레이션, 관리할 수 있습니다.",
    groups: [],
  },
  {
    vendor: "S/W",
    vendorSlug: "sw",
    category: "IBM WebSphere",
    categorySlug: "ibm-web-sphere",
    titleLines: ["IBM", "WebSphere"],
    lead: "IBM WebSphere Application Server는 기존 웹 애플리케이션과 새로운 차세대 마이크로서비스에 유연하고, 안전한 Java EE 7 런타임 환경을 제공합니다.",
    groups: [],
  },
  {
    vendor: "S/W",
    vendorSlug: "sw",
    category: "IBM Instana",
    categorySlug: "ibm-instana",
    titleLines: ["IBM", "Instana"],
    lead: "에이전틱 AI로 구동되는 풀 스택 관측 가능성",
    groups: [],
  },
  {
    vendor: "S/W",
    vendorSlug: "sw",
    category: "Cider",
    categorySlug: "cider",
    titleLines: ["Cider"],
    lead: "OS 백업관리솔루션 “사이다”는 웹 기반의 UI를 통해 간편하게 OS백업/복구/복제/검증/조회/자동백업스케줄/헬스체크/ 이력관리 기능을 제공합니다.",
    groups: [],
  },
];
