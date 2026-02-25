import { Link } from 'react-router-dom'
import { useState } from 'react'

import GenerateItineraryModal from '../components/GenerateItineraryModal'
import ItineraryMap from '../components/ItineraryMap'

export default function Itinerary() {
  const [modalOpen, setModalOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [itinerary, setItinerary] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  async function generate(payload) {
    setBusy(true)
    setError(null)

    try {
      const resp = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await resp.json().catch(() => ({}))
      if (!resp.ok) throw new Error(data?.error || 'Failed to generate itinerary')

      setItinerary(data.itinerary)
      const firstStop = data?.itinerary?.days?.[0]?.stops?.[0]?.poi_id
      if (firstStop) setSelectedId(firstStop)
      setModalOpen(false)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <header className="topNav" aria-label="Itinerary top nav">
        <Link className="brand" to="/">
          <span className="brandMark" aria-hidden="true">
            ⛰
          </span>
          <span className="brandText">
            <span className="brandName">Tahoe Four Seasons Rentals</span>
            <span className="brandTag">Itinerary helper (prototype)</span>
          </span>
        </Link>
        <nav className="navLinks">
          <Link to="/">Home</Link>
          <button className="button small" type="button" onClick={() => setModalOpen(true)}>
            Generate
          </button>
        </nav>
      </header>

      <main>
        <section className="itineraryShell" aria-label="Itinerary helper">
          <header className="itineraryHeader">
            <div>
              <h2 className="itineraryTitle">Build a map-based itinerary</h2>
              <p className="itinerarySubtitle">
                Generate a simple day plan from our markdown POIs, then explore it on the map.
              </p>
              {error ? (
                <p style={{ marginTop: 10 }} className="muted">
                  Error: {error}
                </p>
              ) : null}
            </div>
            <button className="button primary" type="button" onClick={() => setModalOpen(true)}>
              {busy ? 'Generating…' : itinerary ? 'Regenerate' : 'Generate itinerary'}
            </button>
          </header>

          <ItineraryMap selectedId={selectedId} onSelect={setSelectedId} itinerary={itinerary} />
        </section>
      </main>

      <footer className="footer">
        <div className="footerInner">
          <p>
            <strong>Tahoe Four Seasons Rentals</strong> — itinerary helper prototype.
          </p>
          <p className="muted">Demo site • No booking flow</p>
        </div>
      </footer>

      <GenerateItineraryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onGenerate={generate}
        busy={busy}
      />
    </div>
  )
}
