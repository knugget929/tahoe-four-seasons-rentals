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

export default function ListingGrid() {
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
