import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <header className="topNav" aria-label="Primary">
      <a className="brand" href="#top">
        <span className="brandMark" aria-hidden="true">
          ⛰
        </span>
        <span className="brandText">
          <span className="brandName">Tahoe Four Seasons Rentals</span>
          <span className="brandTag">Cabins, chalets, A‑frames</span>
        </span>
      </a>
      <nav className="navLinks">
        <a href="#seasons">Seasons</a>
        <a href="#listings">Featured cabins</a>
        <a href="#cta">Availability</a>
        <Link to="/itinerary">Itinerary</Link>
      </nav>
    </header>
  )
}
