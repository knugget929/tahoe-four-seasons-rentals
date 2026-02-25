import Nav from '../sections/Nav'
import Hero from '../sections/Hero'
import SeasonGrid from '../sections/SeasonGrid'
import ListingGrid from '../sections/ListingGrid'
import FinalCTA from '../sections/FinalCTA'
import Footer from '../sections/Footer'

export default function Landing() {
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
