# Emome WMF 2026 Microsite

## Project purpose

This repository is a standalone WMF 2026 event microsite. The root route (`/`) must remain a fast, mobile-first Emome character quiz that works without authentication, Supabase, Stripe, a database, API requests, cookies, or environment variables.

## Important files

- `app/page.tsx` — full visitor journey and UI states.
- `app/layout.tsx` — metadata, viewport, theme, and social preview configuration.
- `lib/ocean.ts` — quiz questions and scoring logic.
- `lib/characters.ts` — character copy, trait mappings, asset paths, and `EMOME_WEBSITE_URL`.
- `public/` — approved Emome brand and character assets.

## Development commands

- `npm install`
- `npm run dev`
- `npm run lint`
- `npm run type-check`
- `npm run build`

## Build validation requirements

Before declaring work complete, future agents must run and pass:

```bash
npm run lint
npm run type-check
npm run build
```

Fix broken imports, missing assets, TypeScript errors, ESLint errors, and production build failures before finishing.

## Product guardrails

Do not reintroduce mandatory authentication, database, Supabase, Stripe, account creation, API, cookie, or environment-variable dependencies into the quiz journey. The result must be calculated locally in the browser with `scoreOcean`.
