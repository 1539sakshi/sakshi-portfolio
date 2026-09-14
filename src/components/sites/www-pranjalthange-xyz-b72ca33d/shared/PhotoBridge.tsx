"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PHOTO_SRC =
  "/sites/www-pranjalthange-xyz-b72ca33d/root-8a5edab2/images/portrait.jpg";

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * Hero -> About photo bridge, ported from the target site.
 *
 * The portrait is a single element that does NOT live inside either section.
 * It starts pinned (`position: fixed`) over the hero's invisible
 * `[data-photo-anchor="hero"]` slot and, as #about-section scrolls up from the
 * bottom of the viewport to the top, it flies into the about slot while
 * spinning a full turn and fading from greyscale to colour. At progress 1 it
 * parks as `position: absolute` so it scrolls away with the page.
 *
 * Driven by:
 *   ScrollTrigger { trigger: #about-section, start: "top bottom",
 *                   end: "top top", scrub: 0.6, invalidateOnRefresh: true }
 */
export function PhotoBridge() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const img = imgRef.current;
    const heroAnchor = document.querySelector('[data-photo-anchor="hero"]');
    const aboutAnchor = document.querySelector('[data-photo-anchor="about"]');
    const aboutSection = document.getElementById("about-section");
    if (!img || !aboutAnchor || !aboutSection) return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.set(img, {
      opacity: 0,
      visibility: "hidden",
      display: "block",
    });

    const parkAtAbout = (zIndex?: number) => {
      const r = aboutAnchor.getBoundingClientRect();
      gsap.set(img, {
        position: "absolute",
        top: r.top + window.scrollY,
        left: r.left + window.scrollX,
        width: r.width,
        height: r.height,
        rotateY: 0,
        rotateX: 0,
        filter: "grayscale(0) contrast(1)",
        ...(zIndex === undefined ? {} : { zIndex }),
      });
    };

    // Mobile: no flight, the portrait simply sits in the about slot.
    if (window.matchMedia("(max-width: 480px)").matches) {
      const park = () => {
        parkAtAbout(2);
        gsap.set(img, {
          borderRadius: 10,
          boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
          objectFit: "cover",
          opacity: 1,
          visibility: "visible",
        });
      };
      park();
      window.addEventListener("resize", park);
      return () => window.removeEventListener("resize", park);
    }

    if (!heroAnchor) return;

    const start = heroAnchor.getBoundingClientRect();
    gsap.set(img, {
      position: "fixed",
      top: start.top,
      left: start.left,
      width: start.width,
      height: start.height,
      borderRadius: 10,
      boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
      zIndex: 5,
      pointerEvents: "none",
      rotateY: 0,
      rotateX: 0,
      transformPerspective: 700,
      filter: "grayscale(1) contrast(1.05)",
      objectFit: "cover",
      opacity: 1,
      visibility: "visible",
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      parkAtAbout();
      return;
    }

    let trigger: ScrollTrigger | null = null;
    let parked = false;

    const apply = (progress: number) => {
      if (progress >= 1) {
        parked = true;
        parkAtAbout();
        return;
      }
      if (parked) {
        parked = false;
        gsap.set(img, { position: "fixed" });
      }
      const from = heroAnchor.getBoundingClientRect();
      const to = aboutAnchor.getBoundingClientRect();
      gsap.set(img, {
        top: lerp(from.top, to.top, progress),
        left: lerp(from.left, to.left, progress),
        width: lerp(from.width, to.width, progress),
        height: lerp(from.height, to.height, progress),
        rotateY: 360 * progress,
        rotateX: 10 * Math.sin(progress * Math.PI * 2),
        filter: `grayscale(${1 - progress}) contrast(${lerp(1.05, 1, progress)})`,
      });
    };

    const build = () => {
      trigger?.kill();
      trigger = ScrollTrigger.create({
        trigger: aboutSection,
        start: "top bottom",
        end: "top top",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });
      apply(trigger.progress);
    };

    build();
    const reveal = () => setReady(true);
    // The original waits a beat before refreshing so fonts/images have settled.
    const settle = window.setTimeout(() => {
      ScrollTrigger.refresh();
      requestAnimationFrame(reveal);
    }, 300);
    window.addEventListener("resize", build);

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("resize", build);
      trigger?.kill();
    };
  }, []);

  return (
    // A plain <img>: the bridge drives position/size/filter imperatively via
    // GSAP, which next/image's own layout wrapper would fight.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={PHOTO_SRC}
      alt="Sakshi Singh"
      style={{
        opacity: ready ? 1 : 0,
        visibility: ready ? "visible" : "hidden",
        display: "block",
      }}
    />
  );
}
