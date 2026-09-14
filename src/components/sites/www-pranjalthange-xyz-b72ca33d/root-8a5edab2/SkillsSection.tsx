"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SkillCategory {
  index: string;
  category: string;
  description: string;
  tags: string[];
}

const SKILLS: SkillCategory[] = [
  {
    index: "01",
    category: "Language",
    description:
      "The foundation — writing clean, typed code across the languages I reach for daily.",
    tags: ["JavaScript (ES6+)", "TypeScript", "OOJS", "HTML5", "CSS3", "Sass/SCSS"],
  },
  {
    index: "02",
    category: "Frontend",
    description:
      "Building interfaces that feel alive — from layout systems to the motion layered on top.",
    tags: [
      "React.js",
      "Next.js",
      "React Native",
      "React Hooks",
      "React Router",
      "Tailwind CSS",
      "Bootstrap",
    ],
  },
  {
    index: "03",
    category: "State & Data",
    description:
      "Keeping client and server state predictable as a product grows past its first users.",
    tags: ["Redux", "Redux Toolkit", "Zustand", "TanStack Query", "Axios", "REST APIs"],
  },
  {
    index: "04",
    category: "Architecture & Patterns",
    description:
      "Designing scalable frontend systems with a strong focus on modularity, resilience, and performance.",
    tags: [
      "Micro-Frontends",
      "Module Federation",
      "WebSockets",
      "Service Workers",
      "Offline Caching",
      "Design Systems",
    ],
  },
  {
    index: "05",
    category: "Testing",
    description:
      "Unit, component and end-to-end coverage so refactors stay safe.",
    tags: ["Jest", "React Testing Library", "Cypress", "Jasmine", "Mocha"],
  },
  {
    index: "06",
    category: "Build & Tooling",
    description:
      "The everyday stack that keeps shipping fast and reproducible.",
    tags: [
      "Webpack",
      "Figma",
      "Git",
      "GitHub",
      "NPM",
      "Yarn",
      "Chrome DevTools",
      "Postman",
      "JIRA",
    ],
  },
];

const COUNT = SKILLS.length;

// Arc geometry (verbatim from source):
//   c = (a) => `${(-310 + 620 * Math.cos(a)).toFixed(2)} ${(980 + 620 * Math.sin(a)).toFixed(2)}`
//   d = `M ${c(1.25)} A 620 620 0 0 0 ${c(-1.25)}`
const ARC_D = "M -114.50 1568.37 A 620 620 0 0 0 -114.50 391.63";

// Arc length at which a marker counts as "active".
const ACTIVE_AT = 430;
// Arc-length spacing between consecutive markers.
const MARKER_GAP = 115;

export function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const basePathRef = useRef<SVGPathElement | null>(null);
  const drawPathRef = useRef<SVGPathElement | null>(null);
  const markersRef = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const panel = panelRef.current;
    const basePath = basePathRef.current;
    const drawPath = drawPathRef.current;
    if (!section || !panel || !basePath || !drawPath) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = basePath.getTotalLength();

    const apply = (offset: number) => {
      let nextActive = 0;
      let best = Infinity;

      markersRef.current.forEach((marker, i) => {
        if (!marker) return;
        const s = ACTIVE_AT + offset - MARKER_GAP * i;
        const clamped = Math.min(total, Math.max(0, s));
        const point = basePath.getPointAtLength(clamped);
        marker.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`;
        const dist = Math.abs(s - ACTIVE_AT);
        if (dist < best) {
          best = dist;
          nextActive = i;
        }
      });

      markersRef.current.forEach((marker, i) => {
        if (!marker) return;
        const isActive = i === nextActive;
        const size = isActive ? 72 : 56;
        marker.style.width = `${size}px`;
        marker.style.height = `${size}px`;
        marker.style.background = isActive ? "#151310" : "#EFEBE3";
        marker.style.borderColor = isActive ? "transparent" : "rgba(10,10,10,0.4)";
        marker.style.borderWidth = isActive ? "0px" : "2px";
        marker.style.color = isActive ? "#F5F1E8" : "rgba(10,10,10,0.75)";
        marker.style.fontSize = isActive ? "19px" : "14px";
        marker.dataset.active = isActive ? "1" : "0";
      });

      const drawn = Math.max(0, Math.min(total, ACTIVE_AT + offset) - ACTIVE_AT);
      drawPath.style.strokeDasharray = `${drawn} ${total}`;
      drawPath.style.strokeDashoffset = "-430";

      if (nextActive !== activeRef.current) {
        activeRef.current = nextActive;
        setActive(nextActive);
      }
    };

    if (reduced) {
      apply(0);
      return;
    }

    const travel = (COUNT - 1) * MARKER_GAP;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.35,
      onUpdate: (self) => apply(self.progress * travel),
    });
    apply(0);

    return () => {
      trigger.kill();
    };
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      panel,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
    );
    const tags = panel.querySelectorAll(".sk-tag");
    gsap.fromTo(
      tags,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power3.out",
        stagger: 0.05,
        delay: 0.1,
      },
    );
  }, [active]);

  const current = SKILLS[active];

  return (
    <div
      ref={sectionRef}
      id="skills-section"
      style={{
        position: "relative",
        height: `${100 * COUNT}vh`,
        background: "radial-gradient(circle at top, rgba(10,10,10,0.04), rgba(239,235,227,0.96) 32%, #EFEBE3 100%)",
      }}
    >
      <div
        className="sk-grid"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "0.7fr 1fr 0.9fr",
          alignItems: "center",
          padding: "0 6vw",
          gap: "3vw",
        }}
      >
        <div
          className="sk-curve"
          style={{ position: "relative", width: 380, height: "100vh", marginLeft: "-4vw" }}
        >
          <div style={{ position: "absolute", left: 0, bottom: 0, width: 380, height: 1600 }}>
            <svg
              width={380}
              height={1600}
              viewBox="0 0 380 1600"
              style={{ position: "absolute", inset: 0, overflow: "visible" }}
            >
              <path ref={basePathRef} d={ARC_D} fill="none" stroke="#C9C5BD" strokeWidth={2.5} />
              <path
                ref={drawPathRef}
                d={ARC_D}
                fill="none"
                stroke="#151310"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeDasharray="0 9999"
              />
            </svg>
            {SKILLS.map((skill, i) => (
              <div
                key={skill.index}
                ref={(el) => {
                  markersRef.current[i] = el;
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#EFEBE3",
                  borderStyle: "solid",
                  borderColor: "rgba(10,10,10,0.4)",
                  borderWidth: "2px",
                  color: "rgba(10,10,10,0.75)",
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: 700,
                  willChange: "transform",
                }}
              >
                {skill.index}
              </div>
            ))}
          </div>
        </div>

        <div
          ref={panelRef}
          className="sk-panel"
          style={{
            maxWidth: "42ch",
            padding: "2.2rem 2rem 1.8rem",
            borderRadius: "28px",
            background: "rgba(255,255,255,0.36)",
            border: "1px solid rgba(10,10,10,0.12)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 28px 80px rgba(10,10,10,0.08)",
          }}
        >
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#6b665c",
              marginBottom: "1rem",
            }}
          >
            Category {current.index}
          </span>
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(34px, 3.9vw, 58px)",
              lineHeight: 1.04,
              letterSpacing: "-0.04em",
              color: "#0A0A0A",
            }}
          >
            {current.category}
          </h3>
          <p
            style={{
              marginTop: "1.1rem",
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 0.95vw, 15px)",
              lineHeight: 1.7,
              color: "#57534A",
              maxWidth: "36ch",
            }}
          >
            {current.description}
          </p>
          <div
            className="sk-tags-row"
            style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "2rem" }}
          >
            {current.tags.map((tag) => (
              <span
                key={tag}
                className="sk-tag"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(14px, 1vw, 16px)",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  color: "#0A0A0A",
                  background: "rgba(10,10,10,0.04)",
                  border: "1px solid rgba(10,10,10,0.12)",
                  padding: "0.7em 1.15em",
                  borderRadius: "999px",
                  whiteSpace: "nowrap",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div />
      </div>
      <style>{`
        @media (max-width: 900px) {
          .sk-grid {
            grid-template-columns: 1fr !important;
            justify-items: center;
            text-align: center;
            padding-top: 4vh !important;
          }
          .sk-curve { display: none !important; }
          .sk-panel { margin: 0 auto; }
          .sk-panel p { margin-left: auto; margin-right: auto; }
          .sk-tags-row { justify-content: center; }
        }
      `}</style>
    </div>
  );
}
