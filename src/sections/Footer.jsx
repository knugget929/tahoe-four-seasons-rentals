export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">
        <p>
          <strong>Tahoe Four Seasons Rentals</strong> — four‑season stays for every kind of trip.
        </p>
        <p className="muted">© {new Date().getFullYear()} • Made for Vercel</p>
      </div>
    </footer>
  )
}
