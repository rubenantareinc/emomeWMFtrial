# Emome WMF 2026 Character Quiz

This repository is a standalone, event-specific Emome microsite for WMF 2026. It is separate from the production Emome application and is designed for visitors who scan a booth QR code, complete a short personality quiz, and discover their Emome relationship character.

## Purpose

The microsite starts at `/` and guides visitors through four states:

1. Landing screen
2. 10-question OCEAN-inspired quiz
3. Short result reveal transition
4. Character result card with sharing, retry, and Emome discovery actions

The core quiz collects no personal data and requires no authentication, Supabase, Stripe, database, API request, cookies, or environment variables.

## Local setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

Optional TypeScript validation:

```bash
npm run type-check
```

## Deployment

Deploy this repository as a standard Next.js App Router project on Vercel or another compatible host. No environment variables are required for the quiz route. If analytics or other optional services are added later, they must not block the quiz flow.

## Important files

- `app/page.tsx` — complete landing, quiz, loading, result, sharing, retry, and Discover Emome experience.
- `lib/ocean.ts` — 10 OCEAN questions and local `scoreOcean` scoring logic.
- `lib/characters.ts` — typed character descriptions, trait-to-character mapping, visual accents, character image paths, and the main Emome website URL.
- `public/` — approved Emome logo, character art, and supporting brand assets.

## Character descriptions and image mappings

Character copy and image mappings are centralized in `lib/characters.ts`. Update that file to change names, descriptions, superpowers, blind spots, quotes, visual accents, or artwork paths.

Current character artwork paths:

- Explorer: `/explorer.png`
- Architect: `/harmonizer.png`
- Spark: `/spark.png`
- Anchor: `/anchor.png`
- Sentinel: `/sentinel.png`

## Main Emome website URL

The external Discover Emome CTA is controlled by `EMOME_WEBSITE_URL` in `lib/characters.ts`.

```ts
export const EMOME_WEBSITE_URL = "https://emome.xyz";
```

Change that single constant if the destination changes.
