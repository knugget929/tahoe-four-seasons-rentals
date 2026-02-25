#!/usr/bin/env node
/* eslint-env node */

/**
 * Build-time geocoding helper (Phase 4).
 *
 * Goal: allow POI markdown files to specify `address` and omit `lat/lng`, then fill them in by
 * caching geocode results to `content/geocode-cache.json`.
 *
 * Defaults:
 * - NO network calls unless `GEOCODE=1` is set.
 * - Uses Nominatim (OpenStreetMap) as a zero-key dev path.
 *
 * Usage:
 *   GEOCODE=1 node scripts/geocode-pois.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const ROOT = path.resolve(process.cwd())
const POI_DIR = path.join(ROOT, 'content', 'pois')
const CACHE_PATH = path.join(ROOT, 'content', 'geocode-cache.json')

function fail(msg) {
  console.error(`\n[geocode-pois] ${msg}\n`)
  process.exit(1)
}

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {}
  return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8') || '{}')
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n')
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function geocodeNominatim(query) {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')

  const resp = await fetch(url.toString(), {
    headers: {
      // polite UA
      'User-Agent': 'tahoe-four-seasons-rentals/0.1 (build-time geocoder)',
    },
  })

  if (!resp.ok) {
    throw new Error(`Nominatim error ${resp.status}`)
  }

  const data = await resp.json()
  const hit = data?.[0]
  if (!hit) return null

  return {
    lat: Number(hit.lat),
    lng: Number(hit.lon),
    display_name: hit.display_name,
  }
}

async function main() {
  if (!fs.existsSync(POI_DIR)) fail('Missing content/pois directory')

  const allowNetwork = process.env.GEOCODE === '1'
  const cache = loadCache()

  const files = fs
    .readdirSync(POI_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => path.join(POI_DIR, f))

  let updated = 0

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf8')
    const parsed = matter(raw)
    const fm = parsed.data || {}

    const hasLatLng = typeof fm.lat === 'number' && Number.isFinite(fm.lat) && typeof fm.lng === 'number' && Number.isFinite(fm.lng)
    const address = fm.address

    if (hasLatLng || !address) continue

    const key = String(address).trim()
    if (!key) continue

    if (cache[key]?.lat && cache[key]?.lng) {
      // Already cached
      continue
    }

    if (!allowNetwork) {
      console.log(`[geocode-pois] missing lat/lng for ${path.basename(filePath)}; run with GEOCODE=1 to fetch: ${key}`)
      continue
    }

    console.log(`[geocode-pois] geocoding: ${key}`)
    const hit = await geocodeNominatim(key)
    if (!hit) {
      console.log(`[geocode-pois] no result for: ${key}`)
      continue
    }

    cache[key] = hit
    updated += 1

    // be polite
    await sleep(1100)
  }

  if (updated) {
    saveCache(cache)
    console.log(`[geocode-pois] updated cache with ${updated} entries → ${path.relative(ROOT, CACHE_PATH)}`)
  } else {
    console.log('[geocode-pois] no cache updates')
  }
}

main().catch((e) => {
  fail(e?.message || 'unknown error')
})
