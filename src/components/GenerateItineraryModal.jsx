import { useEffect, useMemo, useState } from 'react'

export default function GenerateItineraryModal({ open, onClose, onGenerate, busy }) {
  const [days, setDays] = useState(1)
  const [maxStops, setMaxStops] = useState(4)
  const [pace, setPace] = useState('balanced')
  const [startArea, setStartArea] = useState('Tahoe (flexible)')
  const [interests, setInterests] = useState('scenic, kid-friendly, coffee')

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const parsedInterests = useMemo(() => {
    return interests
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }, [interests])

  if (!open) return null

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="Generate itinerary">
      <div className="modal">
        <div className="modalHeader">
          <h3 className="modalTitle">Generate itinerary</h3>
          <button className="iconButton" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form
          className="modalBody"
          onSubmit={(e) => {
            e.preventDefault()
            onGenerate?.({
              days: Number(days),
              max_stops_per_day: Number(maxStops),
              pace,
              start_area: startArea,
              interests: parsedInterests,
            })
          }}
        >
          <label className="field">
            <span className="fieldLabel">Days</span>
            <input type="number" min="1" max="7" value={days} onChange={(e) => setDays(e.target.value)} />
          </label>

          <label className="field">
            <span className="fieldLabel">Max stops / day</span>
            <input
              type="number"
              min="2"
              max="8"
              value={maxStops}
              onChange={(e) => setMaxStops(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="fieldLabel">Pace</span>
            <select value={pace} onChange={(e) => setPace(e.target.value)}>
              <option value="chill">Chill</option>
              <option value="balanced">Balanced</option>
              <option value="packed">Packed</option>
            </select>
          </label>

          <label className="field">
            <span className="fieldLabel">Start area</span>
            <input value={startArea} onChange={(e) => setStartArea(e.target.value)} />
          </label>

          <label className="field">
            <span className="fieldLabel">Interests (comma-separated)</span>
            <input value={interests} onChange={(e) => setInterests(e.target.value)} />
          </label>

          <div className="modalActions">
            <button className="button ghost" type="button" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button className="button primary" type="submit" disabled={busy}>
              {busy ? 'Generating…' : 'Generate'}
            </button>
          </div>

          <p className="finePrint" style={{ marginTop: 10 }}>
            Uses a serverless API on Vercel. No booking flow.
          </p>
        </form>
      </div>
    </div>
  )
}
