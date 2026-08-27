# TYPEITTESTIT security notes

This project is a client-side typing application. The security hardening here is designed to preserve its existing interface and functionality while reducing common web-application risks.

## Included hardening

- Production security headers for hosts supporting `vercel.json` or `_headers`.
- Content Security Policy compatible with the existing single-file Vite build.
- Clickjacking protection through `frame-ancestors` and `X-Frame-Options`.
- MIME-sniffing, referrer, transport-security, and browser-permission restrictions.
- A React error boundary so an unexpected runtime exception does not leave the whole page unusable.
- Validation of local-storage data before it is trusted.
- Validation of allowed difficulty/duration values before persistence.
- A bounded custom/free-typing input size to reduce accidental memory abuse.

## Important deployment requirement

Security headers are enforced by the production web server/hosting platform, not by React alone. Keep HTTPS enabled in production and use the included hosting configuration for the platform you deploy to. Never place API keys, database credentials, service-role tokens, or other secrets in `src/` or client-side environment variables.

The included CSP still allows inline scripts/styles because the current application uses Vite's single-file build. A stricter nonce/hash-based CSP can be adopted later if the build is changed to external assets.
