export default {
  layout: "layouts/post.njk",
  tags: "posts",
  eleventyComputed: {
    permalink: (data) => (data.draft ? false : `/blog/${data.page.fileSlug}/`),
  },
};
