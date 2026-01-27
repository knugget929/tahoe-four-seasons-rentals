import './App.css'

const seasons = [
  {
    id: 'spring',
    name: 'Spring',
    kicker: 'Clear air, quiet trails, first bloom',
    blurb:
      'Between snowmelt and summer crowds, Tahoe feels spacious. It’s the season for waterfall hikes, patio coffee, and that first warm light on the lake.',
    highlights: ['Waterfalls + wildflowers', 'Shoulder‑season value', 'Deck mornings'],
    gradient: 'seasonCard spring',
  },
  {
    id: 'summer',
    name: 'Summer',
    kicker: 'Blue water days & long evenings',
    blurb:
      'Swim breaks, bike rides, and dinners that stretch into golden hour. Summer is bright, active, and made for lake time—start to finish.',
    highlights: ['Beach gear ready', 'BBQ patios', 'Walkable shoreline'],
    gradient: 'seasonCard summer',
  },
  {
    id: 'fall',
    name: 'Fall',
    kicker: 'Crisp hikes & cabin‑cozy nights',
    blurb:
      'Aspens glow, crowds thin, and mornings turn brisk. Fall is for scenic drives, hot cider, and returning home to a fireplace and a view.',
    highlights: ['Fireplace evenings', 'Leaf‑peeping routes', 'Quieter weekends'],
    gradient: 'seasonCard fall',
  },
  {
    id: 'winter',
    name: 'Winter',
    kicker: 'Powder mornings, warm soaks, storm views',
    blurb:
      'Fresh snow, first chair, and the kind of quiet you only get mid‑storm. Winter stays are about comfort—heat, gear storage, and a good soak.',
    highlights: ['Ski‑friendly setups', 'Hot tubs & saunas', 'Near resort access'],
    gradient: 'seasonCard winter',
  },
]

const listings = [
  {
    id: 'l1',
    name: 'Cedar & Sky A‑Frame',
    season: 'Winter',
    price: 325,
    sleeps: 4,
    badges: ['Hot tub', 'Fireplace', 'Ski shuttle nearby'],
    description:
      'A bright A‑frame with a steamy soak under the pines—built for powder mornings and cocoa nights.',
  },
  {
    id: 'l2',
    name: 'Lakeside Driftwood Cottage',
    season: 'Summer',
    price: 410,
    sleeps: 6,
    badges: ['Beach gear', 'BBQ', 'Kayak rack'],
    description:
      'Steps to the water with an easy, open layout for swim breaks, sunset dinners, and sandy feet.',
  },
  {
    id: 'l3',
    name: 'Aspen Glow Hideaway',
    season: 'Fall',
    price: 285,
    sleeps: 2,
    badges: ['Cedar sauna', 'Mountain view', 'Fast Wi‑Fi'],
    description:
      'A calm, minimalist retreat for leaf‑peeping days and candlelit nights—quiet, close to trails.',
  },
  {
    id: 'l4',
    name: 'Wildflower Ridge Cabin',
    season: 'Spring',
    price: 260,
    sleeps: 5,
    badges: ['Deck dining', 'Trailhead close', 'EV outlet'],
    description:
      'Catch the first bloom and the clearest light—an airy cabin with a deck that’s made for brunch.',
  },
  {
    id: 'l5',
    name: 'Pinecone Modern Chalet',
    season: 'Winter',
    price: 465,
    sleeps: 8,
    badges: ['Game room', 'Boot warmer', 'Chef kitchen'],
    description:
      'A spacious, design‑forward chalet for crews—après games, big meals, and plenty of elbow room.',
  },
  {
    id: 'l6',
    name: 'Sunset Basin Bungalow',
    season: 'Summer',
    price: 340,
    sleeps: 4,
    badges: ['Walk to dining', 'Outdoor shower', 'Bikes'],
    description:
      'Golden‑hour central: bike to the beach, rinse off outside, and settle into an unhurried evening.',
  },
]

function Nav() {
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
      </nav>
    </header>
  )
}

function Hero() {
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

function SeasonGrid() {
  return (
    <section className="section" id="seasons" aria-labelledby="seasons-title">
      <div className="sectionHeader">
        <h2 id="seasons-title">Tahoe, in four seasons</h2>
        <p>
          Pick your pace—quiet and cozy or bright and busy. Each season has its own rhythm (and its own kind
          of magic).
        </p>
      </div>

      <div className="seasonGrid" role="list">
        {seasons.map((s) => (
          <article key={s.id} className={s.gradient} role="listitem" id={s.id}>
            <div className="seasonHeader">
              <h3>{s.name}</h3>
              <p className="seasonKicker">{s.kicker}</p>
            </div>
            <p className="seasonBlurb">{s.blurb}</p>
            <ul className="chips" aria-label={`${s.name} highlights`}>
              {s.highlights.map((h) => (
                <li key={h} className="chip">
                  {h}
                </li>
              ))}
            </ul>
            <a className="textLink" href="#listings">
              See stays for {s.name.toLowerCase()} <span aria-hidden="true">→</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

function ListingGrid() {
  return (
    <section className="section" id="listings" aria-labelledby="listings-title">
      <div className="sectionHeader">
        <h2 id="listings-title">Featured cabins (sample listings)</h2>
        <p>
          A quick look at what we mean by “curated”—real comfort, clean design, and a practical setup for
          Tahoe days. (Listings shown are demo data.)
        </p>
      </div>

      <div className="listingGrid" role="list">
        {listings.map((l) => (
          <article key={l.id} className="listingCard" role="listitem">
            <div className="listingTop">
              <div>
                <h3 className="listingName">{l.name}</h3>
                <p className="listingMeta">
                  <span className="pill">Best in {l.season}</span>
                  <span className="dot" aria-hidden="true">
                    •
                  </span>
                  <span>
                    Sleeps <strong>{l.sleeps}</strong>
                  </span>
                </p>
              </div>
              <div className="price" aria-label={`From $${l.price} per night`}>
                <span className="priceValue">${l.price}</span>
                <span className="priceUnit">/night</span>
              </div>
            </div>

            <p className="listingDesc">{l.description}</p>

            <ul className="amenities" aria-label="Amenities">
              {l.badges.map((b) => (
                <li key={b} className="amenity">
                  {b}
                </li>
              ))}
            </ul>

            <div className="listingActions">
              <a className="button small" href="#cta">
                Request dates
              </a>
              <a className="button small ghost" href="#cta">
                Ask a question
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="cta" id="cta" aria-labelledby="cta-title">
      <div className="ctaInner">
        <h2 id="cta-title">Ready for a Tahoe reset?</h2>
        <p>
          Tell us your dates and your style (lake days, ski days, quiet cabin days). We’ll help you land a
          home base that fits.
        </p>

        <div className="ctaActions">
          <a className="button primary" href="#listings">
            Check availability
          </a>
          <a className="button secondary" href="#seasons">
            Explore seasons
          </a>
        </div>

        <p className="finePrint">Demo site — CTA buttons are placeholders (no booking flow).</p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">
        <p>
          <strong>Tahoe Four Seasons Rentals</strong> — four‑season stays for every kind of trip.
        </p>
        <p className="muted">© {new Date().getFullYear()} • Made for GitHub Pages</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div id="top" className="page">
      <a className="skipLink" href="#seasons">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <SeasonGrid />
        <ListingGrid />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
