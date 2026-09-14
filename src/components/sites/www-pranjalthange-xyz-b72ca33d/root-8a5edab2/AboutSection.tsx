export function AboutSection() {
  return (
    <section id="about-section" className="ma-about">
      <div className="ma-body">
        <div className="ma-left">
          <h2 className="ma-hey">Hey!</h2>
          <p className="ma-bio-short">
            I&rsquo;m Sakshi, a frontend engineer based in Gurugram, India,
            building AI-powered and real-time product experiences at{" "}
            <strong>Junglee Games</strong>.
          </p>
        </div>

        {/* Empty slot. PhotoBridge (mounted in page.tsx) flies the portrait
            here from the hero anchor and parks it. */}
        <div className="ma-photo" data-photo-anchor="about" />

        <div className="ma-right">
          <p className="ma-bio-long">
            I&rsquo;m a Software Developer II building fast, accessible, and
            high-impact frontend experiences with React, React Native, and
            TypeScript. At Junglee Games, I&rsquo;ve shipped AI-powered and
            real-time features for millions of users, with a focus on
            performance, usability, and scalable product architecture.
          </p>
          <p className="ma-bio-long">
            Earlier at Kigen, I built a reusable UI system, improved test
            coverage from 45% to 82%, and strengthened release reliability
            through better state management, RBAC, and monitoring. I care about
            turning product ideas into clean, maintainable interfaces that
            balance speed, quality, and user value.
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=1539sakshi@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ma-cta"
          >
            <span className="ma-cta-text">Get in touch</span>
            <span className="ma-cta-arrow" aria-hidden="true">
              <span className="ma-cta-arrow-glyph">↗</span>
              <span className="ma-cta-arrow-glyph">↗</span>
            </span>
          </a>
        </div>
      </div>

      <style>{`
        .ma-about {
          position: relative;
          min-height: 100vh;
          background: #EFEBE3;
          color: #0A0A0A;
          padding: 3vh 3vw 8vh;
          display: flex;
          flex-direction: column;
          cursor: auto;
        }

        .ma-body {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 4vw;
        }

        .ma-left {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
          margin-left: 9rem;
        }
        @media (max-width: 1024px) {
          /* The 9rem offset only makes sense against the desktop 3-column
             grid; the media query below stacks everything into one centred
             column, so the fixed margin has to go or it drags this block
             off-centre relative to its siblings. */
          .ma-left { margin-left: 0; }
        }
        .ma-hey {
          margin: 0;
          font-family: var(--font-hero-sans);
          font-weight: 800;
          font-size: clamp(40px, 5vw, 72px);
          line-height: 1;
          color: #0A0A0A;
        }
        .ma-bio-short {
          font-family: var(--font-body);
          font-size: clamp(14px, 1vw, 16px);
          line-height: 1.6;
          color: #2c2c28;
          max-width: 30ch;
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .ma-bio-short strong {
          font-weight: 700;
        }

        /* On the live site this is an invisible anchor and a bridged <img>
           flies into it from the hero. Standalone, the portrait lives here. */
        .ma-photo {
          position: relative;
          width: clamp(220px, 20vw, 320px);
          aspect-ratio: 3 / 4;
          pointer-events: none;
        }
        .ma-photo-img {
          position: absolute;
          inset: 0;
          z-index: 2;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
        }

        .ma-right {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          max-width: 34ch;
        }
        .ma-bio-long {
          font-family: var(--font-body);
          font-size: clamp(17px, 0.85vw, 15px);
          line-height: 1.52;
          color: #2c2c28;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .ma-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.4em;
          margin-top: 0.2rem;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #0A0A0A;
          text-decoration: none;
          width: fit-content;
          padding-bottom: 0.15em;
        }
        /* Underline redraws left-to-right on hover instead of just sitting
           there — a resting faint line, and on hover a solid line wipes
           across from start to end. */
        .ma-cta::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: rgba(10, 10, 10, 0.25);
        }
        .ma-cta::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background: #0A0A0A;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1);
          z-index: 1;
        }
        .ma-cta:hover::before {
          transform: scaleX(1);
        }
        .ma-cta-text {
          transition: transform 0.35s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .ma-cta:hover .ma-cta-text {
          transform: translateX(-2px);
        }
        /* Framer "text-arrow-cta" style hover: the arrow slides out to the
           top-right and a duplicate slides in from the bottom-left to take
           its place, so the icon feels like it's continuously travelling
           through the button rather than just nudging over. */
        .ma-cta-arrow {
          position: relative;
          display: inline-block;
          width: 1em;
          height: 1em;
          overflow: hidden;
        }
        .ma-cta-arrow-glyph {
          position: absolute;
          inset: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.35s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .ma-cta-arrow-glyph:first-child {
          transform: translate(0, 0);
        }
        .ma-cta-arrow-glyph:last-child {
          transform: translate(-1.1em, 1.1em);
        }
        .ma-cta:hover .ma-cta-arrow-glyph:first-child {
          transform: translate(1.1em, -1.1em);
        }
        .ma-cta:hover .ma-cta-arrow-glyph:last-child {
          transform: translate(0, 0);
        }

        /* ── Responsive ─────────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .ma-body {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
            justify-items: center;
            text-align: center;
            gap: 3rem;
          }
          .ma-left, .ma-right { max-width: 46ch; align-items: center; }
          .ma-bio-short { max-width: 46ch; }
        }
        @media (max-width: 480px) {
          .ma-about { padding: 4vh 6vw 8vh; }
          .ma-body { gap: 2.2rem; }
          .ma-photo { width: min(72vw, 260px); }
        }
      `}</style>
    </section>
  );
}
