export default class HeadersFile {
  data() {
    return {
      permalink: "/_headers",
      eleventyExcludeFromCollections: true,
      eleventyAllowMissingExtension: true,
    };
  }

  render({ site }) {
    const formOrigin = site.formEndpointOrigin ? ` ${site.formEndpointOrigin}` : "";
    const kakao = "https://*.daumcdn.net https://*.kakaocdn.net";
    const csp = [
      "default-src 'self'",
      "base-uri 'none'",
      "object-src 'none'",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      `script-src 'self' ${kakao}`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com ${kakao}`,
      "font-src 'self' https://fonts.gstatic.com",
      `img-src 'self' data: blob: ${kakao}`,
      `connect-src 'self'${formOrigin} ${kakao}`,
      `form-action 'self'${formOrigin}`,
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      "/*",
      `  Content-Security-Policy: ${csp}`,
      "  Strict-Transport-Security: max-age=31536000",
      "  X-Content-Type-Options: nosniff",
      "  Referrer-Policy: strict-origin-when-cross-origin",
      "  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()",
      "",
      "https://:project.pages.dev/*",
      "  X-Robots-Tag: noindex",
      "",
    ].join("\n");
  }
}
