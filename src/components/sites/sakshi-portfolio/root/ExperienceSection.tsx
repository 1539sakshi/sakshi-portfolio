interface ExperienceItem {
  year: string;
  role: string;
  org: string;
  description: string[];
}

const EXPERIENCES: ExperienceItem[] = [
  {
    year: "2023",
    role: "Software Developer",
    org: "Kigen",
    description: [
      "Increased Jest & Cypress coverage from 45% to 82%, reducing regression bugs by 25%.",
      "Managed state with Redux & React Query, using caching and invalidation for better performance.",
      "Implemented RBAC, authentication, and onboarding flows.",
      "Built a reusable component library and design system from Figma designs.",
      "Integrated Sentry & WebEngage for monitoring, analytics, and event tracking.",
      "Optimized performance with Webpack code-splitting and dynamic imports.",
    ],
  },
  {
    year: "NOW",
    role: "Software Developer II",
    org: "Junglee Games",
    description: [
      "Built high-performance web/mobile gaming features, improving LCP by 35% and CLS by 40% for 1M+ users.",
      "Developed real-time Block/Unblock functionality using Ably for live chat and access control.",
      "Contributed to Ask AI across web/mobile using React.js, TypeScript, and APIs.",
      "Improved release reliability with Cypress E2E and Jasmine/Jest unit and component coverage.",
      "Delivered user-facing experiences with a strong focus on performance and accessibility.",
    ],
  },
];

const TAGS: Record<string, string[]> = {
  "Software Developer II": ["React.js", "TypeScript", "Ably", "Cypress", "Jasmine/Jest"],
  "Software Developer": ["React", "Redux", "React Query", "Jest", "Cypress", "Sentry"],
};

const ROTATIONS: number[] = [-3.5, 2.5, -1.5, 3, -2];

const MARK_TEXT = "WORK EXPERIENCE WORK EXPERIENCE";

export function ExperienceSection() {
  return (
    <section id="experience-section" className="xp-section">
      <div className="xp-mark-wrap" aria-hidden="true">
        <div className="xp-mark-clip">
          <div className="xp-mark-track">
            <span className="xp-mark-run">{MARK_TEXT}</span>
            <span className="xp-mark-run">{MARK_TEXT}</span>
          </div>
        </div>
      </div>

      <div className="xp-cards">
        {EXPERIENCES.map((item, index) => (
          <div
            key={`${item.year}-${item.org}`}
            className="xp-card-slot"
            style={{ zIndex: index + 1 }}
          >
            <div
              className="xp-card"
              style={{ transform: `rotate(${ROTATIONS[index % ROTATIONS.length]}deg)` }}
            >
              <div className="xp-card-top">
                <h3 className="xp-role">{item.role}</h3>
                <span className="xp-year">{item.year}</span>
              </div>

              <div className="xp-org-row">
                <span className="xp-org">{item.org}</span>
                <span className="xp-org-line" aria-hidden="true" />
              </div>

              <ul className="xp-description-list">
                {item.description.map((point) => (
                  <li key={point} className="xp-description-item">
                    <span dangerouslySetInnerHTML={{ __html: point }} />
                  </li>
                ))}
              </ul>

              <div className="xp-tags">
                {(TAGS[item.role] ?? []).map((tag) => (
                  <span className="xp-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        /* No overflow:hidden here — it silently breaks position:sticky on
           descendants, which is what the whole card stack relies on. The
           wordmark is clipped by .xp-mark-wrap instead. */
        .xp-section {
          position: relative;
          background: #000000;
          /* Slanted block: the top edge rises left-to-right and the bottom edge
             follows it, so the black band reads as a parallelogram against the
             cream sections above and below. Cutting the section itself (rather
             than clipping a wrapper) is what makes it visible — a clipped cream
             wrapper would only reveal the cream page behind it. */
          --xp-slant: 6vh;
          clip-path: polygon(
            0 var(--xp-slant),
            100% 0,
            100% calc(100% - var(--xp-slant)),
            0 100%
          );
        }
        @media (max-width: 768px) {
          .xp-section { --xp-slant: 3.5vh; }
        }

        /* Zero-height sticky rail: the wordmark hangs off it, so it stays
           centred in the viewport while the cards scroll past. */
        .xp-mark-wrap {
          position: sticky;
          top: 0;
          height: 0;
          z-index: 0;
          pointer-events: none;
        }
        /* Clips the marquee to the viewport so it can't create a horizontal
           scrollbar, without clipping the sticky cards. */
        .xp-mark-clip {
          position: absolute;
          top: 12vh;
          left: 0;
          width: 100vw;
          overflow: hidden;
        }
        .xp-mark-track {
          display: flex;
          width: max-content;
          animation: xp-marquee 38s linear infinite;
          will-change: transform;
        }
        .xp-mark-run {
          white-space: nowrap;
          font-family: var(--font-hero-sans);
          font-weight: 800;
          font-size: clamp(90px, 15vw, 220px);
          line-height: 1;
          letter-spacing: -0.02em;
          color: #FFFFFF;
          opacity: 0.06;
          user-select: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .xp-mark-track { animation: none; }
        }

        .xp-cards {
          position: relative;
          z-index: 1;
          /* Lead-in so the first card travels up into place before it sticks;
             the tail lets the finished pile hold in view for a beat. Scoped to
             the card stack only so it doesn't push the marquee's sticky start
             point down with it. */
          padding: 70vh 0 40vh;
        }

        /* The slot is sticky, not the card. A sticky element holds until its
           containing block ends — here that's .xp-cards, shared by every
           slot — so each card stops at the same offset and the following
           ones settle on top, building a pile rather than passing by. */
        .xp-card-slot {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          margin-bottom: 2.5rem;
        }
        /* Keep the card sticky, but let the natural content height dominate the
           scroll flow so the full experience stays readable before the next card
           begins to overlap. */
        .xp-card {
          position: sticky;
          top: 18vh;
          width: min(980px, 84vw);
          height: auto;
          box-sizing: border-box;
          flex-shrink: 0;
          min-height: clamp(360px, 42vh, 540px);
          background: #FFFFFF;
          color: #0A0A0A;
          padding: clamp(1.7rem, 2.3vw, 2.5rem);
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          box-shadow: 0 18px 52px rgba(0,0,0,0.38);
        }

        .xp-card-top {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1.5rem;
          border-bottom: 1px solid rgba(10,10,10,0.9);
          padding-bottom: 1rem;
        }
        .xp-role {
          margin: 0;
          font-family: var(--font-hero-sans);
          font-weight: 700;
          font-size: clamp(26px, 2.5vw, 42px);
          line-height: 1.05;
          letter-spacing: -0.01em;
        }
        .xp-year {
          flex: none;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: clamp(13px, 1.1vw, 16px);
          letter-spacing: 0.18em;
          color: #6b665c;
        }
        .xp-org-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .xp-org {
          font-family: var(--font-body);
          font-size: clamp(18px, 1.6vw, 28px);
          line-height: 1.4;
          color: #1b1a19;
          font-weight: 500;
        }
        .xp-org-line {
          flex: 1;
          height: 1px;
          background: rgba(10,10,10,0.8);
        }
        .xp-description-list {
          margin: 0;
          padding-left: 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          max-width: 58rem;
          font-family: var(--font-body);
          font-size: clamp(14px, 1.1vw, 18px);
          line-height: 1.45;
          color: #2b2a29;
        }
        .xp-description-item {
          list-style: disc;
        }
        .xp-description-item strong {
          font-weight: 700;
          color: #111111;
        }
        .xp-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-top: 0.35rem;
        }
        .xp-tag {
          font-family: var(--font-body);
          font-size: clamp(10px, 0.75vw, 12px);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0A0A0A;
          border: 1px solid rgba(10,10,10,0.4);
          border-radius: 999px;
          padding: 0.65em 1.15em;
          white-space: nowrap;
          background: rgba(0,0,0,0.015);
        }

        @media (max-width: 768px) {
          .xp-card-top { flex-direction: column; gap: 0.4rem; }
          .xp-mark-run { font-size: clamp(64px, 30vw, 140px); }
          .xp-card-slot { margin-bottom: 2rem; }
          .xp-card { top: 12vh; }
          .xp-cards { padding: 46vh 0 28vh; }
          .xp-org-row { gap: 0.75rem; }
        }
        @media (max-width: 480px) {
          .xp-card { width: 90vw; padding: clamp(1.5rem, 6vw, 2.2rem); }
          .xp-description-list { padding-left: 1rem; }
        }
      `}</style>
    </section>
  );
}
