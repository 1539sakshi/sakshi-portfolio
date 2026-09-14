"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, JSX } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectCursor } from "@/components/sites/www-pranjalthange-xyz-b72ca33d/shared/ProjectCursor";

interface Project {
  index: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  href: string | null;
  status: "live" | "in-progress";
}

interface Killable {
  kill: () => void;
}

const PROJECTS: Project[] = [
  {
    index: "01",
    name: "Form Builder",
    description:
      "A dynamic form builder with reusable templates, conditional logic, validation, response tracking, and PDF export. Built for quick iteration and reliable form workflows in a frontend-heavy product environment.",
    category: "Developer Tools · Frontend",
    tags: ["React.js", "TypeScript", "Redux Toolkit", "Tailwind CSS"],
    href: "https://1539sakshi.github.io/formik/",
    status: "live",
  },
  {
    index: "02",
    name: "Innogeeks Website",
    description:
      "A responsive frontend in React.js integrated with a Django REST API backend, with role-based access controls for visitors, members and administrators.",
    category: "Full Stack · Web",
    tags: ["React.js", "Django", "AWS", "SQL"],
    href: "https://www.innogeeks.in/",
    status: "live",
  },
];

const REVEAL_HIDDEN: CSSProperties = {
  opacity: 0,
  transform: "translateY(16px)",
  filter: "blur(6px)",
};

function renderTag(tag: string): JSX.Element {
  if (tag === "__break__") {
    return <div key="__break__" style={{ flexBasis: "100%", height: 0 }} />;
  }
  return (
    <span
      key={tag}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "#F5F1E8",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        padding: "0.55em 0.9em",
        borderRadius: 999,
        backdropFilter: "blur(8px)",
      }}
    >
      {tag}
    </span>
  );
}

function showReveals(el: HTMLDivElement | null): void {
  if (!el) return;
  gsap.set(el.querySelectorAll(".card-reveal"), {
    opacity: 1,
    y: 0,
    filter: "none",
    pointerEvents: "auto",
  });
}

function hideReveals(el: HTMLDivElement | null): void {
  if (!el) return;
  gsap.set(el.querySelectorAll(".card-reveal"), {
    opacity: 0,
    y: 16,
    filter: "blur(6px)",
    pointerEvents: "none",
  });
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const auroraRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLDivElement | null>(null);
  const cardBodiesRef = useRef<Array<HTMLDivElement | null>>([]);
  const revealedRef = useRef<boolean[]>([false, false, false]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia(
      "(max-width: 1024px) and (orientation: portrait), (max-width: 768px)",
    ).matches;

    const cleanups: Killable[] = [];
    const cards = cardBodiesRef.current;

    cards.forEach(hideReveals);

    // Mobile / reduced motion: no pin, no horizontal scrub — cards stack and stay visible.
    if (reduceMotion || isMobile) {
      cards.forEach(showReveals);
      return;
    }

    const thumb = thumbRef.current;
    if (thumb) {
      const thumbWidth = thumb.offsetWidth;
      const railWidth = thumb.parentElement?.offsetWidth ?? 120;
      gsap.set(thumb, { x: -thumbWidth });
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(thumb, { x: railWidth, duration: 1.2, ease: "none" });
      cleanups.push({ kill: () => tl.kill() });
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${track.scrollWidth - window.innerWidth}`,
      pin: true,
      // pinSpacing is deliberately left at its default (true). The source uses
      // `pin:!0, anticipatePin:1, scrub:1` with no pinSpacing key, so GSAP adds
      // a spacer equal to the horizontal travel. Setting it to false makes the
      // page total match the original's 12096px, but the pin then has no room:
      // it engages and releases mid-range and the skills section rides up over
      // the pinned panel. Correct behaviour beats a matching height number.
      anticipatePin: 1,
      scrub: 1,
      onUpdate: (self) => {
        const span = track.scrollWidth - window.innerWidth;
        gsap.set(track, { x: -self.progress * span });

        cards.forEach((card, i) => {
          if (!card || revealedRef.current[i]) return;
          const threshold = (i + 1) / (cards.length + 1);
          if (self.progress >= threshold) {
            revealedRef.current[i] = true;
            gsap.to(card.querySelectorAll(".card-reveal"), {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              pointerEvents: "auto",
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.07,
            });
          }
        });

        const fill = progressFillRef.current;
        if (fill) fill.style.transform = `scaleX(${self.progress})`;

        const counter = counterRef.current;
        if (counter) {
          const total = PROJECTS.length;
          const current = Math.min(
            total,
            Math.max(1, Math.round(self.progress * total + 0.5)),
          );
          counter.textContent = `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
        }
      },
      onLeave: () => {
        const foot = section.querySelector(".proj-foot");
        if (foot) gsap.to(foot, { opacity: 0, duration: 0.25, ease: "power2.in" });
      },
      onEnterBack: () => {
        const foot = section.querySelector(".proj-foot");
        if (foot) gsap.to(foot, { opacity: 1, duration: 0.25, ease: "power2.out" });
      },
    });
    cleanups.push(trigger);

    const aurora = auroraRef.current;
    if (aurora) {
      const toX = gsap.quickTo(aurora, "x", { duration: 2.2, ease: "power2.out" });
      const toY = gsap.quickTo(aurora, "y", { duration: 2.2, ease: "power2.out" });
      const onMouseMove = (event: MouseEvent): void => {
        toX(-((event.clientX / window.innerWidth - 0.5) * 28));
        toY(-((event.clientY / window.innerHeight - 0.5) * 18));
      };
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      cleanups.push({ kill: () => window.removeEventListener("mousemove", onMouseMove) });
    }

    return () => {
      cleanups.forEach((c) => c.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects-section"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <ProjectCursor containerRef={sectionRef} showLabel={false} />
      <div
        ref={auroraRef}
        style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#000" }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-10px",
            backgroundImage:
              "repeating-linear-gradient(100deg, #e85002 10%, #c10801 17%, #4e8d8a 24%, #ff8200 31%, #7a1a00 38%)",
            backgroundSize: "250% 300%",
            filter: "blur(12px)",
            opacity: 0.85,
            mixBlendMode: "screen",
            animation: "aurora-flow 22s linear infinite",
            maskImage:
              "radial-gradient(ellipse 75% 130% at 103% -5%, black 0%, black 15%, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.08) 72%, transparent 88%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 130% at 103% -5%, black 0%, black 15%, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.08) 72%, transparent 88%)",
          }}
        />
      </div>

      <div
        ref={trackRef}
        className="proj-track"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          height: "100vh",
          gap: "clamp(1.5rem, 2vw, 3rem)",
          padding: "0 clamp(2rem, 4vw, 6vw)",
          willChange: "transform",
        }}
      >
        <div
          className="proj-intro-panel"
          style={{
            width: "min(28vw, 360px)",
            flexShrink: 0,
            height: "60vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            padding: "12vh 1.5vw 6vh 0",
          }}
        >
          <h2
            className="proj-heading"
            style={{
              fontFamily: "var(--font-hero-sans)",
              fontWeight: 500,
              fontSize: "clamp(48px, 6.5vw, 100px)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "var(--fg)",
            }}
          >
            Projects
          </h2>
          <div
            className="proj-scroll-indicator"
            style={{
              marginTop: "5vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.9rem",
            }}
          >
            <div
              style={{
                position: "relative",
                width: 120,
                height: 1.5,
                background: "rgba(255,255,255,0.2)",
                overflow: "hidden",
                borderRadius: 2,
              }}
            >
              <div
                ref={thumbRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 32,
                  height: "100%",
                  background: "#fff",
                  borderRadius: 2,
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                fontWeight: 500,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Scroll
            </span>
          </div>
        </div>

        {PROJECTS.map((project, i) => {
          const isFeatured = project.index === "01";
          return (
          <article
            key={project.index}
            className="proj-card"
            style={{
              width: isFeatured ? "clamp(30rem, 45vw, 46rem)" : "clamp(30rem, 42vw, 42rem)",
              flexShrink: 0,
              height: isFeatured ? "62vh" : "60vh",
              display: "flex",
              flexDirection: "column",
              padding: isFeatured ? "3.7vh 3.8vw" : "3vh 3.5vw",
              border: isFeatured ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(255,255,255,0.12)",
              borderRadius: "28px",
              background: isFeatured
                ? "radial-gradient(circle at top left, rgba(239,81,46,0.3), rgba(25,10,8,0.96) 40%, rgba(10,10,10,0.96) 100%)"
                : "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
              boxShadow: isFeatured
                ? "0 40px 100px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.06)"
                : "0 30px 80px rgba(0,0,0,0.18)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              ref={(el) => {
                cardBodiesRef.current[i] = el;
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                gap: "1.1rem",
              }}
            >
              <div
                className="card-reveal"
                style={{
                  ...REVEAL_HIDDEN,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                  <span className="font-label" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {project.index}
                  </span>
                  <span
                    style={{
                      width: 1,
                      height: 10,
                      background: "rgba(255,255,255,0.2)",
                      display: "inline-block",
                    }}
                  />
                  <span className="font-label" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {project.category}
                  </span>
                </div>
                {project.status === "in-progress" && (
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "10px",
                      fontWeight: 500,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      border: "1px solid var(--accent)",
                      padding: "0.3em 0.8em",
                      borderRadius: 2,
                    }}
                  >
                    In Progress
                  </span>
                )}
              </div>

              <div className="card-reveal" style={REVEAL_HIDDEN}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: isFeatured ? "clamp(52px, 5vw, 96px)" : "clamp(38px, 4vw, 68px)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.05em",
                    color: "var(--fg)",
                    margin: 0,
                  }}
                >
                  {project.name}
                </h3>
              </div>

              <div className="card-reveal" style={REVEAL_HIDDEN}>
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proj-cta"
                  >
                    View Live ↗
                  </a>
                ) : (
                  <span className="proj-cta-muted">
                    {project.status === "in-progress" ? "Coming Soon" : "Private"}
                  </span>
                )}
              </div>

              <div className="card-reveal" style={{ ...REVEAL_HIDDEN, marginTop: "0.4rem" }}>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    fontSize: "clamp(13px, 1vw, 15px)",
                    lineHeight: 1.75,
                    color: "rgba(255,255,255,0.78)",
                    maxWidth: "48ch",
                    margin: 0,
                  }}
                >
                  {project.description}
                </p>
              </div>

              <div className="card-reveal" style={{ ...REVEAL_HIDDEN, marginTop: "auto" }}>
                <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", alignItems: "center" }}>
                  {project.tags.map(renderTag)}
                </div>
              </div>
            </div>
          </article>
          );
        })}
      </div>

      <div className="proj-foot">
        <div className="proj-progress-track">
          <div ref={progressFillRef} className="proj-progress-fill" />
        </div>
        <div ref={counterRef} className="proj-counter">
          {`01 / ${String(PROJECTS.length).padStart(2, "0")}`}
        </div>
      </div>

      <style>{`
        .proj-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5em;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--fg);
          text-decoration: none;
          white-space: nowrap;
          padding: 0.6em 1.4em;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 2px;
          transition: color 0.25s, border-color 0.25s, background 0.25s;
          margin-bottom: 4px;
        }
        .proj-cta:hover {
          color: #000;
          background: var(--fg);
          border-color: var(--fg);
        }
        .proj-cta-muted {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
        }

        /* ── Progress bar + counter ─────────────────────────────────────── */
        .proj-foot {
          position: absolute;
          bottom: 5vh;
          left: 6vw;
          right: 6vw;
          display: flex;
          align-items: center;
          gap: 1.8rem;
          z-index: 10;
        }
        .proj-progress-track {
          flex: 1;
          height: 1.5px;
          background: rgba(255,255,255,0.22);
        }
        .proj-progress-fill {
          height: 100%;
          background: #ffffff;
          transform-origin: left center;
          transform: scaleX(0);
          will-change: transform;
        }
        .proj-counter {
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: rgba(255,255,255,0.45);
          white-space: nowrap;
          user-select: none;
          flex-shrink: 0;
        }

        /* ── Tablet portrait + mobile: vertical card stack ────────────── */
        @media (max-width: 768px), (max-width: 1024px) and (orientation: portrait) {
          .proj-track {
            flex-direction: column !important;
            align-items: stretch !important;
            height: auto !important;
            padding: 8vh 6vw 10vh;
            gap: 10vh;
          }
          .proj-intro-panel {
            width: 100% !important;
            height: auto !important;
            flex-shrink: unset !important;
            padding: 0 !important;
            align-items: center !important;
            text-align: center;
          }
          .proj-heading { text-align: center; }
          .proj-scroll-indicator { display: none !important; }
          .proj-card {
            width: 100% !important;
            flex-shrink: unset !important;
            height: auto !important;
            min-height: unset !important;
            padding: 0 !important;
            border-top: 1px solid rgba(255,255,255,0.08);
            padding-top: 6vh !important;
          }
        }
        @media (max-width: 480px) {
          .proj-track { padding: 6vh 5vw 8vh; gap: 8vh; }
        }
        @media (max-width: 768px), (max-width: 1024px) and (orientation: portrait) {
          .proj-foot { display: none; }
        }
      `}</style>
    </section>
  );
}
