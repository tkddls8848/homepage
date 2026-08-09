export default class SecurityTxt {
  data() {
    const expires = new Date();
    expires.setUTCFullYear(expires.getUTCFullYear() + 1);
    return {
      expires: expires.toISOString().replace(/\.\d{3}Z$/, "Z"),
      permalink: "/.well-known/security.txt",
      eleventyExcludeFromCollections: true,
      eleventyAllowMissingExtension: true,
    };
  }

  render({ expires, site }) {
    return [
      `Contact: mailto:${site.contact.email}`,
      `Expires: ${expires}`,
      "Preferred-Languages: ko, en",
      `Canonical: ${site.url}/.well-known/security.txt`,
      "",
    ].join("\n");
  }
}
