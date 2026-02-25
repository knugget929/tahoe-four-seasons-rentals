import { useEffect, useMemo, useRef, useState } from 'react'

import pois from '../data/pois.json'

const DEFAULT_CENTER = [-119.9772, 39.0968] // Tahoe (approx)

export default function ItineraryMap() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const [selectedId, setSelectedId] = useState(null)

  const poiFeatures = useMemo(() => {
    return (pois || []).map((p) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: {
        id: p.id,
        name: p.name,
        tags: (p.tags || []).join(' · '),
        description: p.description || '',
      },
    }))
  }, [])

  useEffect(() => {
    let cancelled = false

    async function init() {
      if (!mapContainerRef.current || mapRef.current) return

      const maplibregl = (await import('maplibre-gl')).default
      await import('maplibre-gl/dist/maplibre-gl.css')

      if (cancelled) return

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center: DEFAULT_CENTER,
        zoom: 9,
      })

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right')

      map.on('load', () => {
        // markers
        markersRef.current = poiFeatures.map((f) => {
          const el = document.createElement('button')
          el.className = 'poiMarker'
          el.type = 'button'
          el.setAttribute('aria-label', f.properties.name)

          const popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'poiPopup',
            offset: 18,
          }).setHTML(
            `<div class="poiPopupInner">
              <p class="poiPopupTitle">${escapeHtml(f.properties.name)}</p>
              ${f.properties.tags ? `<p class="poiPopupMeta">${escapeHtml(f.properties.tags)}</p>` : ''}
              ${f.properties.description ? `<p class="poiPopupDesc">${escapeHtml(f.properties.description)}</p>` : ''}
            </div>`
          )

          el.addEventListener('mouseenter', () => popup.addTo(map))
          el.addEventListener('mouseleave', () => {
            if (selectedId !== f.properties.id) popup.remove()
          })
          el.addEventListener('click', () => {
            setSelectedId(f.properties.id)
            popup.addTo(map)
            map.flyTo({ center: f.geometry.coordinates, zoom: Math.max(map.getZoom(), 11), speed: 0.8 })
          })

          const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat(f.geometry.coordinates)
            .addTo(map)

          // attach popup for later
          marker.__popup = popup
          marker.__id = f.properties.id
          return marker
        })
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
  }, [poiFeatures, selectedId])

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
    <section className="itineraryShell" aria-label="Itinerary helper (map)">
      <header className="itineraryHeader">
        <div>
          <h2 className="itineraryTitle">Itinerary helper (prototype)</h2>
          <p className="itinerarySubtitle">
            Pan/zoom the map and hover a pin for a quick preview. (Dev tiles + sample POIs.)
          </p>
        </div>
        <a className="button small" href="#cta">
          Generate (soon)
        </a>
      </header>

      <div className="itineraryLayout">
        <div className="itineraryPanel" aria-label="Stops list">
          <p className="muted">Sample POIs (from markdown):</p>
          <ul className="poiList">
            {(pois || []).map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={`poiListItem ${selectedId === p.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(p.id)}
                >
                  <span className="poiListName">{p.name}</span>
                  {p.tags?.length ? <span className="poiListTags">{p.tags.join(' · ')}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="itineraryMapWrap">
          <div ref={mapContainerRef} className="itineraryMap" />
        </div>
      </div>

      <div id="cta" style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
        Generate
      </div>
    </section>
  )
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
