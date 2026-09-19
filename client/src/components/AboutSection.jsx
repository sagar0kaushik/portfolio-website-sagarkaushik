import React from 'react';

export const AboutSection = () => {
  return (
    <section className="statement-section" id="about">
      {/* 01 / About Label */}
      <div className="section-label mb-4 flip-on-scroll">
        <span>01</span>
        <span>About</span>
      </div>

      {/* Statement Headline + Copy */}
      <div className="statement-layout">
        <h2 className="flip-on-scroll reveal-stagger-1">
          I build digital products
          <br />
          from <span>frontend to backend.</span>
        </h2>

        <div className="statement-copy flip-on-scroll reveal-stagger-2">
          <p>
            I am <strong>Sagar Kaushik</strong>, a Computer Science &amp; Engineering graduate and Full-Stack Developer with professional experience building reliable web applications from interface to API and database.
          </p>
          <p className="muted-copy">
            I work across modern web development, designing responsive interfaces, RESTful APIs, authentication architectures, and high-performance database pipelines.
          </p>
        </div>
      </div>

      {/* Tier 1: 3 Approach Columns */}
      <div className="about-columns flip-on-scroll reveal-stagger-2">
        <div className="flip-on-scroll reveal-stagger-1">
          <span>01</span>
          <p>
            I enjoy learning by building real applications and improving my understanding of software architecture, backend systems and modern web development.
          </p>
        </div>
        <div className="flip-on-scroll reveal-stagger-2">
          <span>02</span>
          <p>
            My approach is practical: make the next step clear, keep the system legible, and give the details enough care that the work holds up beyond the happy path.
          </p>
        </div>
        <div className="flip-on-scroll reveal-stagger-3">
          <span>03</span>
          <p>
            Currently open to opportunities where thoughtful product work, reliable engineering and a curious team meet.
          </p>
        </div>
      </div>

      {/* Tier 2: 4 Big Profile Metric Blocks */}
      <div className="profile-stats flip-on-scroll reveal-stagger-3" data-testid="profile-stats">
        <div className="flip-on-scroll reveal-stagger-1">
          <strong className="group-hover:text-[var(--blue)] transition-colors">10+</strong>
          <span>Projects</span>
        </div>
        <div className="flip-on-scroll reveal-stagger-2">
          <strong>FULL-STACK</strong>
          <span>Focus</span>
        </div>
        <div className="flip-on-scroll reveal-stagger-3">
          <strong>MERN</strong>
          <span>Primary stack</span>
        </div>
        <div className="flip-on-scroll reveal-stagger-4">
          <strong>PYTHON + FASTAPI</strong>
          <span>Backend</span>
        </div>
      </div>

      {/* Tier 3: 3 Principles */}
      <div className="principles flip-on-scroll reveal-stagger-3">
        <div className="flip-on-scroll reveal-stagger-1">
          <span>01</span>
          <b>Clarity over cleverness</b>
          <p>Systems should be legible to the people who inherit them.</p>
        </div>
        <div className="flip-on-scroll reveal-stagger-2">
          <b>Details are the interface</b>
          <p>Small decisions add up to a product people trust.</p>
        </div>
        <div className="flip-on-scroll reveal-stagger-3">
          <span>03</span>
          <b>Ship the useful version</b>
          <p>Good momentum comes from solving the real problem first.</p>
        </div>
      </div>
    </section>
  );
};
