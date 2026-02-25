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

export default function SeasonGrid() {
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
