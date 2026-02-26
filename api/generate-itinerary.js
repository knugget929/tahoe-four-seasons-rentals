/* eslint-env node */
/**
 * Vercel Serverless Function
 * POST /api/generate-itinerary
 *
 * Calls OpenAI Responses API (server-side) to generate an itinerary JSON referencing POIs by id.
 *
 * Env:
 * - OPENAI_API_KEY (required)
 * - OPENAI_MODEL (optional, default: gpt-4.1-mini)
 */

import fs from 'node:fs'
import path from 'node:path'

const DEFAULT_MODEL = 'gpt-4.1-mini'

// Best-effort in-memory caching & rate-limiting (per serverless instance).
const cache = new Map() // key -> { at, value }
const ipHits = new Map() // ip -> { windowStart, count }
const CACHE_TTL_MS = 1000 * 60 * 30
const RATE_WINDOW_MS = 1000 * 60
const RATE_MAX = 10

function now() {
  return Date.now()
}

function loadPois() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'pois.json')
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw)
}

function stableStringify(obj) {
  return JSON.stringify(obj, Object.keys(obj).sort())
}

function getIp(req) {
  const xf = req.headers?.['x-forwarded-for']
  if (typeof xf === 'string' && xf.length) return xf.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

function rateLimitOk(req) {
  const ip = getIp(req)
  const t = now()
  const hit = ipHits.get(ip)
  if (!hit || t - hit.windowStart > RATE_WINDOW_MS) {
    ipHits.set(ip, { windowStart: t, count: 1 })
    return { ok: true }
  }
  if (hit.count >= RATE_MAX) return { ok: false, ip }
  hit.count += 1
  return { ok: true }
}

function json(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

function badRequest(res, message, details) {
  return json(res, 400, { error: message, details })
}

function serverError(res, message, details) {
  return json(res, 500, { error: message, details })
}

function pickPoiForModel(p) {
  const desc = (p.description || '').replaceAll(/\s+/g, ' ').trim()
  return {
    id: p.id,
    name: p.name,
    lat: p.lat,
    lng: p.lng,
    tags: p.tags || [],
    // Keep it short to control tokens.
    description: desc.length > 200 ? `${desc.slice(0, 197)}…` : desc,
  }
}

function itinerarySchema() {
  // JSON Schema for strict model output.
  return {
    name: 'itinerary',
    schema: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'days'],
      properties: {
        title: { type: 'string' },
        days: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['label', 'stops'],
            properties: {
              // label instead of date to keep v1 flexible
              label: { type: 'string', description: 'e.g., Day 1 (Friday)' },
              stops: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['poi_id', 'time_block', 'duration_min', 'label', 'why'],
                  properties: {
                    poi_id: { type: 'string' },
                    time_block: {
                      type: 'string',
                      enum: ['morning', 'midday', 'afternoon', 'evening'],
                    },
                    duration_min: { type: 'integer', minimum: 30, maximum: 480 },
                    label: { type: 'string', description: 'Short stop name for the itinerary panel' },
                    why: { type: 'string' },
                    tips: { type: 'array', items: { type: 'string' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    strict: true,
  }
}

function validateItineraryShape(itinerary, poiIdsSet) {
  if (!itinerary || typeof itinerary !== 'object') return 'Not an object'
  if (!Array.isArray(itinerary.days) || itinerary.days.length === 0) return 'days missing'

  for (const day of itinerary.days) {
    if (!day || typeof day !== 'object') return 'day is not object'
    if (typeof day.label !== 'string') return 'day.label missing'
    if (!Array.isArray(day.stops) || day.stops.length === 0) return 'day.stops missing'
    for (const stop of day.stops) {
      if (!poiIdsSet.has(stop.poi_id)) return `unknown poi_id: ${stop.poi_id}`
    }
  }

  return null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }

  const rl = rateLimitOk(req)
  if (!rl.ok) return json(res, 429, { error: 'Rate limit exceeded' })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return serverError(res, 'Missing OPENAI_API_KEY')

  let body = req.body
  // Vercel usually parses JSON body, but keep a fallback.
  if (!body || typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}')
    } catch {
      return badRequest(res, 'Invalid JSON body')
    }
  }

  const {
    pace = 'balanced',
    interests = [],
    start_area = 'Tahoe (flexible)',
    days = 1,
    max_stops_per_day = 4,
    exclude_poi_ids = [],
  } = body || {}

  if (!Number.isInteger(days) || days < 1 || days > 7) {
    return badRequest(res, '`days` must be an integer 1–7')
  }
  if (!Number.isInteger(max_stops_per_day) || max_stops_per_day < 2 || max_stops_per_day > 8) {
    return badRequest(res, '`max_stops_per_day` must be an integer 2–8')
  }

  let rawPois
  try {
    rawPois = loadPois()
  } catch (e) {
    return serverError(res, 'Failed to load POIs', { message: e?.message })
  }

  const excludeSet = new Set(Array.isArray(exclude_poi_ids) ? exclude_poi_ids : [])
  const poiForModel = (rawPois || []).filter((p) => !excludeSet.has(p.id)).map(pickPoiForModel)
  if (!poiForModel.length) {
    return serverError(res, 'No POIs available after exclusions', { exclude_poi_ids })
  }

  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL

  const system =
    'You are a trip-planning assistant. You must only reference the provided POIs by id. Do not invent POIs. Output must match the JSON schema exactly.'

  const user = {
    request: {
      days,
      max_stops_per_day,
      pace,
      interests,
      start_area,
      exclude_poi_ids: Array.from(excludeSet),
    },
    pois: poiForModel,
  }

  const cacheKey = stableStringify({ model, user })
  const cached = cache.get(cacheKey)
  if (cached && now() - cached.at < CACHE_TTL_MS) {
    return json(res, 200, { itinerary: cached.value, cached: true })
  }

  try {
    const resp = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: [
          { role: 'system', content: system },
          { role: 'user', content: [{ type: 'input_text', text: JSON.stringify(user) }] },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: itinerarySchema(),
        },
        temperature: 0.7,
      }),
    })

    if (!resp.ok) {
      const errText = await resp.text()
      return serverError(res, 'OpenAI error', { status: resp.status, body: errText })
    }

    const data = await resp.json()
    const text = data?.output_text
    if (!text || typeof text !== 'string') {
      return serverError(res, 'Unexpected OpenAI response shape', { data })
    }

    let itinerary
    try {
      itinerary = JSON.parse(text)
    } catch {
      return serverError(res, 'Model did not return valid JSON', { text })
    }

    const poiIdsSet = new Set(poiForModel.map((p) => p.id))
    const shapeError = validateItineraryShape(itinerary, poiIdsSet)
    if (shapeError) return serverError(res, 'Invalid itinerary output', { shapeError, itinerary })

    cache.set(cacheKey, { at: now(), value: itinerary })
    return json(res, 200, { itinerary, cached: false })
  } catch (e) {
    return serverError(res, 'Server error', { message: e?.message })
  }
}
