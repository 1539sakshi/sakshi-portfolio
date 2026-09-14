# HeroSection — spec

Source of truth: `page-source.chunk.js`, module `94108` (the hero's own module; its
entire stylesheet ships inline in a `<style>` child of `section.mh-hero`).
Component: `src/components/sites/www-pranjalthange-xyz-b72ca33d/root-8a5edab2/HeroSection.tsx`

## DOM order (verbatim from source)

```
section.mh-hero
  div.mh-topbar
    span.mh-foot-tag        "//CURIOUS AND CREATING"
    nav.mh-nav              a.mh-nav-link x3
  div.mh-headline-wrap
    img.mh-sparkle          star-3d.png
    h1.mh-headline          "PRANJAL" <br> "THANGE"
    img.mh-bolt             bolt-3d.png
  div.mh-photo[data-photo-anchor="hero"]
  span.mh-foot-left         "©2026"
  div.mh-pill-stack         a.mh-pill-btn.mh-pill-icon (résumé) + a.mh-pill-btn x3
```

## Links (verbatim)

| Label | href |
|---|---|
| Work | `#projects-section` |
| Info | `#about-section` |
| Contact | `#contact-section` |
| GitHub | `https://github.com/pranjal270` |
| LinkedIn | `https://www.linkedin.com/in/pranjal-thange-324548365/` |
| LeetCode | `https://leetcode.com/u/pranjallt/` |

Nav click handler (verbatim): `document.querySelector(href)` → if found,
`preventDefault()`, then `window.__lenis.scrollTo(el, { duration: 1.4 })`, falling back to
`el.scrollIntoView({ behavior: "smooth" })`.

## Key style values (verbatim)

- `.mh-hero`: `min-height:100vh; background:#EFEBE3; color:#0A0A0A; overflow:hidden;
  display:flex; flex-direction:column; padding:3vh 3vw; cursor:auto`
- `.mh-nav`: `gap:1.8rem`; `.mh-nav-link`: `--font-body`, 13px/500, `letter-spacing:.06em`,
  uppercase, `opacity:.75` → 1 on hover, `transition:opacity .25s ease`
- `.mh-headline-wrap`: `flex:1; align-items:flex-start; justify-content:center; padding-top:4vh`
- `.mh-headline`: `margin-top:7vh`, `--font-hero-sans`, 800, uppercase,
  `font-size: clamp(58px, 12vw, 196px)`, `line-height:.92`, `letter-spacing:-0em`, centered
- `.mh-sparkle`: `top:9%; left:13%; width:clamp(55px,12vw,140px); z-index:3`
- `.mh-bolt`: `bottom:27%; right:17%; width:clamp(40px,20vw,160px); z-index:3`
- `.mh-photo`: `left:50%; bottom:12vh; translateX(-50%); width:clamp(120px,12vw,190px);
  aspect-ratio:3/4; z-index:2` (invisible anchor for the About-photo bridge)
- `.mh-foot-left`: `left:3vw; bottom:3vh`, 14px/500
- `.mh-foot-tag`: 12px/800, `letter-spacing:.04em`, uppercase
- `.mh-pill-stack`: `right:3vw; bottom:3vh; column; gap:.6rem; align-items:flex-end; z-index:3`
- `.mh-pill-btn`: `padding:.65em 1.4em; border-radius:999px; background:#0A0A0A;
  color:#EFEBE3;` 13px/600, `letter-spacing:.02em`, hover `opacity:.82`
- Breakpoints reproduced verbatim: `@media (max-width:768px)` and `@media (max-width:480px)`
  (480px stacks the topbar, moves the bolt to `bottom:40%; right:6%`, hides `.mh-photo`, and
  makes the headline wrap a centered column of sparkle → name → bolt with the props `position:static`).

## Mouse parallax

`gsap.quickTo(el,'x',{duration:2.2,ease:'power2.out'})` and the same for `'y'`, driven by
`x = -((clientX/innerWidth - .5) * 28)`, `y = -((clientY/innerHeight - .5) * 18)`,
`window.addEventListener('mousemove', fn, {passive:true})`, removed on cleanup.

## Deviations from source (deliberate)

1. **Parallax target.** In the shipped bundle this `quickTo` pair is attached to the Projects
   section's aurora layer (byte ~39663), not to the hero. Per the build brief it is applied
   here to a new `.mh-props` wrapper that holds both PNGs, so one transform drives both.
   `.mh-props` is `position:absolute; inset:0; z-index:3; pointer-events:none` — it changes no
   prop geometry (both keep their original absolute offsets). At ≤480px it becomes
   `display:contents` so the props take part in the source's mobile column layout; the GSAP
   transform is inert there, matching the source's `transform:none` on mobile.
2. **Résumé pill omitted.** The source's first pill is a 42x42 icon-only
   `a[href="/pranjal_resume.pdf"][download]`. No PDF asset was captured, so it is left out.
3. **Social pills carry a 14px icon** (`GitHubIcon` / `LinkedInIcon` / `LeetCodeIcon` from
   `shared/icons`) before the label, with `gap:.5em` added to `.mh-pill-btn`. The source pills
   are text-only.
4. `next/image` replaces the raw `<img>`; intrinsic size `2550x2550`, `priority`, `alt=""`.
   Image paths are repo-local: `/sites/www-pranjalthange-xyz-b72ca33d/root-8a5edab2/images/*.png`
   (source used `/star-3d.png`, `/bolt-3d.png`).
