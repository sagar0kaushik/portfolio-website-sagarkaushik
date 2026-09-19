import React, { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { Hero } from '../components/Hero';
import { AboutSection } from '../components/AboutSection';
import { ProjectCard } from '../components/ProjectCard';
import { StackSection } from '../components/StackSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { ContactSection } from '../components/ContactSection';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { api } from '../services/api';
import { initialProjects } from '../data/projectsData';

export const HomePage = () => {
  // Always initialize with verified project dataset so 0 blank space ever occurs!
  const [projects, setProjects] = useState(initialProjects);
  const [loading, setLoading] = useState(false);

  // Initialize 120fps hardware-accelerated scroll-to-load observer
  useScrollReveal();

  useEffect(() => {
    let isMounted = true;
    api.getProjects().then((res) => {
      if (isMounted && res.success && res.data && res.data.length > 0) {
        // Merge MongoDB data while keeping display formatting
        const merged = initialProjects.map((init) => {
          const remote = res.data.find((p) => p.slug === init.slug);
          return remote ? { ...init, ...remote } : init;
        });
        setProjects(merged);
      }
    }).catch((err) => {
      console.warn('Using local project database fallback:', err);
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <main className="site-shell">
      <SEO
        title="Sagar Kaushik | Software Engineer & Full-Stack Developer"
        description="Portfolio of Sagar Kaushik, Software Engineer & Full-Stack Developer specializing in MERN stack, Python, and AI systems. View projects, case studies, and contact."
        canonical="https://sagarkaushik.dev/"
      />

      {/* 1. Hero Section with Center Gridline & Terminal (Primary H1) */}
      <Hero />

      {/* 2. 01 / About Section (Statement + 3-Tier Grid) */}
      <AboutSection />

      {/* 3. 02 / Selected Work Section (Deep Forest Green Background) */}
      <section className="work-section" id="work">
        <div className="work-container">
          <div className="work-heading flip-on-scroll">
            <div className="section-label">
              <span>02</span>
              <span>Selected work</span>
            </div>
            <span className="work-count">
              {projects.length ? `${String(projects.length).padStart(2, '0')} projects` : '05 projects'}
            </span>
          </div>

          <div className="work-intro flip-on-scroll reveal-stagger-1">
            <h2>
              Built,
              <br />
              <span>not just described.</span>
            </h2>
            <p>
              Some things I’ve made across product interfaces, management systems, and data-led experiences.
            </p>
          </div>

          {/* 2x2 Project Grid with Perspective Mockups & Orbit Graphics matching Image 4 */}
          <div className="project-grid">
            {projects.map((project, index) => (
              <div key={project.slug || index} className="flip-on-scroll reveal-on-scroll">
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 03 / Stack (Vibrant Yellow Section full width left to right) */}
      <StackSection />

      {/* 5. 04 / Experience + Education */}
      <ExperienceSection />

      {/* 6. 05 / Contact with Rotating Vector Orbit */}
      <ContactSection />
    </main>
  );
};
