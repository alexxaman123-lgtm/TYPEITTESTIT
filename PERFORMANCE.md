# TYPEITTESTIT performance notes

The production build intentionally keeps JavaScript/CSS/image assets separate instead of inlining the whole site into one HTML file. This lets browsers cache hashed assets independently and avoids re-downloading the entire application when the HTML changes.

Static assets are configured for long-lived immutable caching. Below-the-fold sections use CSS content visibility so the initial typing-test area can paint before the rest of the page is rendered. The typing experience itself stays client-side and the visual design remains unchanged.

For production, serve compressed Brotli or gzip responses, HTTP/2 or HTTP/3 where available, and keep the security/cache headers from `public/_headers`, `_headers`, `vercel.json`, or `security-headers.conf` as appropriate for the host.
