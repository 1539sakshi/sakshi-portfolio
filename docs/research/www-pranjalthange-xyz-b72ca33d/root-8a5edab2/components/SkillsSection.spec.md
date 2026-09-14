# SkillsSection — component spec

Source of truth: `../page-source.chunk.js`, module `40245` (byte ~54908 onward).
Behavior notes: `../BEHAVIORS.md` § "Section 4 — Skills". Topology: `../PAGE_TOPOLOGY.md` row 4.

## Structure

```
div#skills-section            position:relative; height:600vh; background:#EFEBE3
└─ div.sk-grid                position:sticky; top:0; height:100vh; overflow:hidden
   │                          display:grid; grid-template-columns:0.7fr 1fr 0.9fr
   │                          align-items:center; padding:0 6vw; gap:3vw
   ├─ div.sk-curve            position:relative; width:380; height:100vh; margin-left:-4vw
   │  └─ div                  position:absolute; left:0; bottom:0; 380x1600
   │     ├─ svg 380x1600 viewBox="0 0 380 1600"  style="position:absolute;inset:0;overflow:visible"
   │     │  ├─ path (base)    stroke #C9C5BD, width 2.5
   │     │  └─ path (draw)    stroke #151310, width 3.5, linecap round, dasharray "0 9999"
   │     └─ 6 × marker div    absolute, 56x56, border-radius 50%, flex-centered,
   │                          font-family var(--font-display), italic, 700, will-change:transform
   ├─ div.sk-panel            max-width:42ch
   │  ├─ span (eyebrow)       11px/700/0.22em uppercase #6b665c, margin-bottom 1rem — "Category NN"
   │  ├─ h3                   var(--font-display) 700 clamp(32px,3.6vw,52px)/1.08 #0A0A0A
   │  ├─ p                    margin-top 1.1rem, var(--font-body) clamp(13px,0.95vw,15px)/1.6 #57534A, max-width 36ch
   │  └─ div.sk-tags-row      flex, wrap, gap .8rem, margin-top 2rem → .sk-tag pills
   └─ div                     (empty third grid column)
+ inline <style> with the @media (max-width:900px) block
```

Section height is `${100 * SKILLS.length}vh` = 600vh (5400px at a 900px viewport),
matching the measured 2700–8100 scroll range.

## Arc geometry

Generated in source by:

```js
const c = (a) => `${(-310 + 620 * Math.cos(a)).toFixed(2)} ${(980 + 620 * Math.sin(a)).toFixed(2)}`;
const d = `M ${c(1.25)} A 620 620 0 0 0 ${c(-1.25)}`;
```

Resolved (hardcoded in the component): `M -114.50 1568.37 A 620 620 0 0 0 -114.50 391.63`.

## Scroll driver

CSS `position:sticky` does the pinning. ScrollTrigger supplies only the progress value:

```js
ScrollTrigger.create({
  trigger: sectionEl, start: "top top", end: "bottom bottom", scrub: 0.35,
  onUpdate: (self) => apply(self.progress * (COUNT - 1) * 115), // travel = 575
});
```

`apply(offset)` per marker `i`:

- `s = 430 + offset - 115 * i`
- `clamped = clamp(s, 0, path.getTotalLength())`
- `pt = path.getPointAtLength(clamped)`
- `marker.style.transform = translate3d(pt.x px, pt.y px, 0) translate(-50%, -50%)`

**Active index** = the `i` minimising `|s - 430|` (first-wins on ties, since the
comparison is strict `<`). Because `s - 430 = offset - 115i`, marker `i` is active
when `offset ≈ 115i`, i.e. at progress `i/5` — six states across the pinned range.

**Progress draw** on the overlay path:

```js
const drawn = Math.max(0, Math.min(total, 430 + offset) - 430);
drawPath.style.strokeDasharray = `${drawn} ${total}`;
drawPath.style.strokeDashoffset = "-430";
```

## Active vs inactive marker styling (imperative)

| property     | active        | inactive              |
| ------------ | ------------- | --------------------- |
| width/height | 72px          | 56px                  |
| background   | `#151310`     | `#EFEBE3`             |
| borderColor  | `transparent` | `rgba(10,10,10,0.4)`  |
| borderWidth  | `0px`         | `2px`                 |
| color        | `#F5F1E8`     | `rgba(10,10,10,0.75)` |
| fontSize     | `19px`        | `14px`                |

`marker.dataset.active = "1" | "0"` is set alongside.

## Panel reveal (runs on every active-index change)

- panel: `fromTo({opacity:0, y:16}, {opacity:1, y:0, duration:.5, ease:EASE.reveal})`
- `.sk-tag`: `fromTo({opacity:0, y:10}, {opacity:1, y:0, duration:.4, ease:EASE.reveal, stagger:.05, delay:.1})`

## Reduced motion

`window.matchMedia("(prefers-reduced-motion: reduce)")` is read in both effects.
When it matches: the arc effect calls `apply(0)` once and creates **no** ScrollTrigger
(so the rail is static on category 01), and the panel reveal effect returns early.

## Responsive — `@media (max-width: 900px)` (verbatim from the inline `<style>`)

```css
.sk-grid { grid-template-columns: 1fr !important; justify-items: center; text-align: center; padding-top: 4vh !important; }
.sk-curve { display: none !important; }
.sk-panel { margin: 0 auto; }
.sk-panel p { margin-left: auto; margin-right: auto; }
.sk-tags-row { justify-content: center; }
```

The arc rail is dropped entirely below 900px (source comment: the dot positions come from
`getPointAtLength()` on a path drawn for a 1600px bottom-anchored desktop column and do not
rescale cleanly into a short mobile box).

## Content

| #   | Category | Tags                                            |
| --- | -------- | ----------------------------------------------- |
| 01  | Language | TypeScript, JavaScript, Python, SQL             |
| 02  | Frontend | React, Next.js, Tailwind CSS, GSAP, Three.js    |
| 03  | Backend  | Node.js, Express.js, WebSockets, REST APIs      |
| 04  | Database | PostgreSQL, MongoDB, Prisma, Redis              |
| 05  | AI / ML  | NumPy, Pandas, Scikit-learn, Matplotlib         |
| 06  | Tools    | Git, AWS, Vercel, Figma, Linux                  |

Descriptions are copied verbatim (em-dashes preserved) into `SKILLS` in the component.

## Deviations from source

- `EASE.reveal` lives in a separate minified module (`90611`) whose value is not present in
  the saved chunk. Substituted `"power3.out"`, which matches the eases used elsewhere on the
  page (`BEHAVIORS.md` records `power3.out` for the projects card reveal).
