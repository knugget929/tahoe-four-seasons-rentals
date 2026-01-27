import './App.css'

const seasons = [
  {
    id: 'spring',
    name: 'Spring',
    kicker: 'Wildflower weekends & lake-sparkle mornings',
    blurb:
      'When the snowline lifts and the trails re-open, Tahoe turns soft and bright. Think patio coffee, waterfall hikes, and quiet coves before the summer buzz.',
    highlights: ['Wildflower trails', 'Sunny decks', 'Shoulder-season steals'],
    gradient: 'seasonCard spring',
  },
  {
    id: 'summer',
    name: 'Summer',
    kicker: 'Blue-water days & golden-hour dinners',
    blurb:
      'Boat. Beach. Bike. Repeat. Summer in Tahoe is all swim breaks and sunset BBQs—wrapped in pine air and that postcard-blue lake you came for.',
    highlights: ['Beach packs + towels', 'BBQ-ready patios', 'Walkable shoreline'],
    gradient: 'seasonCard summer',
  },
  {
    id: 'fall',
    name: 'Fall',
    kicker: 'Crisp hikes & cozy cabin nights',
    blurb:
      'Aspens glow, crowds thin, and the mornings smell like woodsmoke and pine. Fall is made for scenic drives, hot cider, and lakeside stillness.',
    highlights: ['Fireplace evenings', 'Leaf-peeping routes', 'Quiet, romantic stays'],
    gradient: 'seasonCard fall',
  },
  {
    id: 'winter',
    name: 'Winter',
    kicker: 'Powder turns, saunas & storm watching',
    blurb:
      'Snow days feel like a movie here. Wake up to fresh powder, chase first chair, then come home to a warm soak and a view that doesn’t quit.',
    highlights: ['Ski storage', 'Hot tubs & saunas', 'Near resort access'],
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
    badges: ['Hot tub', 'Ski shuttle nearby', 'Fireplace'],
    description:
      'A bright A‑frame with a steamy soak under the stars—made for powder mornings and cocoa nights.',
  },
  {
    id: 'l2',
    name: 'Lakeside Driftwood Cottage',
    season: 'Summer',
    price: 410,
    sleeps: 6,
    badges: ['Beach gear', 'BBQ', 'Kayak rack'],
    description:
      'Steps to the water with an easy-breezy layout for swim breaks, sunset dinners, and sandy feet.',
  },
  {
    id: 'l3',
    name: 'Aspen Glow Hideaway',
    season: 'Fall',
    price: 285,
    sleeps: 2,
    badges: ['Cedar sauna', 'Mountain view', 'Fast Wi‑Fi'],
    description:
      'A warm, minimalist retreat for leaf-peeping days and candlelit nights—quiet, calm, and close to trails.',
  },
  {
    id: 'l4',
    name: 'Wildflower Ridge Cabin',
    season: 'Spring',
    price: 260,
    sleeps: 5,
    badges: ['Deck dining', 'Trailhead close', 'EV outlet'],
    description:
      'Catch the first bloom and the clearest light—an airy cabin with room to breathe and a deck built for brunch.',
  },
  {
    id: 'l5',
    name: 'Pinecone Modern Chalet',
    season: 'Winter',
    price: 465,
    sleeps: 8,
    badges: ['Game room', 'Boot warmer', 'Chef kitchen'],
    description:
      'A spacious, design-forward chalet for crews—après games, big meals, and plenty of elbow room.',
  },
  {
    id: 'l6',
    name: 'Sunset Basin Bungalow',
    season: 'Summer',
    price: 340,
    sleeps: 4,
    badges: ['Walk to dining', 'Outdoor shower', 'Bikes'],
    description:
      'Golden-hour central: roll to coffee, bike to the beach, and finish with an outdoor rinse and a slow evening.',
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
          <span className="brandName">Lake Tahoe Rentals</span>
          <span className="brandTag">Four‑season escapes</span>
        </span>
      </a>
      <nav className="navLinks">
        <a href="#seasons">Seasons</a>
        <a href="#listings">Featured Cabins</a>
        <a href="#cta">Book</a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" aria-label="Lake Tahoe rentals">
      <div className="heroInner">
        <p className="eyebrow">Lake Tahoe • Four-season escapes</p>
        <h1 className="heroTitle">
          Find your Tahoe vibe—<span className="heroAccent">every season</span>.
        </h1>
        <p className="heroSubtitle">
          From wildflower mornings to powder nights, discover homes that feel like a lifestyle upgrade—not
          just a place to sleep.
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
            <dt>Curated homes</dt>
            <dd>Cabins, chalets, A‑frames</dd>
          </div>
          <div className="stat">
            <dt>All seasons</dt>
            <dd>Spring to storm days</dd>
          </div>
          <div className="stat">
            <dt>Local feel</dt>
            <dd>Trails, beaches, towns</dd>
          </div>
        </dl>
      </div>

      <div className="heroArt" aria-hidden="true">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="heroCard">
          <p className="heroCardTitle">This week in Tahoe</p>
          <ul className="heroCardList">
            <li>Sunrise coffee on the deck</li>
            <li>Lake loop strolls</li>
            <li>Firepit stories</li>
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
          Pick your pace—quiet and cozy or bright and bold. Each season has its own rhythm (and its own
          kind of magic).
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
          A taste of what we curate—real homes, real comfort, and a vibe that matches your trip.
          (Listings shown are demo data.)
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
          Pick your season, bring your people, and we’ll help you land the right home base—close to the
          lake, the lifts, or the trailhead.
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
          <strong>Lake Tahoe Rentals</strong> — four-season stays for every mood.
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
