# ProjectsSection — component spec

Source of truth: `../page-source.chunk.js` (module `53218`), `../BEHAVIORS.md` §"Section 3 — Projects",
`../PAGE_TOPOLOGY.md` row 3.

Implementation: `src/components/sites/www-pranjalthange-xyz-b72ca33d/root-8a5edab2/ProjectsSection.tsx`
Named export `ProjectsSection`. `'use client'`.

## Interaction model

GSAP **ScrollTrigger pin + horizontal scrub**. Not a carousel, not a drag slider, not
auto-advancing. Verified empirically (no change over 7s idle) and confirmed in the shipped chunk.

### ScrollTrigger config (verbatim from source)

```ts
ScrollTrigger.create({
  trigger: section,                                        // section#projects-section
  start: "top top",
  end: () => `+=${track.scrollWidth - window.innerWidth}`,  // 893px at 1440x900
  pin: true,
  anticipatePin: 1,
  scrub: 1,
  onUpdate, onLeave, onEnterBack,
})
```

### progress → translateX

```
span = track.scrollWidth - window.innerWidth      // 2333 - 1440 = 893
gsap.set(track, { x: -progress * span })
```
Pin duration equals `span`, so 1px of page scroll = 1px of horizontal travel.
`scrub: 1` adds a 1s lerp, so the track lags the raw scroll position.

## DOM structure

```
section#projects-section            position:relative; overflow:hidden
├─ div (auroraRef)                  position:absolute; inset:0; overflow:hidden; background:#000
│   └─ div                          inset:-10px; repeating-linear-gradient(100deg …);
│                                   background-size:250% 300%; blur(12px); opacity:.85;
│                                   mix-blend-mode:screen; animation:aurora-flow 22s linear infinite;
│                                   mask-image + -webkit-mask-image radial-gradient(…)
├─ div.proj-track                   flex; align-items:center; height:100vh; z-index:1; will-change:transform
│   ├─ div.proj-intro-panel         30vw / 60vh / padding 12vh 4vw 6vh 6vw
│   │   ├─ h2.proj-heading          "Projects", clamp(48px,6.5vw,100px), lh .95, ls -.03em, var(--fg)
│   │   └─ div.proj-scroll-indicator  120x1.5 rail + 32px white thumb + "Scroll" label
│   └─ article.proj-card × 3        44vw / 60vh / padding 3vh 3.5vw
│       └─ div (cardBodiesRef[i])   flex column, height 100%, gap 1.1rem
│           └─ 5 × .card-reveal     header row / h3 name / CTA / description / tag list
├─ div.proj-foot                    absolute bottom:5vh left/right:6vw, z-index 10
│   ├─ div.proj-progress-track > div.proj-progress-fill    scaleX(progress)
│   └─ div.proj-counter             `NN / 03`
└─ <style>                          .proj-cta, .proj-foot, @media blocks
```

## Per-tick work (`onUpdate`)

1. `gsap.set(track, { x: -progress * span })`.
2. **Card reveal**, once per card (`revealedRef` latch):
   threshold = `(card.parentElement.offsetLeft - 0.6 * innerWidth) / span`; when
   `progress >= threshold`, tween `.card-reveal` children to
   `{opacity:1, y:0, filter:'blur(0px)', pointerEvents:'auto', duration:.9, ease:'power3.out', stagger:.07}`.
   Initial state is `opacity:0; translateY(16px); blur(6px)`.
3. **Progress fill**: `fill.style.transform = scaleX(progress)`.
4. **Counter**: `progress >= .95` → index = card count; otherwise the last card whose
   `parentElement.offsetLeft - (progress*span) < 0.55 * innerWidth`, defaulting to 1.
   Rendered `${String(i).padStart(2,'0')} / ${String(n).padStart(2,'0')}`.

`onLeave` → `gsap.to(foot,{opacity:0,duration:.25,ease:'power2.in'})`;
`onEnterBack` → `gsap.to(foot,{opacity:1,duration:.25,ease:'power2.out'})`.

## Scroll-indicator thumb

The source animates the thumb as a **looping marquee**, not as a progress bar:
`gsap.set(thumb,{x:-thumbWidth})` then `timeline({repeat:-1}).to(thumb,{x:railWidth,duration:1.2,ease:'none'})`.
(The task brief described it as `scaleX(progress)`; that behavior belongs to `.proj-progress-fill`
in `.proj-foot`. Source wins — both are implemented as the source has them.)

## Aurora mouse parallax

`gsap.quickTo(auroraRef,'x'|'y',{duration:2.2,ease:'power2.out'})`, driven by a
`window` `mousemove` listener registered `{passive:true}`:
`x = -((clientX/innerWidth - .5) * 28)`, `y = -((clientY/innerHeight - .5) * 18)`.
Removed on unmount.

`@keyframes aurora-flow` already exists in `src/app/globals.css` and is **not** redefined here.

## Guards / cleanup

- `reduceMotion = matchMedia('(prefers-reduced-motion: reduce)')`
- `isMobile = matchMedia('(max-width: 1024px) and (orientation: portrait), (max-width: 768px)')`
- If either matches: **no pin, no scrub, no thumb loop, no parallax** — all `.card-reveal`
  elements are set visible and the CSS media block stacks the cards vertically.
- Cleanup collects every disposable into one `Killable[]` and calls `.kill()` on each:
  the ScrollTrigger instance, the thumb timeline, and the `mousemove` remover.

## Content (verbatim)

| # | Category | Name | Status | CTA |
|---|---|---|---|---|
| 01 | Developer Tools · Full Stack | FlagIt | live | `View Live ↗` → https://ffms-admin-dashboard.vercel.app/ |
| 02 | Creative Development · Frontend | Lazarev Agency UI | live | `View Live ↗` → https://lazarev-websiteclone.netlify.app/ |
| 03 | AI SaaS · DevTools · Cybersecurity | Ido | in-progress | `Coming Soon` (span, not a link) |

External links carry `target="_blank" rel="noopener noreferrer"`.
Card 03's tag list contains the sentinel `"__break__"`, rendered as
`<div style={{flexBasis:'100%',height:0}}/>` to force a wrap in the flex tag row — kept verbatim.
Card 03 also renders the right-aligned "In Progress" badge (`var(--accent)` text + border).

## Responsive (verbatim from the source's inline `<style>`)

- `@media (max-width: 768px), (max-width: 1024px) and (orientation: portrait)`:
  `.proj-track` becomes a column (`height:auto`, `padding:8vh 6vw 10vh`, `gap:10vh`);
  `.proj-intro-panel` full width, centered, no padding; `.proj-heading` centered;
  `.proj-scroll-indicator` hidden; `.proj-card` full width / auto height / no padding,
  `border-top:1px solid rgba(255,255,255,0.08)` + `padding-top:6vh`.
- `@media (max-width: 480px)`: `.proj-track { padding: 6vh 5vw 8vh; gap: 8vh; }`
- Same tablet/mobile query again: `.proj-foot { display: none; }`

## Notes / inferred

- The source wraps the CTA in `next/link`; a plain `<a>` is used here since the target is external.
- The source renders a `SectionLabel`-style child (`<a containerRef showLabel={false}>`, the shared
  custom-cursor helper) as the section's first child. It is page-global chrome, not part of this
  section's visuals, and is omitted — it was out of this component's scope.
- `--fg`, `--muted`, `--border`, `--accent`, `--font-hero-sans`, `--font-body` and `.font-label`
  are all provided by the `.site-pranjalthange` scope in `globals.css`; nothing new was added.
- `npx tsc --noEmit` passes clean.
