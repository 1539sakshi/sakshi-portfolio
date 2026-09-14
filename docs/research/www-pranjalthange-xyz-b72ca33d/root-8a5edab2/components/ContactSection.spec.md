# ContactSection — spec

Source of truth: `page-source.chunk.js` (modules `8082` = footer/contact, `54913` = SlantReveal wrapper).

## Structure (verbatim DOM order from source)

```
div.slant-track
  div.slant-stage                      (clip-path animated)
    section#contact-section.footer-contact
      div.footer-top
        div.footer-left
          h2.footer-heading            "Got an idea?" <br> span.footer-heading-highlight "Let’s make it real."
          a.footer-email               mailto:pranjal.thange27@gmail.com
          a.footer-cta                 "Contact Now" + span.footer-cta-arrow "↗"  (mailto:)
        div.footer-socials-block
          span.footer-socials-label    "Say hii" + span.footer-socials-label-tail
          nav.footer-socials           3 a.footer-social-icon
      div.footer-crosses               3 span.footer-cross (lg, sm, lg)
```

Note: the crosses come **after** `.footer-top` in the DOM, not before.

## SlantReveal (`.slant-track`)

Not a marquee. It is a **diagonal clip-path reveal**:

- On `scroll`/`resize`, `progress = clamp((innerHeight - track.getBoundingClientRect().top) / innerHeight, 0, 1)`.
- `stage.style.clipPath = polygon(0 ${22*progress}vh, 100% 0, 100% 100%, 0 100%)` — the top-left corner drops up to 22vh, so the section's top edge is a diagonal that flattens out as it enters.
- `prefers-reduced-motion: reduce` → clip-path set once to the full rectangle, no listeners.
- CSS: `.slant-track { position: relative }`, `.slant-stage { position: relative; will-change: clip-path }`.
- The section's `padding-top: 34vh` exists solely to clear the deepest slant cut (22vh).

## Fonts

Both headline and email use **`var(--font-hero-sans)`** (Neue Montreal). There is **no** Playfair/italic display serif in this section. Heading `700 / clamp(30px,4vw,48px) / 1.1 / -0.01em`; email `800 / clamp(28px,4.4vw,56px) / 1.05 / -0.01em`, colour `#1E1811` (not `--ink`).

"Let’s make it real." is highlighted with a solid `var(--accent)` block, `padding: 0 0.15em` (the `border-radius` line is commented out in the source — kept commented/omitted).

## Hover transitions (exact)

| Element | Resting | Hover | Transition |
|---|---|---|---|
| `.footer-email` | no shadow | `text-shadow: 0 6px 18px rgba(30,24,17,0.3)` | `text-shadow 0.25s ease` |
| `.footer-cta::before` (underline wipe) | `scaleX(0)`, origin left, `#0A0A0A`, 1.5px | `scaleX(1)` | `transform 0.45s cubic-bezier(0.65, 0, 0.35, 1)` |
| `.footer-cta::after` (rest line) | `rgba(10,10,10,0.3)` 1.5px, static | — | none |
| `.footer-cta-arrow` | — | `translate(2px, -2px)` | `transform 0.2s ease` |
| `.footer-social-icon` | `1.5px solid #0A0A0A`, colour `#0A0A0A` | bg `#0A0A0A`, colour `#EFEBE3` | `background 0.2s ease, color 0.2s ease` |

`.footer-socials-label` ("Say hii") has **no** hover — it is a static black chat bubble (`13px/600/0.02em`, `#fff` on `#0A0A0A`, `border-radius 14px`, `box-shadow 0 8px 20px rgba(10,10,10,0.18)`) with a `clip-path: polygon(0 0, 100% 0, 15% 100%)` tail at `right:18px; bottom:-6px`.

## Layout

- `.footer-contact`: `min-height:100vh`, column flex, `justify-content:flex-end`, `gap: clamp(4rem,10vh,8rem)`, `background #EFEBE3`, `color #0A0A0A`, `padding: 34vh 1.5rem 8vh`, `overflow:hidden`.
- `.footer-crosses`: `space-between`, `padding: 0 clamp(0.5rem,4vw,3rem)`, `color rgba(10,10,10,0.35)`, `--font-body`; lg `20px`, sm `13px`.
- `@media (max-width: 640px)`: `.footer-contact { padding: 26vh 1.25rem 4rem; gap: clamp(2.5rem,8vh,4rem) }`, `.footer-top` stacks to column/flex-start, `.footer-socials-block` aligns flex-start.

## Socials

GitHub `https://github.com/pranjal270`, LinkedIn `https://www.linkedin.com/in/pranjal-thange-324548365/`, Instagram `https://www.instagram.com/pranjall.t/` — all `target="_blank" rel="noopener noreferrer"`, 44px round outlined buttons with 18px SVGs.

## Inferred / deviations

- GitHub + LinkedIn icons come from `shared/icons.tsx` (their paths differ by a few bezier digits from the chunk's copies — the shared file is authoritative per project rules). The Instagram icon is not in `shared/icons.tsx`, so it is defined locally, verbatim from the chunk.
- `.footer-cta-block` appears only in the mobile media query; no element uses it. Kept for fidelity.
- Styles are emitted via an inline `<style>` element exactly as the source does, so no global CSS file is touched.
