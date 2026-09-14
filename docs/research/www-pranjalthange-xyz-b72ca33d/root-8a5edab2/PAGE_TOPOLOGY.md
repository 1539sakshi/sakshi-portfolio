# Page Topology — pranjalthange.xyz (root)

Viewport used for extraction: **1440 x 900**. Total page height: **12096px**.
Root `<main>` is a plain block; there is **no scroll container** and **no scroll-snap** anywhere.
`<html>` carries `class="... lenis dark"`.

## Section order (all children of `<main>`)

| # | Name | Selector | Scroll range | Height | Background | Interaction model |
|---|------|----------|--------------|--------|------------|-------------------|
| 1 | Hero | `section.mh-hero` | 0 – 900 | 900 | `#EFEBE3` | mouse-parallax on 3D props |
| 2 | About | `section.ma-about#about-section` | 900 – 1800 | 900 | `#EFEBE3` | scroll-reveal + SVG arc draw |
| 3 | Projects | `section#projects-section` | 1800 – 2700 | 900 | aurora on `#000` | **GSAP ScrollTrigger pin + horizontal scrub** |
| 4 | Skills | `div#skills-section` | 2700 – 8100 | 5400 | `#EFEBE3` | **sticky pin, 6 states x 900px** |
| 5 | Experience | `section.xp-section#experience-section` | 8100 – 11196 | 3096 | `#000` | **3 stacking sticky cards** + marquee |
| 6 | Contact / footer | `section.footer-contact#contact-section` | 11196 – 12096 | 900 | `#EFEBE3` | hover states |

Section 6 is wrapped in `div.slant-track`.

## Fixed / sticky layers

| Element | Position | z-index | Notes |
|---|---|---|---|
| custom cursor dot | `fixed` | 9999 | `opacity: 0` until first `mousemove` |
| custom cursor ring | `fixed` | 10000 | `transition: opacity .18s` |
| `.sk-grid` | `sticky top:0` | auto | pins for 4500px |
| `.xp-mark-wrap` | `sticky top:0` | 0 | marquee behind cards |
| `.xp-card-slot` x3 | `sticky top:306px` | 1,2,3 | stack: later card covers earlier |

## Page-level layout notes

- Nothing horizontally overflows the document; `#projects-section` is `overflow:hidden`
  and clips a 2333px-wide flex track down to the 1440px viewport.
- Two colour worlds: cream `#EFEBE3` (hero, about, skills, contact) and black `#000`
  (projects aurora, experience). No cross-fade between them — hard cuts at section edges.
