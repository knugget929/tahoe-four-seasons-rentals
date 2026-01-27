## Landing page design refresh (typography + layout + subtle motion)

### What changed
- Refreshed **visual identity** away from neon/tech to a Tahoe-inspired palette (lake / pine / sun), while keeping the page dark-mode friendly.
- Improved **typographic hierarchy** and spacing for better scanability.
- Added subtle **micro-interactions** (card lift on hover, gentle hero “orb” float) with `prefers-reduced-motion` support.
- Replaced scanline-style background animation with a quieter **topo/grain overlay** (static) to avoid a synthetic/AI look.

### Accessibility / UX
- Focus rings kept high-contrast (`:focus-visible`).
- Motion respects `prefers-reduced-motion`.
- Contrast remains strong for body text and key UI.

### Screenshots
**After**
- Full page: (attach) `58b395d4-0925-4fbc-8b74-1aa55b1e1351.jpg`

(If you want a true before/after pair in the PR, I can add a second screenshot from `main`.)

### Testing
- `npm ci`
- `npm run lint`
- `npm run build`

### Deploy notes
No changes to GitHub Pages config (`vite.config.js` base path unchanged). Build output verified locally via `vite preview`.
