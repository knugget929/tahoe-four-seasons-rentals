export default function FinalCTA() {
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
