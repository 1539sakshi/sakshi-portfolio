# Behaviors — pranjalthange.xyz (root)

## How this was extracted (important for anyone re-running this)

The site runs **Lenis** smooth scroll plus **GSAP ScrollTrigger**. Two traps:

1. `window.scrollTo()` moves native scroll and CSS `sticky` responds, but Lenis's internal
   scroll value does **not** update, so every JS-driven behavior stays frozen at its initial
   state. Measuring this way silently produces a "nothing animates" reading. **Wrong.**
2. Synthetic `WheelEvent`s are ignored (Lenis requires trusted events).

The working handle is **`window.__lenis`** (not `window.lenis`, which is only `{version}`):
`window.__lenis.scrollTo(y, { immediate: true })`. Even then, GSAP `scrub` tweens interpolate
over time, so a hard jump does not settle the projects track — its behavior was recovered from
the app's own JS chunk instead (saved as `page-source.chunk.js`).

## Global

- **Smooth scroll:** Lenis, `html.lenis`. A clone must use Lenis or the feel is visibly wrong.
- **Custom cursor:** two `position:fixed` layers (dot z-9999, ring z-10000), both
  `opacity:0` until first `mousemove`. Ring `transition: opacity .18s`, dot `.3s`.
- **Theme:** `<html class="dark">` is set but the page is a hard-coded two-palette design;
  there is no light/dark toggle.

## Section 1 — Hero

- `.star-3d` and `.bolt-3d` (2550x2550 PNGs, `position:absolute`, `z-index:3`) sit inside
  `.mh-headline-wrap` behind/around the "PRANJAL THANGE" headline.
- Mouse parallax on the aurora layer via `gsap.quickTo(el,'x'|'y',{duration:2.2,ease:'power2.out'})`:
  `x = -((clientX/innerWidth - .5) * 28)`, `y = -((clientY/innerHeight - .5) * 18)`.

## Section 3 — Projects  ← the one that is easy to get wrong

**INTERACTION MODEL: scroll-driven horizontal scrub with a GSAP ScrollTrigger pin.**
It is *not* a click carousel, *not* a drag slider, and *not* auto-advancing (verified: no
change over 7s of idle observation).

- `.proj-track` is `display:flex; height:100vh; will-change:transform`, content width
  **2333px** against a 1440px viewport = **893px of horizontal travel**.
- Children: `.proj-intro-panel` (`width:30vw`, `height:60vh`, `padding:12vh 4vw 6vh 6vw`)
  then 3x `article.proj-card` (`width:44vw`, `flexShrink:0`, `height:60vh`, `padding:3vh 3.5vw`).
- **Progress bar:** `R.current.style.transform = scaleX(progress)` — a 120x1.5px rail
  `rgba(255,255,255,0.2)` with a 32px white thumb.
- **Counter `.proj-foot`:** recomputed every tick as `NN / 03`. Rule from source: if
  `progress >= .95` the index is the card count; otherwise the index is the last card whose
  `parentElement.offsetLeft - scrollOffset < 0.55 * window.innerWidth`.
  - `onLeave`: `gsap.to(foot,{opacity:0,duration:.25,ease:'power2.in'})`
  - `onEnterBack`: `gsap.to(foot,{opacity:1,duration:.25,ease:'power2.out'})`
- **Card reveal:** `.card-reveal` starts `opacity:0; transform:translateY(16px); filter:blur(6px)`
  and animates in with `duration:.9, ease:'power3.out', stagger:.07`.
- **Aurora background** (exact, from source):
  ```
  background: repeating-linear-gradient(100deg, #e85002 10%, #c10801 17%, #4e8d8a 24%, #ff8200 31%, #7a1a00 38%);
  background-size: 250% 300%;
  filter: blur(12px);
  opacity: .85;
  mix-blend-mode: screen;
  animation: aurora-flow 22s linear infinite;
  mask-image: radial-gradient(ellipse 75% 130% at 103% -5%, black 0%, black 15%, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.08) 72%, transparent 88%);
  ```
  on a `position:absolute; inset:-10px` layer inside a `background:#000` box.

## Section 4 — Skills

**INTERACTION MODEL: sticky pin, scroll-driven state index.** Verified by stepping
`__lenis` through the range and reading the rendered category.

- `.sk-grid` is `position:sticky; top:0; height:900px` inside a 5400px-tall parent.
- 6 categories over 4500px of travel = **exactly 900px per category**:
  `index = clamp(floor((scrollY - 2700) / 900), 0, 5)`.

| index | scrollY | Category | Heading |
|---|---|---|---|
| 0 | 2700–3600 | Category 01 | Language |
| 1 | 3600–4500 | Category 02 | Frontend |
| 2 | 4500–5400 | Category 03 | Backend |
| 3 | 5400–6300 | Category 04 | Database |
| 4 | 6300–7200 | Category 05 | AI / ML |
| 5 | 7200–8100 | Category 06 | Tools |

The `01`–`06` rail is **not** an opacity effect (all six measure `opacity:1` at every scroll
position). From source, the six markers are positioned along an **SVG arc** of radius 620
(`M -114.50 1568.37 A 620 620 0 0 0 -114.50 391.63`, rendered in a 380x1600 viewBox) via
`path.getPointAtLength()`, and the active one is styled by **size and colour**:

| property | active | inactive |
|---|---|---|
| width / height | `72px` | `56px` |
| background | `#151310` | `#EFEBE3` |
| border | none, `0px` | `2px solid rgba(10,10,10,0.4)` |
| color | `#F5F1E8` | `rgba(10,10,10,0.75)` |
| font-size | `19px` | `14px` |

Marker `i` is placed at arc length `430 + scrollProgress - 115*i`, clamped to `[0, totalLength]`;
the active index is the marker whose distance from arc length `430` is smallest. Each marker gets
`transform: translate3d(x, y, 0) translate(-50%, -50%)` and `data-active="1"|"0"`.

The rail also honours `prefers-reduced-motion: reduce` (read via `matchMedia` in the source).

### Skills content (verbatim from source)

| # | Category | Description | Tags |
|---|---|---|---|
| 01 | Language | The foundation — writing clean, typed code across the languages I reach for daily. | TypeScript, JavaScript, Python, SQL |
| 02 | Frontend | Building interfaces that feel alive — from layout systems to the motion layered on top. | React, Next.js, Tailwind CSS, GSAP, Three.js |
| 03 | Backend | APIs and services that hold up under real traffic. | Node.js, Express.js, WebSockets, REST APIs |
| 04 | Database | Modeling data so it stays fast and correct as a product grows past its first users. | PostgreSQL, MongoDB, Prisma, Redis |
| 05 | AI / ML | Turning raw data into something a product can actually act on. | NumPy, Pandas, Scikit-learn, Matplotlib |
| 06 | Tools | The everyday stack that keeps shipping fast and reproducible. | Git, AWS, Vercel, Figma, Linux |

`.sk-tag` pill style: `font-size: clamp(15px, 1.05vw, 18px)`, `font-weight:700`,
`letter-spacing:.01em`, `color:#F5F1E8`, `background:#151310`, `border:1px solid #151310`,
`padding:.7em 1.5em`, `border-radius:999px`, `white-space:nowrap`.

## Section 5 — Experience

**INTERACTION MODEL: stacking sticky cards.**
- 3x `.xp-card-slot`, each `position:sticky; top:306px; height:702px`, z-index 1 / 2 / 3.
- Natural offsets 702px apart; as the page scrolls each successive card slides up and
  covers the previous one. Measured convergence: all three sit at `top:134` by scrollY 10000.
- `.xp-mark-wrap` is a `sticky top:0`, `z-index:0` marquee reading
  "WORK EXPERIENCE WORK EXPERIENCE" on two lines behind the cards.

## Responsive

- `.sk-grid` has a `@media (max-width: 900px)` block in an inline `<style>` (see chunk).
- `.proj-track` mobile override: `padding: 6vh 5vw 8vh; gap: 8vh;`.
- Track children are all `vw`/`vh`-sized, so they scale continuously rather than at breakpoints.
