#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const ROOT = path.resolve(process.cwd())
const CONTENT_DIR = path.join(ROOT, 'content', 'pois')
const OUT_PATH = path.join(ROOT, 'src', 'data', 'pois.json')

function fail(msg) {
  console.error(`\n[build-pois] ${msg}\n`)
  process.exit(1)
}

function isNumber(n) {
  return typeof n === 'number' && Number.isFinite(n)
}

function validatePoi(poi, file) {
  const missing = []
  if (!poi.id || typeof poi.id !== 'string') missing.push('id')
  if (!poi.name || typeof poi.name !== 'string') missing.push('name')
  if (!isNumber(poi.lat)) missing.push('lat')
  if (!isNumber(poi.lng)) missing.push('lng')

  if (missing.length) {
    fail(`POI frontmatter missing/invalid fields: ${missing.join(', ')}\nFile: ${file}`)
  }
}

function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    // Don’t hard fail if no content yet—create an empty dataset so dev server still runs.
    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
    fs.writeFileSync(OUT_PATH, JSON.stringify([], null, 2))
    console.log(`[build-pois] No content dir yet. Wrote empty dataset to ${path.relative(ROOT, OUT_PATH)}`)
    return
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => path.join(CONTENT_DIR, f))

  const pois = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8')
    const parsed = matter(raw)
    const fm = parsed.data || {}

    const poi = {
      id: fm.id,
      name: fm.name,
      lat: fm.lat,
      lng: fm.lng,
      address: fm.address,
      tags: fm.tags || [],
      suggested_duration_min: fm.suggested_duration_min,
      best_seasons: fm.best_seasons || [],
      price_level: fm.price_level,
      kid_friendly: fm.kid_friendly,
      description: (parsed.content || '').trim(),
      source_file: path.basename(filePath),
    }

    validatePoi(poi, filePath)

    return poi
  })

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
  fs.writeFileSync(OUT_PATH, JSON.stringify(pois, null, 2))

  console.log(`[build-pois] Wrote ${pois.length} POIs to ${path.relative(ROOT, OUT_PATH)}`)
}

main()
