"use client";

import { useEffect, useRef, type RefObject } from "react";

interface ProjectCursorProps {
  /** The element the cursor takes over. The cursor only shows inside it. */
  containerRef: RefObject<HTMLElement | null>;
  /** Render the "hover" label inside the ring when enlarged. */
  showLabel?: boolean;
}

const IDLE = 26;
const HOVER = 120;

/**
 * Container-scoped custom cursor, ported verbatim from the target site.
 *
 * Two fixed layers: a `mix-blend-mode: difference` dot (z-9999) and a label ring
 * (z-10000). Both are hidden until the pointer enters `containerRef`. Over a
 * heading or paragraph the cursor swells 26px -> 120px.
 *
 * Motion is a hand-rolled RAF lerp, not a transition:
 *   position lerp factor 0.18, size lerp factor 0.065.
 */
export function ProjectCursor({ containerRef, showLabel = true }: ProjectCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!container || !dot || !label) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let w = IDLE;
    let h = IDLE;
    let targetW = IDLE;
    let targetH = IDLE;
    let inside = false;
    let big = false;
    let frame = 0;

    dot.style.background = "transparent";
    dot.style.border = "1.5px solid rgba(255,255,255,0.85)";

    const setBig = (next: boolean) => {
      big = next;
      label.textContent = next && showLabel ? "hover" : "";
    };

    const isTextTarget = (el: Element | null): boolean => {
      if (!(el instanceof Element) || !container.contains(el)) return false;
      let node: HTMLElement | null = el as HTMLElement;
      while (node && node !== container) {
        const tag = node.tagName?.toLowerCase() ?? "";
        if (
          tag === "a" ||
          tag === "button" ||
          node.classList.contains("proj-cta") ||
          node.classList.contains("proj-cta-muted") ||
          node.dataset?.noProjectCursor !== undefined
        ) {
          break;
        }
        if (tag === "h2" || tag === "h3" || tag === "p") return true;
        node = node.parentElement;
      }
      return false;
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const onEnter = () => {
      inside = true;
      x = targetX;
      y = targetY;
      dot.style.opacity = "1";
      label.style.opacity = "1";
      container.style.cursor = "none";
    };

    const onLeave = () => {
      inside = false;
      targetW = IDLE;
      targetH = IDLE;
      setBig(false);
      dot.style.opacity = "0";
      label.style.opacity = "0";
      container.style.cursor = "";
    };

    const loop = () => {
      if (inside) {
        const next = isTextTarget(document.elementFromPoint(targetX, targetY));
        if (next !== big) {
          targetW = next ? HOVER : IDLE;
          targetH = next ? HOVER : IDLE;
          setBig(next);
        }
      }
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      w += (targetW - w) * 0.065;
      h += (targetH - h) * 0.065;

      const transform = `translate3d(${x - 0.5 * w}px, ${y - 0.5 * h}px, 0)`;
      dot.style.transform = transform;
      dot.style.width = `${w}px`;
      dot.style.height = `${h}px`;
      label.style.transform = transform;
      label.style.width = `${w}px`;
      label.style.height = `${h}px`;
      frame = requestAnimationFrame(loop);
    };

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("mousemove", onMove, { passive: true });
    frame = requestAnimationFrame(loop);

    return () => {
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
      dot.style.opacity = "0";
      container.style.cursor = "";
    };
  }, [containerRef, showLabel]);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: IDLE,
          height: IDLE,
          borderRadius: "50%",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          transition: "opacity 0.3s ease",
          willChange: "transform, width, height",
        }}
      />
      <span
        ref={labelRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 10000,
          opacity: 0,
          borderRadius: "50%",
          transition: "opacity 0.18s ease",
          fontFamily: "var(--font-body)",
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#000000",
          userSelect: "none",
          willChange: "transform, width, height",
        }}
      />
    </>
  );
}
