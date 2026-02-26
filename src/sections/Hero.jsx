export default function Hero() {
  return (
    <section className="hero" aria-label="Tahoe rentals landing">
      <div className="heroInner">
        <p className="eyebrow">Lake Tahoe • Four‑season stays</p>
        <h1 className="heroTitle">
          Your Tahoe home base—<span className="heroAccent">all year</span>.
        </h1>
        <p className="heroSubtitle">
          Curated places that feel settled and well‑considered: close to the lake, the lifts, or the trailhead,
          with the small details that make a trip easy.
        </p>

        <div className="heroActions">
          <a className="button primary" href="#listings">
            Browse featured cabins
          </a>
          <a className="button secondary" href="#cta">
            Get availability
          </a>
        </div>

        <dl className="heroStats" aria-label="Highlights">
          <div className="stat">
            <dt>Thoughtful picks</dt>
            <dd>Comfort + character</dd>
          </div>
          <div className="stat">
            <dt>Four seasons</dt>
            <dd>Spring to storm days</dd>
          </div>
          <div className="stat">
            <dt>Local rhythm</dt>
            <dd>Beach, town, trails</dd>
          </div>
        </dl>
      </div>

      <div className="heroArt" aria-hidden="true">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="heroCard">
          <p className="heroCardTitle">Trip ideas</p>
          <ul className="heroCardList">
            <li>Sunrise coffee on the deck</li>
            <li>Lake‑loop strolls</li>
            <li>Market haul → simple dinner</li>
            <li>Hot tub under the pines</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
