import assets from "./lib/assets.js";
import fonts from "./lib/fonts.js";
import images from "./lib/images.js";
import svg from "./lib/svg.js";
import { OUTPUT_DIR, PATH_PREFIX } from "./lib/paths.js";
import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // src/images/photo는 빌드 시 WebP로 변환해 /img/로 내보내므로 그대로 복사하지 않는다.
  // 로고(SVG), 아이콘, OG 이미지는 변환 대상이 아니라 원본을 그대로 쓴다.
  eleventyConfig.addPassthroughCopy({ "src/images/logo": "images/logo" });
  eleventyConfig.addPassthroughCopy({ "src/images/icon": "images/icon" });
  eleventyConfig.addPassthroughCopy({ "src/images/og": "images/og" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addWatchTarget("src/assets/");

  // 템플릿은 루트 기준 경로(/about/)로 쓰고, 빌드된 HTML의 href·src·srcset에
  // PATH_PREFIX를 붙인다. 이미지 변환 플러그인이 이보다 먼저 돌아 원본 경로를 찾는다.
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(images);
  eleventyConfig.addPlugin(assets);
  eleventyConfig.addPlugin(svg);
  eleventyConfig.addPlugin(fonts);

  eleventyConfig.addFilter("year", () => String(new Date().getFullYear()));
  eleventyConfig.addFilter("isCurrent", (pageUrl, target) =>
    typeof pageUrl === "string" &&
    (target === "/" ? pageUrl === "/" : pageUrl === target || pageUrl.startsWith(target))
  );
  eleventyConfig.addFilter("telHref", (value) =>
    `tel:${String(value).replace(/[^0-9+]/g, "")}`
  );
  eleventyConfig.addFilter("urlencode", (value) => encodeURIComponent(String(value)));
  // canonical·sitemap처럼 도메인까지 적는 URL은 base 플러그인이 건드리지 않으므로 직접 붙인다.
  eleventyConfig.addFilter("siteUrl", (path, base) =>
    new URL(PATH_PREFIX + String(path).replace(/^\/+/, ""), base).href
  );
  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString());
  eleventyConfig.addFilter("postDate", (date) =>
    new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Seoul",
    }).format(new Date(date))
  );
  eleventyConfig.addFilter("labelSplit", (value) => {
    const text = String(value);
    const index = text.indexOf(":");
    if (index === -1 || index > 24) return { label: null, text };
    return {
      label: text.slice(0, index).trim(),
      text: text.slice(index + 1).trim(),
    };
  });
  eleventyConfig.addFilter("split", (value, separator) =>
    String(value).split(separator)
  );
  eleventyConfig.addFilter("itemCount", (groups) =>
    groups.reduce((total, group) => total + group.items.length, 0)
  );

  eleventyConfig.addCollection("posts", (collection) =>
    collection
      .getFilteredByTag("posts")
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("sitemapPages", (collection) =>
    collection
      .getFilteredByGlob(["src/**/*.njk", "src/**/*.md"])
      .filter((item) => item.data.sitemap !== false && item.url)
      .sort((a, b) => a.url.localeCompare(b.url))
  );

  return {
    pathPrefix: PATH_PREFIX,
    dir: {
      input: "src",
      output: OUTPUT_DIR,
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "11ty.js"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
