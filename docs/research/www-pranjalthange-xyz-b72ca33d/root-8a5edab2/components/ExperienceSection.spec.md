# ExperienceSection — spec

Source of truth: `page-source.chunk.js` module `62050` (bytes ~57400–66400). All CSS
below is copied verbatim from that module's inline `<style>`.

## DOM

```
section#experience-section.xp-section
  div.xp-mark-wrap[aria-hidden]
    div.xp-mark-clip
      div.xp-mark-track
        span.xp-mark-run  ×2   ("WORK EXPERIENCE WORK EXPERIENCE")
  div.xp-cards
    div.xp-card-slot[style: z-index = i+1]   ×3
      div.xp-card[style: transform: rotate(Ndeg)]
        div.xp-card-top > h3.xp-role + span.xp-year
        span.xp-org
        div.xp-tags > span.xp-tag ×3
```

No `'use client'`, no refs, no gsap: the stack is pure CSS `position: sticky`.
(The original module holds two unused `useRef`s; they drive nothing.)

## Data (verbatim, DOM order)

| # | role | year | org | tags |
|---|------|------|-----|------|
| 1 | Open Source Contributor | 2025 | GSOC & Summer of bitcoin | Open Source, Developer Community, Collaboration |
| 2 | Founder & Builder | NOW | VectorOS | 0 → 1, Product Vision, Execution |
| 3 | Software Development Intern | 2026 | Simora AI | Full-Stack, Product Engineering, Shipping |

Tags are authored in **Title Case** and uppercased by CSS (`text-transform: uppercase`
on `.xp-tag`). `0 → 1` uses U+2192. Card `key` is `${year}-${org}`.

Rotations come from `[-3.5, 2.5, -1.5, 3, -2]` indexed by `i % 5` → cards get
`-3.5deg`, `2.5deg`, `-1.5deg`.

## Stacking values

- `.xp-section` — `position: relative; background: #000000` (no `overflow:hidden`;
  it would break descendant stickiness).
- `.xp-mark-wrap` — `position: sticky; top: 0; height: 0; z-index: 0; pointer-events: none`.
- `.xp-mark-clip` — `position: absolute; top: 12vh; left: 0; width: 100vw; overflow: hidden`.
- `.xp-cards` — `position: relative; z-index: 1; padding: 70vh 0 40vh`.
- `.xp-card-slot` — `position: sticky; top: 34vh; height: 78vh;` flex, centred,
  `align-items: flex-start`; inline `z-index: 1|2|3` so later cards cover earlier ones.
- `.xp-card` — `width: min(760px, 82vw); height: clamp(280px, 34vh, 340px);
  flex-shrink: 0; min-height: 0; background:#FFF; color:#0A0A0A;
  padding: clamp(2rem,4vw,3.2rem); gap: 1.1rem; overflow: hidden;
  box-shadow: 0 24px 70px rgba(0,0,0,0.45)`. No border-radius.

At 1440×900, `top: 34vh` = 306px and `height: 78vh` = 702px — matching the measured
sticky offset and the 702px flow spacing between slots.

## Marquee

- Single horizontal line (not two), one direction, scrolling **left**.
- `.xp-mark-track { display:flex; width:max-content; animation: xp-marquee 38s linear infinite; will-change: transform }`
- Two identical `.xp-mark-run` spans so the `translateX(-50%)` loop is seamless.
- `.xp-mark-run` — `var(--font-hero-sans)`, weight 800, `clamp(90px, 15vw, 220px)`,
  `line-height:1`, `letter-spacing:-0.02em`, `color:#FFFFFF`, `opacity:0.06`, `user-select:none`.
- `@media (prefers-reduced-motion: reduce) { .xp-mark-track { animation: none } }`
- `@keyframes xp-marquee` is already in `globals.css`, so it is **not** redeclared here.

## Card typography

- `.xp-card-top` — flex, `align-items: baseline`, `justify-content: space-between`,
  `gap: 1.5rem`, `border-bottom: 1px solid rgba(10,10,10,0.9)`, `padding-bottom: 1rem`.
- `.xp-role` — `--font-hero-sans` 700, `clamp(24px,3vw,42px)`, lh 1.05, ls -0.01em.
- `.xp-year` — `--font-body` 700, `clamp(13px,1.1vw,16px)`, ls 0.14em, `#6b665c`.
- `.xp-org` — `--font-body`, `clamp(14px,1.1vw,17px)`, lh 1.6, `#57534A`.
- `.xp-tags` — flex wrap, gap 0.6rem, `margin-top: 0.4rem`.
- `.xp-tag` — `--font-body` 600, `clamp(12px,0.95vw,14px)`, ls 0.06em, uppercase,
  `#0A0A0A`, `1px solid rgba(10,10,10,0.35)`, `border-radius: 999px`,
  `padding: 0.55em 1.2em`, `white-space: nowrap`.

## Responsive

```
@media (max-width: 768px) {
  .xp-card-top { flex-direction: column; gap: 0.4rem; }
  .xp-mark-run { font-size: clamp(64px, 30vw, 140px); }
  .xp-card-slot { height: max(52vh, 340px); top: 20vh; }
  .xp-cards { padding: 50vh 0 30vh; }
}
@media (max-width: 480px) {
  .xp-card { width: 90vw; padding: clamp(1.5rem, 6vw, 2.2rem); }
}
```

At 390px the card is `90vw` = 351px and the clip is `100vw`, so nothing overflows.
