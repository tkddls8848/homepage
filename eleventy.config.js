export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addWatchTarget("src/assets/");

  eleventyConfig.addFilter("year", () => String(new Date().getFullYear()));
  eleventyConfig.addFilter("isCurrent", (pageUrl, target) =>
    typeof pageUrl === "string" &&
    (target === "/" ? pageUrl === "/" : pageUrl === target || pageUrl.startsWith(target))
  );
  eleventyConfig.addFilter("telHref", (value) =>
    `tel:${String(value).replace(/[^0-9+]/g, "")}`
  );
  eleventyConfig.addFilter("urlencode", (value) => encodeURIComponent(String(value)));
  eleventyConfig.addFilter("siteUrl", (path, base) => new URL(path, base).href);
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
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "11ty.js"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
