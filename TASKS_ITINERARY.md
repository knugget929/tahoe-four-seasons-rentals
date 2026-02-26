# Tasks — Itinerary Helper (Vercel + Markdown POIs)

Owner: Viet/Knugget
Status: Planning → Ready

## P0 — Repo/Deploy switch to Vercel
- [ ] Create Vercel project for this repo
- [ ] Configure build settings
  - Build command: `npm run build`
  - Output: `dist`
- [ ] Set env vars (serverless only)
  - `OPENAI_API_KEY`
  - (optional) `OPENAI_MODEL` default
- [ ] Update repo docs: remove/replace GH Pages workflow expectations
- [ ] (Later) remove `.github/workflows/deploy.yml` once Vercel is live

**Acceptance:** Vercel preview deploys build successfully from `main`.

## P1 — Markdown POI dataset + build-time export
- [ ] Add folder: `content/pois/` (markdown files)
- [ ] Define frontmatter schema (see `ITINERARY_EPIC.md`)
- [ ] Add script: `scripts/build-pois.mjs`
  - Reads `content/pois/*.md`
  - Extracts frontmatter + excerpt/description
  - Writes `src/data/pois.json`
- [ ] Add validation (hard fail if missing required fields)
- [ ] Wire into `npm run build` (prebuild step)
- [ ] Seed with 8–15 POIs (mix: beaches, viewpoints, coffee, kid-friendly, hikes)

**Acceptance:** `npm run build` generates `src/data/pois.json` and app can import it.

## P2 — Map UI (no AI yet)
- [ ] Add route/page: `src/pages/Itinerary.jsx` (or a simple conditional route if no router yet)
- [ ] Add MapLibre + CSS
- [ ] Render POI pins from `src/data/pois.json`
- [ ] Hover card
  - Name
  - Tags
  - Short description
- [ ] Click pin selects POI
  - Highlights POI in side list
  - Keeps card open

**Acceptance:** Map loads, zoom/pan works, hover shows card, click selects.

## P3 — Generate itinerary (OpenAI via Vercel function)
- [ ] Add endpoint: `api/generate-itinerary.ts`
  - Input: user preferences + optional POI ids
  - Calls OpenAI Responses API
  - Enforces JSON schema output
- [ ] Prompt design
  - Use POIs as grounding context
  - Require `poi_id` references only
- [ ] Frontend modal/controls
  - Dates
  - Pace
  - Interests/tags
  - Starting area
- [ ] Render itinerary
  - Pins ordered
  - Timeline grouped by day
  - Hover card includes time + label

**Acceptance:** Generate produces deterministic JSON and renders on map + panel.

## P4 — Next: Geocoding (explicitly NOT in v1)
- [ ] Add optional `address` field support
- [ ] Add build-time geocoder to fill missing `lat/lng`
  - Provider TBD (Mapbox/Google/Nominatim)
  - Cache results to `content/geocode-cache.json`
- [ ] Add lint rule: no missing `lat/lng` on `main` (after migration)

---

## Notes
- Do not call OpenAI directly from the browser.
- Serverless function must be the only place with `OPENAI_API_KEY`.
