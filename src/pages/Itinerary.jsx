import { Link } from 'react-router-dom'
import ItineraryMap from '../components/ItineraryMap'

export default function Itinerary() {
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
          <a href="#cta">Generate</a>
        </nav>
      </header>

      <main>
        <ItineraryMap />
      </main>

      <footer className="footer">
        <div className="footerInner">
          <p>
            <strong>Tahoe Four Seasons Rentals</strong> — itinerary helper prototype.
          </p>
          <p className="muted">Demo site • No booking flow</p>
        </div>
      </footer>
    </div>
  )
}
