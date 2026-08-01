/**
 * src/blog/posts/ 안 모든 글에 공통으로 적용되는 값.
 * (JSON 이 아니라 JS 인 이유는 permalink 에 진짜 boolean false 를 넣어야
 *  하기 때문입니다. JSON + Nunjucks 로는 문자열 "false" 가 되어 Eleventy 가
 *  "false" 라는 이름의 파일을 만들려고 합니다.)
 */
export default {
  layout: "layouts/post.njk",

  // 이 태그로 collections.posts 가 만들어집니다 (eleventy.config.js).
  // 글 본문에서 분류를 붙일 때는 tags 가 아니라 topics 를 쓰세요 — tags 를
  // 덮어쓰면 그 글이 컬렉션에서 빠져 목록에 나오지 않습니다.
  tags: "posts",

  eleventyComputed: {
    /*
     * draft: true 인 글은 아예 페이지를 만들지 않습니다.
     * 목록에서만 빼면 주소를 아는 사람에게는 열리므로, 검토를 마치지 않은
     * 글이 공개된 것과 같습니다. AI 초안을 저장소에 두고 검토하는 동안
     * 사이트에는 나오지 않게 하는 것이 이 설정의 목적입니다.
     */
    permalink: (data) => (data.draft ? false : `/blog/${data.page.fileSlug}/`),
  },
};
