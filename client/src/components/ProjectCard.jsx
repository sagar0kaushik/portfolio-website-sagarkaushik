import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Normalize project data fields
  const num = project.number || `0${index + 1}`;
  const slug = project.slug;
  const isGrovia = slug === 'grovia' || slug === 'Grovia';
  const isStudent = slug === 'student-management-system';
  const isBank = slug === 'bank-management-system';
  const isWeather = slug === 'weather-app';
  const isRag = slug === 'rag-document-chatbot';

  const cardTopTag = project.cardTopTag || (
    isGrovia ? 'FULL-STACK WEB APP' :
    isStudent ? 'FULL-STACK APP' :
    isBank ? 'FULL-STACK WEB APP' :
    isRag ? 'AI & VECTOR SEARCH' :
    isWeather ? 'FRONTEND + API' : 'ENGINEERING PROJECT'
  );

  const eyebrow = project.eyebrow || (
    isGrovia ? '01 / FULL-STACK COMMERCE' :
    isStudent ? '02 / DATA + APIS' :
    isBank ? '03 / AUTH + SYSTEMS' :
    isWeather ? '04 / API INTEGRATION' :
    isRag ? '05 / RAG & LLM ARCHITECTURE' : `${num} / SOFTWARE ARCHITECTURE`
  );

  const displayTitle = project.displayTitle || (
    isGrovia ? 'E-Commerce Web App — Grovia' :
    isStudent ? 'Student Management System' :
    isBank ? 'Bank Management System' :
    isWeather ? 'API Weather App' :
    isRag ? 'AI Document Chatbot — RAG' : project.title
  );

  const previewTag = project.previewTag || (
    isGrovia ? 'COMMERCE' :
    isStudent ? 'DATABASE' :
    isBank ? 'BANKING' :
    isWeather ? 'WEATHER' :
    isRag ? 'AI / RAG' : 'SYSTEM'
  );

  // 120fps GPU smooth interactive mouse tilt
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Technologies list
  const tags = project.technologies && project.technologies.length > 0
    ? project.technologies.slice(0, 5)
    : (isGrovia ? ['REACT.JS', 'NODE.JS', 'EXPRESS.JS', 'MONGODB'] :
       isStudent ? ['FASTAPI', 'REACT.JS', 'MONGODB'] :
       isBank ? ['FASTAPI', 'REACT.JS', 'MONGODB', 'JWT'] :
       isRag ? ['PYTHON', 'FLASK', 'FAISS', 'GROQ LLM', 'RAG'] :
       ['JAVASCRIPT', 'OPENWEATHER API', 'ASYNC/AWAIT', 'CSS3']);

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="exact-project-card group"
      data-testid={`card-project-${slug}`}
    >
      {/* 1. Meta Top Bar: Number on Left, Category on Right */}
      <div className="card-top-meta">
        <span className="card-top-number">{num}</span>
        <span className="card-top-tag">{cardTopTag}</span>
      </div>

      {/* 2. Visual Artwork Box with Tilted Window & Orbital Graphic */}
      <div className="card-artwork-box" aria-hidden="true">
        {/* Orbital Circles */}
        <div className="card-artwork-orbit orbit-primary" />
        <div className="card-artwork-orbit orbit-secondary" />

        {/* 3D Tilted Perspective Browser Window */}
        <div
          className="card-artwork-window"
          style={{
            transform: isHovered
              ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotate(${index % 2 === 0 ? '-1.5deg' : '1.5deg'}) translateY(-6px)`
              : `rotate(${index % 2 === 0 ? '-3.5deg' : '2.5deg'}) translateY(0)`
          }}
        >
          {/* Window Header */}
          <div className="window-header-bar">
            <div className="window-dots">
              <span className="dot dot-blue" />
              <span className="dot dot-blue" />
              <span className="dot dot-blue" />
            </div>
            <span className="window-app-tag">{previewTag}</span>
          </div>

          {/* Window Content Mockup corresponding to Image 4 */}
          <div className="window-content-area">
            {isGrovia && (
              <div className="mockup-grovia">
                <div className="mockup-bar-blue" />
                <div className="mockup-bar-green" />
                <div className="mockup-cards-row">
                  <div className="mockup-card-purple" />
                  <div className="mockup-card-purple" />
                  <div className="mockup-card-purple" />
                </div>
                <div className="mockup-line-gray line-long" />
                <div className="mockup-line-gray line-short" />
              </div>
            )}

            {isStudent && (
              <div className="mockup-student">
                <div className="mockup-bar-teal" />
                <div className="mockup-line-gray line-long" />
                <div className="mockup-line-gray line-mid" />
                <div className="mockup-line-gray line-short" />
                <div className="mockup-cards-row mt-2">
                  <div className="mockup-card-teal-soft" />
                  <div className="mockup-card-teal-soft" />
                </div>
              </div>
            )}

            {isBank && (
              <div className="mockup-bank">
                <div className="mockup-bar-navy" />
                <div className="mockup-cards-row">
                  <div className="mockup-card-blue-soft" />
                  <div className="mockup-card-blue-soft" />
                  <div className="mockup-card-blue-soft" />
                </div>
                <div className="mockup-line-gray line-long" />
                <div className="mockup-line-gray line-mid" />
              </div>
            )}

            {isWeather && (
              <div className="mockup-weather">
                <div className="mockup-bar-sky" />
                <div className="mockup-line-gray line-mid" />
                <div className="mockup-cards-row mt-2">
                  <div className="mockup-card-sky-soft" />
                  <div className="mockup-card-sky-soft" />
                  <div className="mockup-card-sky-soft" />
                </div>
              </div>
            )}

            {isRag && (
              <div className="mockup-rag">
                <div className="mockup-bar-emerald" />
                <div className="mockup-cards-row">
                  <div className="mockup-card-chunk" />
                  <div className="mockup-card-chunk" />
                </div>
                <div className="mockup-line-gray line-long" />
                <div className="mockup-line-emerald line-mid" />
                <div className="mockup-line-gray line-short" />
              </div>
            )}

            {!isGrovia && !isStudent && !isBank && !isWeather && !isRag && (
              <div className="mockup-generic">
                <div className="mockup-bar-emerald" />
                <div className="mockup-cards-row">
                  <div className="mockup-card-chunk" />
                  <div className="mockup-card-chunk" />
                </div>
                <div className="mockup-line-gray line-long" />
                <div className="mockup-line-gray line-short" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Content: Subtitle, Title, Description, Arrow Button, Tags */}
      <div className="card-info-box">
        <div className="card-info-content">
          <div className="card-eyebrow-blue">{eyebrow}</div>

          <Link to={`/projects/${slug}`}>
            <h3 className="card-main-title group-hover:text-[var(--blue)] transition-colors">
              {displayTitle}
            </h3>
          </Link>

          <p className="card-description-text">{project.description}</p>
        </div>

        {/* Circular Arrow Button (as shown in image 4) */}
        <Link
          to={`/projects/${slug}`}
          className="card-circle-arrow-btn"
          aria-label={`Open ${displayTitle} case study`}
        >
          <ArrowUpRight className="w-4 h-4 text-[#18382d] group-hover:text-[var(--blue)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* 4. Tech Tags Row */}
      <div className="card-tags-row">
        {tags.map((tag) => (
          <span key={tag} className="tech-pill-box">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
};
