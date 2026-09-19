import React from 'react';

export const StackSection = () => {
  const capabilities = [
    'JWT AUTHENTICATION',
    'API VALIDATION',
    'RAG ARCHITECTURE',
    'VECTOR SEARCH',
    'CRUD OPERATIONS',
    'DATABASE DESIGN',
    'ASYNC PROGRAMMING'
  ];

  const categories = [
    {
      title: 'FRONTEND',
      tech: 'HTML5 / CSS3 / JavaScript / React.js / Tailwind / TypeScript'
    },
    {
      title: 'BACKEND',
      tech: 'Node.js / Express.js / Python / FastAPI / Flask / REST APIs'
    },
    {
      title: 'AI & VECTOR',
      tech: 'RAG Architecture / Meta FAISS / Sentence Transformers / Groq LLM'
    },
    {
      title: 'DATA',
      tech: 'MongoDB / MySQL / Vector Indices / Firebase'
    },
    {
      title: 'TOOLS',
      tech: 'Git / GitHub / Postman / Docker / Linux / Vercel / Render'
    }
  ];

  return (
    <section className="toolkit-section" id="stack">
      <div className="toolkit-container flip-on-scroll">
        {/* 03 / STACK label */}
        <div className="section-label mb-6 flip-on-scroll">
          <span>03</span>
          <span>STACK</span>
        </div>

        {/* Asymmetric 2-Column Yellow Layout matching screenshot */}
        <div className="toolkit-layout-new">
          {/* Left Column: Huge Headline + Capability Pills */}
          <div className="flip-on-scroll reveal-stagger-1">
            <h2>
              The tools
              <br />
              I build <span>with.</span>
            </h2>

            <div className="toolkit-pills" data-testid="capability-cloud">
              {capabilities.map((cap, i) => (
                <span key={cap} className={`flip-on-scroll reveal-stagger-${(i % 5) + 1}`}>
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Clean Table Rows with Thin Dividers */}
          <div className="toolkit-table-rows flip-on-scroll reveal-stagger-2">
            {categories.map((cat, idx) => (
              <div
                key={cat.title}
                className={`toolkit-row group hover:bg-[rgba(24,56,45,0.06)] transition-colors px-2 flip-on-scroll reveal-stagger-${idx + 1}`}
              >
                <b>{cat.title}</b>
                <span className="group-hover:translate-x-1 transition-transform inline-block">
                  {cat.tech}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
