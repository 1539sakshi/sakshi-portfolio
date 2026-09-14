"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SlantRevealProps {
  children: ReactNode;
  /** Depth of the diagonal cut, in vh. The site's footer uses 22. */
  depth?: number;
}

/**
 * Scroll-driven diagonal top edge (the site's `.slant-track` pattern).
 *
 * The top-left corner is cut down by `depth * progress` vh, so the section
 * enters behind a diagonal wedge:
 *
 *   clip-path: polygon(0 <depth*progress>vh, 100% 0, 100% 100%, 0 100%)
 *
 * IMPORTANT: progress must come from ScrollTrigger, not a `window` scroll
 * listener. Lenis suppresses native scroll events (it carries a
 * `_preventNextNativeScrollEvent` flag), so a `window.addEventListener("scroll")`
 * version of this never fires once and the clip stays a flat rectangle.
 * ScrollTrigger is already fed by Lenis in SmoothScroll, so it updates properly.
 *
 * `start: "top bottom"` / `end: "top top"` reproduces the original's
 * `clamp((innerHeight - trackTop) / innerHeight, 0, 1)` exactly.
 *
 * Whatever is wrapped needs enough top padding to clear the cut.
 */
export function SlantReveal({ children, depth = 22 }: SlantRevealProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const flat = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stage.style.clipPath = flat;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const apply = (progress: number) => {
      stage.style.clipPath = `polygon(0 ${depth * progress}vh, 100% 0, 100% 100%, 0 100%)`;
    };

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top bottom",
      end: "top top",
      invalidateOnRefresh: true,
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });
    apply(trigger.progress);

    return () => {
      trigger.kill();
    };
  }, [depth]);

  return (
    <div ref={trackRef} className="slant-track">
      <div ref={stageRef} className="slant-stage">
        {children}
      </div>
      <style>{`
        .slant-track { position: relative; }
        .slant-stage { position: relative; will-change: clip-path; }
      `}</style>
    </div>
  );
}
