import React from 'react';

export const ExperienceSection = () => {
  const coursework = [
    'Database Management Systems',
    'Computer Networks',
    'Operating Systems',
    'Object-Oriented Design',
    'Prompt Engineering',
    'Assisted Research'
  ];

  return (
    <section className="experience-section" id="experience">
      {/* 04 / Experience + education Label */}
      <div className="section-label mb-4 flip-on-scroll">
        <span>04</span>
        <span>Experience + education</span>
      </div>

      {/* Heading */}
      <div className="experience-heading">
        <h2 className="flip-on-scroll reveal-stagger-1">
          Learning by
          <br />
          <span>building.</span>
        </h2>
        <p className="flip-on-scroll reveal-stagger-2">
          A timeline of the work and study that shaped how I approach software.
        </p>
      </div>

      {/* Grid: Timeline + Education */}
      <div className="experience-grid">
        {/* Left: Professional Timeline */}
        <div className="timeline">
          <div className="timeline-item flip-on-scroll reveal-stagger-1">
            <span className="timeline-date">6 months</span>
            <div>
              <p className="eyebrow">Web Developer Intern</p>
              <h3>Uddharana Tech Private Limited</h3>
              <p>Faridabad, India</p>
            </div>
          </div>

          <div className="timeline-item flip-on-scroll reveal-stagger-2">
            <span className="timeline-date">4 months</span>
            <div>
              <p className="eyebrow">Web Developer</p>
              <h3>Uddharana Tech Private Limited</h3>
              <p>
                RESTful APIs, CRUD operations, JWT authentication, request validation, exception handling, structured API responses and documentation.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Education Block */}
        <div className="education-block flip-on-scroll reveal-stagger-3">
          <p className="eyebrow">2022 — 2026</p>
          <h3>Rajasthan Technical University</h3>
          <p>
            B.Tech in Computer Science and Engineering
            <br />
            Bharatpur, India
          </p>

          <div className="coursework">
            {coursework.map((course, i) => (
              <span key={course} className={`hover:border-[var(--blue)] transition-colors flip-on-scroll reveal-stagger-${(i % 4) + 1}`}>
                {course}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
