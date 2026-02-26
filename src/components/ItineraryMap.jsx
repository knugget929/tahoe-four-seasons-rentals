import { useEffect, useMemo, useRef } from 'react'

import pois from '../data/pois.json'

const DEFAULT_CENTER = [-119.9772, 39.0968] // Tahoe (approx)

export default function ItineraryMap({ selectedId, onSelect, itinerary }) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const maplibreRef = useRef(null)
  const markersRef = useRef([])

  const poiById = useMemo(() => {
    return new Map((pois || []).map((p) => [p.id, p]))
  }, [])

  const stopMetaByPoiId = useMemo(() => {
    const map = new Map()
    if (!itinerary?.days?.length) return map

    itinerary.days.forEach((day, dayIndex) => {
      ;(day.stops || []).forEach((stop, stopIndex) => {
        if (!map.has(stop.poi_id)) {
          map.set(stop.poi_id, {
            dayIndex,
            stopIndex,
            time_block: stop.time_block,
            label: stop.label,
            why: stop.why,
          })
        }
      })
    })

    return map
  }, [itinerary])

  const displayPois = useMemo(() => {
    const stopIds = itinerary?.days?.flatMap((d) => d.stops?.map((s) => s.poi_id) || []) || []
    if (!stopIds.length) return pois || []
    const unique = [...new Set(stopIds)]
    return unique.map((id) => poiById.get(id)).filter(Boolean)
  }, [itinerary, poiById])

  const poiFeatures = useMemo(() => {
    return (displayPois || []).map((p) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: {
        id: p.id,
        name: p.name,
        tags: (p.tags || []).join(' · '),
        description: p.description || '',
      },
    }))
  }, [displayPois])

  // Init map once.
  useEffect(() => {
    let cancelled = false

    async function init() {
      if (!mapContainerRef.current || mapRef.current) return

      const maplibregl = (await import('maplibre-gl')).default
      await import('maplibre-gl/dist/maplibre-gl.css')
      maplibreRef.current = maplibregl

      if (cancelled) return

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center: DEFAULT_CENTER,
        zoom: 9,
      })

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right')

      map.on('load', () => {
        // Route layer placeholders
        if (!map.getSource('itinerary-routes')) {
          map.addSource('itinerary-routes', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          })

          map.addLayer({
            id: 'itinerary-routes-line',
            type: 'line',
            source: 'itinerary-routes',
            paint: {
              'line-color': ['get', 'color'],
              'line-width': 3,
              'line-opacity': 0.85,
            },
          })
        }
      })

      mapRef.current = map
    }

    init()

    return () => {
      cancelled = true
      markersRef.current.forEach((m) => m.remove())
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  // Update markers + routes when POIs/itinerary change.
  useEffect(() => {
    const map = mapRef.current
    const maplibregl = maplibreRef.current
    if (!map || !maplibregl) return

    // remove existing markers
    markersRef.current.forEach((m) => m.remove())

    // markers
    markersRef.current = poiFeatures.map((f) => {
      const el = document.createElement('button')
      const stopMeta = stopMetaByPoiId.get(f.properties.id)
      const orderNumber = stopMeta ? stopMeta.stopIndex + 1 : null
      const dayIndex = stopMeta ? stopMeta.dayIndex : null

      el.className = 'poiMarker'
      el.type = 'button'
      el.setAttribute('aria-label', f.properties.name)
      if (orderNumber) {
        el.setAttribute('data-order', String(orderNumber))
      }
      if (dayIndex !== null && dayIndex !== undefined) {
        el.setAttribute('data-day', String(dayIndex))
      }

      const stopLine = stopMeta
        ? `<p class="poiPopupMeta">${escapeHtml(stopMeta.time_block)} · ${escapeHtml(stopMeta.label)}</p>`
        : f.properties.tags
          ? `<p class="poiPopupMeta">${escapeHtml(f.properties.tags)}</p>`
          : ''

      const whyLine = stopMeta?.why
        ? `<p class="poiPopupDesc">${escapeHtml(stopMeta.why)}</p>`
        : f.properties.description
          ? `<p class="poiPopupDesc">${escapeHtml(f.properties.description)}</p>`
          : ''

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'poiPopup',
        offset: 18,
      }).setHTML(
        `<div class="poiPopupInner">
            <p class="poiPopupTitle">${escapeHtml(f.properties.name)}</p>
            ${stopLine}
            ${whyLine}
          </div>`
      )

      el.addEventListener('mouseenter', () => popup.addTo(map))
      el.addEventListener('mouseleave', () => {
        if (selectedId !== f.properties.id) popup.remove()
      })
      el.addEventListener('click', () => {
        onSelect?.(f.properties.id)
        popup.addTo(map)
        map.flyTo({ center: f.geometry.coordinates, zoom: Math.max(map.getZoom(), 11), speed: 0.8 })
      })

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(f.geometry.coordinates)
        .addTo(map)

      marker.__popup = popup
      marker.__id = f.properties.id
      return marker
    })

    // routes
    const routeFc = buildRouteGeoJson(itinerary, poiById)
    const src = map.getSource('itinerary-routes')
    if (src && typeof src.setData === 'function') {
      src.setData(routeFc)
    }
  }, [poiFeatures, stopMetaByPoiId, onSelect, itinerary, poiById, selectedId])

  useEffect(() => {
    // Update marker selected state (CSS class)
    markersRef.current.forEach((m) => {
      const el = m.getElement()
      const isSelected = selectedId && m.__id === selectedId
      el.classList.toggle('isSelected', Boolean(isSelected))

      // keep popup open for selected marker
      if (isSelected) m.__popup?.addTo(mapRef.current)
      if (!isSelected) m.__popup?.remove()
    })
  }, [selectedId])

  return (
    <div className="itineraryLayout">
      <div className="itineraryPanel" aria-label="Stops list">
        {!itinerary ? (
          <>
            <p className="muted">Sample POIs (from markdown):</p>
            <ul className="poiList">
              {(displayPois || []).map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`poiListItem ${selectedId === p.id ? 'active' : ''}`}
                    onClick={() => onSelect?.(p.id)}
                  >
                    <span className="poiListName">{p.name}</span>
                    {p.tags?.length ? <span className="poiListTags">{p.tags.join(' · ')}</span> : null}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="muted">Generated itinerary</p>
            <div className="dayList">
              {itinerary.days.map((d) => (
                <section key={d.label} className="dayBlock" aria-label={d.label}>
                  <h3 className="dayTitle">{d.label}</h3>
                  <ol className="stopList">
                    {d.stops.map((s) => {
                      const poi = poiById.get(s.poi_id)
                      return (
                        <li key={`${d.label}-${s.poi_id}-${s.time_block}`}>
                          <button
                            type="button"
                            className={`poiListItem ${selectedId === s.poi_id ? 'active' : ''}`}
                            onClick={() => onSelect?.(s.poi_id)}
                          >
                            <span className="poiListName">{poi?.name || s.poi_id}</span>
                            <span className="poiListTags">
                              {s.time_block} · {s.duration_min}m · {s.label}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ol>
                </section>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="itineraryMapWrap">
        <div ref={mapContainerRef} className="itineraryMap" />
      </div>
    </div>
  )
}

function buildRouteGeoJson(itinerary, poiById) {
  const dayColors = [
    'rgba(45, 106, 79, 0.9)',
    'rgba(125, 211, 252, 0.9)',
    'rgba(242, 199, 110, 0.9)',
    'rgba(246, 245, 240, 0.85)',
  ]

  if (!itinerary?.days?.length) {
    return { type: 'FeatureCollection', features: [] }
  }

  const features = []

  itinerary.days.forEach((day, dayIndex) => {
    const coords = (day.stops || [])
      .map((s) => poiById.get(s.poi_id))
      .filter(Boolean)
      .map((p) => [p.lng, p.lat])

    if (coords.length < 2) return

    features.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: coords },
      properties: { color: dayColors[dayIndex] || dayColors[0] },
    })
  })

  return { type: 'FeatureCollection', features }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
