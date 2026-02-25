# Tahoe Seasons — Lake Tahoe rentals landing page

A lifestyle-oriented landing page themed around Tahoe’s four seasons, plus an early **map-based itinerary helper** prototype.

- Built with **Vite + React**
- Deploy target: **Vercel** (static + serverless)
- Sections: Spring / Summer / Fall / Winter, sample listings, CTA
- Prototype: `/itinerary` (MapLibre + POIs from markdown)

## Local dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Vercel

### SPA routing
This repo includes `vercel.json` rewrites so routes like `/itinerary` work when directly loaded.

### Serverless env vars
Set these in Vercel project settings:
- `OPENAI_API_KEY` (required for generation)
- `OPENAI_MODEL` (optional, default: `gpt-4.1-mini`)

> Note: never put the OpenAI key in the browser. The app calls OpenAI only through `/api/generate-itinerary`.

## Geocoding (Phase 4)
POIs live in `content/pois/*.md`.

- **Preferred:** include `lat`/`lng` in frontmatter.
- **Supported:** include `address` and omit `lat`/`lng`, then cache geocode results locally:

```bash
# writes to content/geocode-cache.json
GEOCODE=1 npm run geocode
```

Build-time POI export (`npm run build`) will use `content/geocode-cache.json` if present.
