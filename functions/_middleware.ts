export const onRequest: PagesFunction = async ({ next, request }) => {
  const response = await next();
  
  // Only apply headers to HTML responses (not assets)
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }
  
  const headers = new Headers(response.headers);
  
  // Content Security Policy - allows Google Analytics, AdSense, and gtag.js
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; img-src 'self' data: blob: https://pagead2.googlesyndication.com https://www.google-analytics.com https://stats.g.doubleclick.net https://www.gstatic.com https://www.googletagmanager.com; font-src 'self' data: https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://googletagmanager.com https://www.google-analytics.com https://google-analytics.com https://ssl.google-analytics.com https://tpc.googlesyndication.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; connect-src 'self' https://yoaybrhxjwugjauwzrua.supabase.co https://pagead2.googlesyndication.com https://www.google-analytics.com https://google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.googletagmanager.com https://googletagmanager.com; worker-src 'self' blob:; manifest-src 'self'; media-src 'self'; upgrade-insecure-requests"
  );
  
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  headers.set("X-Permitted-Cross-Domain-Policies", "none");
  headers.set("Origin-Agent-Cluster", "?1");
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
