export default {
  async fetch(request, env, ctx) {
    // Let Cloudflare serve real static assets first.
    let response = await env.ASSETS.fetch(request);

    // This is a single-page React application. Dedicated URLs such as
    // /about and /leaderboard do not have physical HTML files, so fall back
    // to index.html when the asset lookup returns a 404 for an HTML request.
    if (response.status === 404) {
      const accept = request.headers.get("accept") || "";
      if (accept.includes("text/html")) {
        const url = new URL(request.url);
        url.pathname = "/index.html";
        response = await env.ASSETS.fetch(new Request(url, request));
      }
    }

    // For HTML pages, add our security headers.
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      const headers = new Headers(response.headers);

      // Keep one authoritative HTTP CSP for the Worker deployment.
      // It permits the Google Analytics tag, AdSense, and Cloudflare Web Analytics
      // resources observed on the production site without removing the rest of the policy.
      headers.set(
        "Content-Security-Policy",
        "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; img-src 'self' data: blob: https://pagead2.googlesyndication.com https://www.google-analytics.com https://stats.g.doubleclick.net https://www.gstatic.com https://www.googletagmanager.com; font-src 'self' data: https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://googletagmanager.com https://www.google-analytics.com https://google-analytics.com https://ssl.google-analytics.com https://tpc.googlesyndication.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; connect-src 'self' https://yoaybrhxjwugjauwzrua.supabase.co https://pagead2.googlesyndication.com https://www.google-analytics.com https://google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.googletagmanager.com https://googletagmanager.com https://ep1.adtrafficquality.google https://cloudflareinsights.com; frame-src 'self' https://googleleads.g.doubleclick.net https://googleads.g.doubleclick.net https://tpc.googlesyndication.com; worker-src 'self' blob:; manifest-src 'self'; media-src 'self'; upgrade-insecure-requests"
      );

      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      headers.set("X-Frame-Options", "SAMEORIGIN");
      headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
      headers.set("Cross-Origin-Resource-Policy", "same-origin");
      headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
      headers.set("X-Permitted-Cross-Domain-Policies", "none");
      headers.set("Origin-Agent-Cluster", "?1");

      response = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  }
};
