# Emome WMF 2026 Character Quiz

This repository is the standalone Emome WMF 2026 microsite. It is separate from the production Emome application and is optimized for booth visitors who scan a QR code, complete a short personality quiz, and discover their Emome relationship character.

## Runtime used for validation

- Node.js: `v24.15.0`
- npm: use the version bundled with the active Node.js runtime

## Purpose

The microsite starts at `/` and guides visitors through four states:

1. Landing screen
2. 10-question OCEAN-inspired quiz
3. Short result reveal transition
4. Character result card with sharing, retry, and Emome discovery actions

The core quiz collects no personal data and requires no authentication, Supabase, Stripe, database, API request, cookies, or environment variables.

## Commands

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Type-check:

```bash
npm run type-check
```

Build:

```bash
npm run build
```

Open `http://localhost:3000` during development.

## Vercel deployment

Deploy this repository as a standard Next.js App Router project on Vercel.

- Framework preset: Next.js
- Build command: `npm run build`
- Install command: `npm install` or Vercel default
- Output directory: managed by Next.js/Vercel
- Environment variables: none required for the quiz route

If optional analytics or external services are added later, they must not block the quiz flow or introduce mandatory environment variables.

## Optional booth/kiosk mode

Append `?kiosk=1` to the URL to enable booth reset mode. When a result screen is idle for roughly 60 seconds, the microsite shows a subtle countdown and automatically returns to the landing screen. Regular visitors without `?kiosk=1` are unaffected.

## Important files

- `app/page.tsx` — complete landing, quiz, loading, result, sharing, retry, and optional kiosk-mode experience.
- `app/layout.tsx` — metadata, Open Graph, Twitter, icon, viewport, and theme-color configuration.
- `lib/ocean.ts` — 10 OCEAN questions and local `scoreOcean` scoring logic.
- `lib/characters.ts` — typed character descriptions, trait-to-character mapping, visual accents, character image paths, and the main Emome website URL.
- `public/` — approved Emome logo, icon, heart animation, and character artwork.

## Character descriptions and image mappings

Character copy and image mappings are centralized in `lib/characters.ts`. Update that file to change names, descriptions, superpowers, blind spots, quotes, visual accents, or artwork paths.

Current character artwork paths:

- Explorer: `/explorer.png`
- Architect: `/harmonizer.png` — approved internal artwork filename; the visitor-facing result remains Architect.
- Spark: `/spark.png`
- Anchor: `/anchor.png`
- Sentinel: `/sentinel.png`

## Main Emome website URL

The external Discover Emome CTA is controlled by `EMOME_WEBSITE_URL` in `lib/characters.ts`.

```ts
export const EMOME_WEBSITE_URL = "https://emome.xyz";
```

Change that single constant if the destination changes.
