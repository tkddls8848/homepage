/**
 * Eleventy 설정
 *
 * 기존 사이트는 페이지마다 header / nav / footer / 제품 마크업을 그대로 복사해
 * 두는 구조였습니다. 이 설정은 그 반복을 레이아웃(_includes)과
 * 데이터(_data)로 옮겨서, 콘텐츠 한 곳만 고치면 전체 페이지에 반영되게 합니다.
 */
export default function (eleventyConfig) {
  // ── 정적 파일 ──────────────────────────────────────────────────────────
  // images/ 는 기존 사이트의 사진 에셋을 경로 그대로 유지합니다.
  // (예: /images/photo/product/ibm/UnixServer/power11_e1180.png)
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addWatchTarget("src/assets/");

  // ── 필터 ───────────────────────────────────────────────────────────────
  eleventyConfig.addFilter("year", () => String(new Date().getFullYear()));

  /** 현재 URL이 주어진 경로에 속하는지 (하위 경로 포함) */
  eleventyConfig.addFilter("isCurrent", (pageUrl, target) => {
    if (!pageUrl || !target) return false;
    if (target === "/") return pageUrl === "/";
    return pageUrl === target || pageUrl.startsWith(target);
  });

  /** 전화번호 → tel: 링크용 (하이픈 제거) */
  eleventyConfig.addFilter("telHref", (v) => "tel:" + String(v).replace(/[^0-9+]/g, ""));

  /** 지도 검색 링크용 인코딩 */
  eleventyConfig.addFilter("urlencode", (v) => encodeURIComponent(String(v)));

  /**
   * 절대 URL (OG 태그, sitemap 등)
   * 항상 https 로 맞춥니다. 기존 사이트가 http 로 열리던 문제 때문에
   * canonical/OG/sitemap 에 http 주소가 섞이면 검색엔진이 http 판을 계속
   * 색인하게 되므로, 여기서 한 번 더 막아 둡니다.
   */
  eleventyConfig.addFilter("absoluteUrl", (path, base) => {
    try {
      const absolute = new URL(path, base);
      if (absolute.protocol === "http:" && absolute.hostname !== "localhost") {
        absolute.protocol = "https:";
      }
      return absolute.href;
    } catch {
      return path;
    }
  });

  /**
   * canonical / OG 용 절대 URL.
   * pathPrefix(예: /homepage/) 까지 반영해야 하므로 url 필터를 먼저 통과시킵니다.
   */
  eleventyConfig.addFilter("absoluteSiteUrl", function (path, base) {
    const withPrefix = eleventyConfig.getFilter("url").call(this, path);
    return eleventyConfig.getFilter("absoluteUrl").call(this, withPrefix, base);
  });

  /** ISO 날짜 (sitemap) */
  eleventyConfig.addFilter("isoDate", (d) => new Date(d || Date.now()).toISOString());

  /**
   * "비즈니스 연속성: 미션 크리티컬 …" 처럼 콜론으로 앞머리 라벨이 붙은 문장을
   * { label, text } 로 나눕니다. 라벨만 굵게 보여주기 위한 용도.
   */
  eleventyConfig.addFilter("labelSplit", (value) => {
    const str = String(value);
    const i = str.indexOf(":");
    if (i === -1 || i > 24) return { label: null, text: str };
    return { label: str.slice(0, i).trim(), text: str.slice(i + 1).trim() };
  });

  /** 문자열 분리 (Nunjucks 기본 필터에 없음) */
  eleventyConfig.addFilter("split", (value, sep) => String(value).split(sep));

  /** 카탈로그 그룹 배열에 들어 있는 제품 개수 합계 */
  eleventyConfig.addFilter("itemCount", (groups) =>
    (groups || []).reduce((total, group) => total + (group.items || []).length, 0)
  );

  // ── 컬렉션 ─────────────────────────────────────────────────────────────
  // sitemap 에서 제외할 페이지는 front matter 에 `sitemap: false`
  eleventyConfig.addCollection("sitemapPages", (collection) =>
    collection
      .getFilteredByGlob(["src/**/*.njk", "src/**/*.md"])
      .filter((item) => item.data.sitemap !== false && item.url && !item.url.includes("404"))
      .sort((a, b) => a.url.localeCompare(b.url))
  );

  return {
    /**
     * 하위 경로 배포 지원.
     * GitHub Pages 의 프로젝트 사이트는 https://<계정>.github.io/<저장소>/ 처럼
     * 저장소 이름이 경로에 붙습니다. 이때 `/assets/css/main.css` 같은 루트 기준
     * 경로는 모두 404 가 되고(그래서 CSS·이미지가 전부 사라져 보입니다),
     * pathPrefix 를 주면 `url` 필터가 앞에 경로를 붙여 줍니다.
     *
     *   PATH_PREFIX=/homepage/ npm run build
     *
     * 커스텀 도메인(www.trialinfo.com) 처럼 루트에 배포할 때는 설정하지 않습니다.
     */
    pathPrefix: process.env.PATH_PREFIX || "/",

    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "11ty.js"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
}
