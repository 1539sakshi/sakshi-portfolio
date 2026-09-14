# AboutSection — spec

Source of truth: `page-source.chunk.js`, webpack module `75543` (the About section
component, `.ma-about`) and module `82547` (`HeroAboutPhotoBridge`, the portrait).

## Structure (verbatim from module 75543)

```
section#about-section.ma-about
  div.ma-body
    div.ma-left
      h2.ma-hey                "Hey!"
      p.ma-bio-short           "I’m Pranjal, a builder based in India, currently working on <strong>VectorOS</strong>, a platform that automates creator & business DMs at scale."
    div.ma-photo[data-photo-anchor="about"]   (empty anchor on the live site)
    div.ma-right
      p.ma-bio-long  x2
      a.ma-cta       -> https://mail.google.com/mail/?view=cm&fs=1&to=pranjal.thange27@gmail.com  (target=_blank, rel=noopener noreferrer)
        span.ma-cta-text      "Get in touch"
        span.ma-cta-arrow[aria-hidden]
          span.ma-cta-arrow-glyph  "↗"
          span.ma-cta-arrow-glyph  "↗"
  <style>…</style>
```

The section has **no GSAP of its own** in the source — all its motion is CSS
transitions on `.ma-cta` hover. It renders no `<img>`; the portrait is injected
by a separate bridge component.

### The two ↗ glyphs

They are **not** a CTA arrow plus a resume link. They are the two halves of a
Framer-style "text-arrow-cta" hover: glyph 1 rests at `translate(0,0)` and leaves
to `translate(1.1em,-1.1em)`; glyph 2 rests at `translate(-1.1em,1.1em)` and
arrives at `translate(0,0)`, both `0.35s cubic-bezier(0.65,0,0.35,1)`, inside a
`1em × 1em overflow:hidden` box. **`ResumeIcon` is not used by this section.**

## Exact values pulled from source

- `.ma-about`: `position:relative; min-height:100vh; background:#EFEBE3; color:#0A0A0A; padding:3vh 3vw 8vh; display:flex; flex-direction:column; cursor:auto`
- `.ma-body`: `flex:1; display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:4vw`
- `.ma-left`: `gap:1.4rem; margin-left:9rem` (reset to `0` at ≤1024px)
- `.ma-hey`: `var(--font-hero-sans)`, `800`, `clamp(40px,5vw,72px)`, `line-height:1`
- `.ma-bio-short`: `var(--font-body)`, `clamp(14px,1vw,16px)`, `line-height:1.6`, `#2c2c28`, `max-width:30ch`, `font-weight:800`, `letter-spacing:-0.01em`; `strong { font-weight:700 }`
- `.ma-photo`: `width:clamp(220px,20vw,320px); aspect-ratio:3/4; pointer-events:none`
- `.ma-right`: `gap:1.1rem; max-width:34ch`
- `.ma-bio-long`: `clamp(19px,0.9vw,15px)` (verbatim — the clamp is inverted in the
  original, so it effectively pins at 15px above ~1667px viewport and 19px below),
  `line-height:1.65`, `#2c2c28`, `600`, `letter-spacing:-0.03em`
- `.ma-cta`: `13px/600/0.02em`, `#0A0A0A`, `gap:0.4em`, `margin-top:0.6rem`, `padding-bottom:0.15em`; resting underline `rgba(10,10,10,0.25)` 1px via `::after`, hover wipe `#0A0A0A` via `::before` `scaleX(0→1)` `0.45s cubic-bezier(0.65,0,0.35,1)`; `.ma-cta-text` nudges `translateX(-2px)` on hover.
- ≤1024px: `.ma-body` becomes one centred column (`grid-template-rows:auto auto auto; justify-items:center; text-align:center; gap:3rem`), `.ma-left/.ma-right` `max-width:46ch; align-items:center`.

Dead CSS present in the source but matching no rendered element: `.ma-topbar`,
`.ma-pill`, `.ma-foot-tag`. Carried over? **No** — omitted, nothing renders them.

## Portrait (module 82547, `HeroAboutPhotoBridge`)

On the live site the `<img src="/croppedimg.jpeg" alt="Pranjal Thange">` is owned
by the bridge, not by About. Its ScrollTrigger:
`trigger: #about-section, start: "top bottom", end: "top top", scrub: 0.6, invalidateOnRefresh: true`,
lerping `top/left/width/height` from the hero anchor to the about anchor while
applying `rotateY: 360*p`, `rotateX: 10*sin(2πp)`,
`filter: grayscale(1-p) contrast(lerp(1.05,1,p))`; at `p >= 1` it switches to
`position:absolute` parked on the about anchor. Base set: `borderRadius:10`,
`boxShadow:"0 20px 45px rgba(0,0,0,0.25)"`, `objectFit:"cover"`, `zIndex:5`
(fixed) / `2` (parked). At `max-width:480px` and under
`prefers-reduced-motion: reduce` it skips the flight entirely and parks the photo
statically on the about anchor.

**Deviation in this build:** since this component is standalone (no hero bridge),
the portrait is rendered inside `.ma-photo` as a `next/image` (`width=550
height=792`, CSS `position:absolute; inset:0; object-fit:cover; z-index:2;
border-radius:10px; box-shadow:0 20px 45px rgba(0,0,0,0.25)` — the bridge's parked
state). The only motion kept is the greyscale→colour scrub over the same
ScrollTrigger range, skipped under `prefers-reduced-motion`. All GSAP lives in a
`gsap.context` reverted on unmount.

## SVG arc — NOT in this section

The 380×1600 / r=620 arc (`M -114.50 1568.37 A 620 620 0 0 0 -114.50 391.63`)
does not appear anywhere in module 75543. It belongs to the **Skills** section,
where `path.getPointAtLength()` positions the `01`–`06` markers along it
(see BEHAVIORS.md § Section 4). It is deliberately omitted here.

## Verification

`npx tsc --noEmit` → clean (no errors).
