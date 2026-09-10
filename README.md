# TYPEITTESTIT

A fast, multilingual typing practice and testing website built with Astro, React, TypeScript, and Tailwind CSS.

**Live site:** https://typeittestit.com

## Features

- Interactive typing tests and practice flows
- Multiple difficulty and duration options
- Multilingual routes and localized content
- Optional Supabase-backed leaderboard
- Responsive UI with locally packaged fonts
- Cloudflare Workers deployment configuration
- Automated dependency, type, build, and security checks

## Tech stack

- [Astro](https://astro.build/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/)

## Requirements

- Node.js 22 (see `.node-version` and `.nvmrc`)
- npm

## Local development

```bash
git clone https://github.com/alexxaman123-lgtm/TYPEITTESTIT.git
cd TYPEITTESTIT
npm install
npm run dev
```

Astro will print the local development URL in the terminal.

Windows users can also follow [`RUN-WINDOWS.md`](RUN-WINDOWS.md) or run `START-TYPEITTESTIT.bat`.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Astro development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run TypeScript checks without emitting files |
| `npm run security` | Audit dependencies for high-severity vulnerabilities |
| `npm run security:static` | Run the repository's static security checks |

## Leaderboard setup

The repository includes SQL files for setting up and securing the Supabase leaderboard:

- [`LEADERBOARD_SETUP.sql`](LEADERBOARD_SETUP.sql)
- [`SUPABASE_LEADERBOARD_SECURITY.sql`](SUPABASE_LEADERBOARD_SECURITY.sql)

Apply and review these scripts in your Supabase project before enabling leaderboard functionality. Never commit service-role keys, database credentials, or other secrets. See [`SECURITY.md`](SECURITY.md) for the project's security guidance.

## Deployment

The project is configured for Cloudflare Workers:

```bash
npm run build
npx wrangler deploy
```

`wrangler.jsonc` serves the generated `dist/` directory through `_worker.js`. Keep HTTPS enabled and preserve the included production security-header configuration when deploying elsewhere.

## Project structure

```text
src/components/   React UI components
src/data/         Application and localized data
src/layouts/      Astro layouts
src/lib/          Shared application modules
src/pages/        Astro routes and localized pages
src/utils/        Utility functions
public/           Static assets
supabase/         Supabase project resources
scripts/          Maintenance and security scripts
```

## Security

Security checks run on pushes, pull requests, and a weekly schedule. Before opening or merging changes, run:

```bash
npm run security
npm run typecheck
npm run security:static
npm run build
```

Please review [`SECURITY.md`](SECURITY.md) before reporting a vulnerability or changing deployment headers.
