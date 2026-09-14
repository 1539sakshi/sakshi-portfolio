"use client";

import type { ReactNode } from "react";
import { SlantReveal } from "@/components/sites/sakshi-portfolio/shared/SlantReveal";
import {
  GitHubIcon,
  LinkedInIcon,
} from "@/components/sites/sakshi-portfolio/shared/icons";

const CREAM = "#EFEBE3";
const EMAIL = "1539sakshi@gmail.com";

type SocialLink = {
  href: string;
  label: string;
  icon: ReactNode;
};

const SOCIALS: SocialLink[] = [
  {
    href: "https://github.com/1539sakshi",
    label: "GitHub",
    icon: <GitHubIcon />,
  },
  {
    href: "https://linkedin.com/in/1539sakshiSingh",
    label: "LinkedIn",
    icon: <LinkedInIcon />,
  },
];

export function ContactSection() {
  return (
    <SlantReveal>
        <section id="contact-section" className="footer-contact">
          <div className="footer-top">
            <div className="footer-left">
              <h2 className="footer-heading">
                Got an idea?
                <br />
                <span className="footer-heading-highlight">
                  Let&rsquo;s make it real.
                </span>
              </h2>
              <a href={`mailto:${EMAIL}`} className="footer-email">
                {EMAIL}
              </a>
              <a href={`mailto:${EMAIL}`} className="footer-cta">
                Contact Now
                <span className="footer-cta-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
            <div className="footer-socials-block">
              <span className="footer-socials-label">
                Say hii
                <span className="footer-socials-label-tail" aria-hidden="true" />
              </span>
              <nav className="footer-socials" aria-label="Social links">
                {SOCIALS.map(({ href, label, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon"
                    aria-label={label}
                    title={label}
                  >
                    {icon}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="footer-crosses" aria-hidden="true">
            <span className="footer-cross footer-cross-lg">+</span>
            <span className="footer-cross footer-cross-sm">+</span>
            <span className="footer-cross footer-cross-lg">+</span>
          </div>
        </section>

      <style>{`
        
        .footer-contact {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: clamp(4rem, 10vh, 8rem);
          background: ${CREAM};
          color: #0A0A0A;
          padding: 34vh 1.5rem 8vh;
          overflow: hidden;
        }

        .footer-top {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .footer-crosses {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(0.5rem, 4vw, 3rem);
          color: rgba(10, 10, 10, 0.35);
          font-family: var(--font-body);
          line-height: 1;
          user-select: none;
        }
        .footer-cross-lg { font-size: 20px; }
        .footer-cross-sm { font-size: 13px; }

        .footer-left {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
          max-width: 700px;
        }

        .footer-heading {
          margin: 0;
          font-family: var(--font-hero-sans);
          font-weight: 700;
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1.1;
          letter-spacing: -0.01em;
          color: #0A0A0A;
        }
        .footer-heading-highlight {
          background: var(--accent);
          color: #0A0A0A;
          padding: 0 0.15em;
        }

        .footer-email {
          margin: 0;
          font-family: var(--font-hero-sans);
          font-weight: 800;
          font-size: clamp(28px, 4.4vw, 56px);
          line-height: 1.05;
          letter-spacing: -0.01em;
          color: #1E1811;
          text-decoration: none;
          word-break: break-word;
          transition: text-shadow 0.25s ease;
        }
        .footer-email:hover {
          text-shadow: 0 6px 18px rgba(30, 24, 17, 0.3);
        }

        .footer-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: clamp(15px, 1.3vw, 18px);
          color: #0A0A0A;
          text-decoration: none;
          padding-bottom: 0.35rem;
          width: fit-content;
        }
        .footer-cta::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1.5px;
          background: rgba(10, 10, 10, 0.3);
        }
        .footer-cta::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1.5px;
          background: #0A0A0A;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1);
          z-index: 1;
        }
        .footer-cta:hover::before {
          transform: scaleX(1);
        }
        .footer-cta-arrow {
          font-size: 1.1em;
          transition: transform 0.2s ease;
        }
        .footer-cta:hover .footer-cta-arrow {
          transform: translate(2px, -2px);
        }

        .footer-socials-block {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1rem;
          flex-shrink: 0;
        }
        .footer-socials-label {
          position: relative;
          display: inline-flex;
          align-items: center;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #fff;
          background: #0A0A0A;
          padding: 0.6em 1rem;
          border-radius: 14px;
          box-shadow: 0 8px 20px rgba(10, 10, 10, 0.18);
        }
        .footer-socials-label-tail {
          position: absolute;
          right: 18px;
          bottom: -6px;
          width: 14px;
          height: 10px;
          background: #0A0A0A;
          clip-path: polygon(0 0, 100% 0, 15% 100%);
        }
        .footer-socials {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .footer-social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: 1.5px solid #0A0A0A;
          color: #0A0A0A;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .footer-social-icon svg {
          width: 18px;
          height: 18px;
        }
        .footer-social-icon:hover {
          background: #0A0A0A;
          color: ${CREAM};
        }

        @media (max-width: 640px) {
          .footer-contact { padding: 26vh 1.25rem 4rem; gap: clamp(2.5rem, 8vh, 4rem); }
          .footer-top { flex-direction: column; align-items: flex-start; gap: 2rem; }
          .footer-socials-block { align-items: flex-start; }
          .footer-cta-block { gap: 0.85rem; }
        }
      `}</style>
    </SlantReveal>
  );
}
