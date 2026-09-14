"use client";

// Hero section — styles/text transcribed verbatim from the shipped
// page-source.chunk.js (module 94108, class prefix `mh-`).

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import {
  GitHubIcon,
  LinkedInIcon,
  ResumeIcon,
} from "@/components/sites/sakshi-portfolio/shared/icons";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const IMAGE_BASE = `${BASE_PATH}/sites/sakshi-portfolio/root/images`;
const RESUME_URL = `${BASE_PATH}/sites/sakshi-portfolio/root/Sakshi_Singh_Resume.pdf`;

type NavLink = { href: string; label: string };

const NAV_LINKS: readonly NavLink[] = [
  { href: "#projects-section", label: "Work" },
  { href: "#about-section", label: "Info" },
  { href: "#contact-section", label: "Contact" },
];

type SocialLink = {
  href: string;
  label: string;
  Icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
};

const SOCIAL_LINKS: readonly SocialLink[] = [
  { href: "https://github.com/1539sakshi", label: "GitHub", Icon: GitHubIcon },
  {
    href: "https://linkedin.com/in/1539sakshiSingh",
    label: "LinkedIn",
    Icon: LinkedInIcon,
  },
];

type LenisLike = { scrollTo: (target: Element, opts: { duration: number }) => void };

function handleNavClick(
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string,
): void {
  const target = document.querySelector(href);
  if (!target) return;
  event.preventDefault();
  const lenis = (window as Window & { __lenis?: LenisLike }).__lenis;
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

export function HeroSection() {
  const propsLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = propsLayerRef.current;
    if (!layer) return;

    const quickX = gsap.quickTo(layer, "x", {
      duration: 2.2,
      ease: "power2.out",
    });
    const quickY = gsap.quickTo(layer, "y", {
      duration: 2.2,
      ease: "power2.out",
    });

    const onMouseMove = (event: MouseEvent): void => {
      quickX(-((event.clientX / window.innerWidth - 0.5) * 28));
      quickY(-((event.clientY / window.innerHeight - 0.5) * 18));
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <section className="mh-hero">
      <div className="mh-topbar">
        <span className="mh-foot-tag">{"//BUILDING FOR THE WEB"}</span>
        <nav className="mh-nav">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="mh-nav-link"
              onClick={(event) => handleNavClick(event, href)}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mh-headline-wrap">
        <div className="mh-props" ref={propsLayerRef}>
          <Image
            src={`${IMAGE_BASE}/star-3d.png`}
            alt=""
            width={2550}
            height={2550}
            priority
            className="mh-sparkle"
          />
          <Image
            src={`${IMAGE_BASE}/bolt-3d.png`}
            alt=""
            width={2550}
            height={2550}
            priority
            className="mh-bolt"
          />
        </div>
        <h1 className="mh-headline">
          SAKSHI
          <br />
          SINGH
        </h1>
      </div>

      <div className="mh-photo" data-photo-anchor="hero" />
      <span className="mh-foot-left">©2026</span>

      <div className="mh-pill-stack">
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mh-pill-btn mh-pill-btn--resume"
          aria-label="Open resume"
        >
          <ResumeIcon className="mh-pill-glyph" aria-hidden="true" />
          Resume
        </a>

        {SOCIAL_LINKS.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mh-pill-btn"
          >
            <Icon className="mh-pill-glyph" aria-hidden="true" />
            {label}
          </a>
        ))}
      </div>

      <style>{`
        .mh-hero {
          position: relative;
          min-height: 100vh;
          background: #EFEBE3;
          color: #0A0A0A;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 3vh 3vw;
          cursor: auto;
        }

        /* ── Top bar ─────────────────────────────────────────────────── */
        .mh-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 3;
        }
        .mh-nav {
          display: flex;
          gap: 1.8rem;
        }
        .mh-nav-link {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #0A0A0A;
          text-decoration: none;
          opacity: 0.75;
          transition: opacity 0.25s ease;
        }
        .mh-nav-link:hover { opacity: 1; }

        /* ── Headline ────────────────────────────────────────────────── */
        .mh-headline-wrap {
          position: relative;
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 4vh;
        }
        .mh-headline {
          margin: 0;
          margin-top: 7vh;
          font-family: var(--font-hero-sans);
          font-weight: 800;
          text-transform: uppercase;
          font-size: clamp(58px, 12vw, 196px);
          line-height: 0.92;
          letter-spacing: -0em;
          text-align: center;
          color: #0A0A0A;
        }
        /* Parallax layer — the two 3D props ride together so a single
           gsap.quickTo pair drives both (source keeps them as siblings). */
        .mh-props {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }
        .mh-sparkle {
          position: absolute;
          top: 9%;
          left: 13%;
          width: clamp(55px, 12vw, 140px);
          height: auto;
          z-index: 3;
          pointer-events: none;
        }
        .mh-bolt {
          position: absolute;
          bottom: 27%;
          right: 17%;
          width: clamp(40px, 20vw, 160px);
          height: auto;
          z-index: 3;
          pointer-events: none;
        }

        /* ── Portrait anchor — invisible box marking the hero rest spot,
             centered under the headline ─────────────────────────────── */
        .mh-photo {
          position: absolute;
          left: 50%;
          bottom: 12vh;
          transform: translateX(-50%);
          width: clamp(120px, 12vw, 190px);
          aspect-ratio: 3 / 4;
          z-index: 2;
        }

        /* ── Bottom-left label ──────────────────────────────────────── */
        .mh-foot-left {
          position: absolute;
          left: 3vw;
          bottom: 3vh;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          color: #0A0A0A;
          z-index: 3;
        }
        .mh-foot-tag {
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #0A0A0A;
        }

        /* ── Stacked pill buttons — fixed bottom-right ─────────────────── */
        .mh-pill-stack {
          position: absolute;
          right: 3vw;
          bottom: 3vh;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          align-items: flex-end;
          z-index: 3;
        }
        .mh-pill-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5em;
          padding: 0.65em 1.4em;
          border-radius: 999px;
          background: #0A0A0A;
          color: #EFEBE3;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          text-decoration: none;
          white-space: nowrap;
          transition: opacity 0.25s ease;
        }
        .mh-pill-btn--resume {
          background: #d42b2b;
          color: #ffffff;
        }
        .mh-pill-btn:hover { opacity: 0.82; }
        .mh-pill-glyph {
          width: 14px;
          height: 14px;
          flex: none;
        }

        /* ── Responsive ─────────────────────────────────────────────── */
        @media (max-width: 768px) {
          .mh-nav { gap: 1rem; }
          .mh-headline { font-size: clamp(36px, 12vw, 64px); }
          .mh-photo { width: 90px; bottom: 12vh; }
          .mh-pill-btn { font-size: 12px; padding: 0.55em 1.1em; }
        }
        @media (max-width: 480px) {
          /* Top bar: the tag + 3 nav links can't share one row at this
             width without wrapping into the headline below — stack them
             so both stay fully readable instead of crowding/overlapping. */
          .mh-topbar { flex-direction: column; align-items: flex-start; gap: 0.6rem; }
          .mh-nav { gap: 0.9rem; flex-wrap: wrap; }
          /* The bolt icon's bottom/right percentages put it directly over
             the pill stack's top-left corner at narrow widths — pull it up
             and in so it clears the stack. */
          .mh-bolt { bottom: 40%; right: 6%; width: clamp(36px, 14vw, 60px); }
          .mh-pill-stack { gap: 0.5rem; bottom: 2.2vh; right: 4vw; }
          .mh-pill-btn { font-size: 11px; padding: 0.5em 0.9em; }
          .mh-foot-left { bottom: 2.2vh; left: 4vw; }
          .mh-photo { display: none; }
          /* Desktop scatters the props around the headline; mobile stacks
             sparkle → name → bolt on one centered vertical axis. */
          .mh-headline-wrap {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: clamp(1rem, 4vh, 2rem);
            padding-top: 0;
          }
          .mh-headline { margin-top: 0; order: 2; }
          .mh-props {
            position: static;
            display: contents;
          }
          .mh-sparkle {
            position: static;
            width: clamp(32px, 10vw, 48px);
            transform: none;
            order: 1;
          }
          .mh-bolt {
            position: static;
            width: clamp(32px, 10vw, 48px);
            transform: none;
            order: 3;
          }
        }
      `}</style>
    </section>
  );
}
