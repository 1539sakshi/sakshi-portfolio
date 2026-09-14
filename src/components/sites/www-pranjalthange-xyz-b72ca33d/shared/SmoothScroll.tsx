"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis smooth scroll, wired into GSAP's ticker and ScrollTrigger.
 *
 * The target site runs Lenis (its <html> carries `class="lenis"`) and drives every
 * scroll-linked animation through it. Native scrolling feels noticeably different,
 * so this is load-bearing for fidelity, not decoration.
 *
 * It also exposes the instance on window.__lenis, matching the original — the hero
 * nav links call `window.__lenis.scrollTo(el, { duration: 1.4 })`.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ autoRaf: false });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    // ScrollTrigger's pin inserts a spacer, which changes document height after
    // Lenis has already cached it. Without this, Lenis scrolls against a stale
    // limit and the pinned projects section feels sticky/rubbery near its edges.
    const syncHeight = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", syncHeight);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis");

    return () => {
      ScrollTrigger.removeEventListener("refresh", syncHeight);
      gsap.ticker.remove(tick);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
      delete window.__lenis;
    };
  }, []);

  return null;
}
