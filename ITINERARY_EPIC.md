# Itinerary Helper — EPIC (Vercel + MD POIs)

## Decisions locked
- Hosting: **Vercel** (static + Serverless Functions)
- Data source: **Markdown with frontmatter** including `lat`/`lng` now
- Future: add optional **geocoding pipeline** later (not in v1)

## Goal
Click **Generate itinerary** → use our markdown POI dataset + OpenAI → return a structured itinerary → render on an interactive map with pins + hover cards + a side timeline.

## Non-goals (v1)
- No booking flow
- No user accounts
- No payments
- No real-time availability

## UX requirements (v1)
- Map: zoom/pan
- Pins: ordered stops, visually grouped by day
- Hover on pin: high-level card (name, time block, 1-liner, tags)
- Click pin: keep card open + highlight corresponding timeline item
- Side panel: day timeline list (Morning/Afternoon/Evening blocks or time-ordered)

## Data model
### POI markdown frontmatter (source of truth)
Required in v1:
- `id` (string)
- `name` (string)
- `lat` (number)
- `lng` (number)
Optional:
- `address` (string)
- `tags` (string[])
- `suggested_duration_min` (number)
- `best_seasons` (string[])
- `price_level` (1–4)
- `kid_friendly` (boolean)

Example:
```md
---
id: sand-harbor
name: Sand Harbor
lat: 39.1971
lng: -119.9256
address: "2005 NV-28, Incline Village, NV"
tags: [beach, scenic, kid-friendly]
suggested_duration_min: 120
best_seasons: [spring, summer]
---
Short description...
```

### Itinerary JSON (LLM output)
LLM returns JSON only, referencing POIs by `poi_id`:
```json
{
  "title": "Two days in Tahoe",
  "days": [
    {
      "date": "2026-03-02",
      "stops": [
        {
          "poi_id": "sand-harbor",
          "start_time": "09:30",
          "duration_min": 120,
          "label": "Morning beach time",
          "why": "Iconic views + calm water",
          "tips": ["Arrive early for parking"]
        }
      ]
    }
  ]
}
```

## Architecture (Vercel)
- Frontend: Vite + React
- Map: **MapLibre GL** (preferred) + a tiles provider (TBD)
- Serverless: Vercel function `api/generate-itinerary.ts`
  - Receives user prefs + POI dataset (or POI ids)
  - Calls OpenAI (key stored in Vercel env)
  - Returns strict itinerary JSON

## Phases
### Phase 1 — POI pipeline (MD → JSON)
- Parse markdown folder into `src/data/pois.json`
- Validate schema; fail build on missing `id/name/lat/lng`

### Phase 2 — Map + UI scaffolding (no AI)
- `/itinerary` page
- Render pins from POI dataset
- Hover cards + click selection linking to side panel

### Phase 3 — Generate itinerary (OpenAI)
- Vercel serverless function + prompt/schema
- Frontend modal inputs + loading/error
- Render returned itinerary (pins ordered + panel)

### Phase 4 — Geocoding (later)
- Add optional `address` and build-time geocode step to fill `lat/lng` when missing
- Cache geocode results in repo (never runtime)

## Open questions (track)
- Tiles provider choice + token handling
- Styling of multi-day pins (color per day vs per time block)
- Do we support driving-time estimation (routing) in v1 or v2?
