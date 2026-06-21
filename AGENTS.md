# Emome WMF 2026 Microsite

## Project purpose

This repository is a standalone WMF 2026 event microsite. The root route (`/`) must remain a fast, mobile-first Emome character quiz that works without authentication, Supabase, Stripe, a database, API requests, cookies, or environment variables.

## Important files

- `app/page.tsx` — full visitor journey and UI states.
- `lib/ocean.ts` — quiz questions and scoring logic.
- `lib/characters.ts` — character copy, trait mappings, asset paths, and `EMOME_WEBSITE_URL`.
- `public/` — approved Emome brand and character assets.

## Development commands

- `npm install`
- `npm run dev`
- `npm run type-check`
- `npm run build`

## Build validation requirements

Before finishing changes, run `npm run build` and the functional lint/type-check command if available. Fix broken imports, missing assets, and TypeScript errors.

## Product guardrails

Do not reintroduce mandatory authentication, database, Supabase, Stripe, account creation, API, cookie, or environment-variable dependencies into the quiz journey. The result must be calculated locally in the browser with `scoreOcean`.
