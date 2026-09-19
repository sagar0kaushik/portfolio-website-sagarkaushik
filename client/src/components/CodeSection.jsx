import React from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { Github } from './Icons';

export const CodeSection = () => {
  const repos = [
    {
      name: "Grovia",
      description: "Full-stack MERN grocery e-commerce platform with cart management, wishlist, and dynamic order handling.",
      language: "JavaScript",
      url: "https://github.com/sagar0kaushik/Grovia",
      liveUrl: "https://grovia-pxbz.vercel.app/"
    },
    {
      name: "Student-Management-System",
      description: "FastAPI, React & MongoDB academic record system with Pydantic schema validation and CRUD routes.",
      language: "Python",
      url: "https://github.com/sagar0kaushik/Student-Management-System"
    },
    {
      name: "Bank-Management-System",
      description: "Secure financial ledger application with JWT token guards, protected routes, and audit histories.",
      language: "Python",
      url: "https://github.com/sagar0kaushik/Bank-Management-System"
    },
    {
      name: "weather-web-app",
      description: "Real-time weather application using OpenWeatherMap REST API and asynchronous JavaScript.",
      language: "JavaScript",
      url: "https://github.com/sagar0kaushik/weather-web-app",
      liveUrl: "https://sagar0kaushik-weather-web-app.vercel.app/"
    },
    {
      name: "chatApp",
      description: "Real-time socket messaging web application with room-based chatting.",
      language: "JavaScript",
      url: "https://github.com/sagar0kaushik"
    },
    {
      name: "portfolio-website",
      description: "Production MERN portfolio built with Swiss typography, asymmetric grid, and REST backend.",
      language: "JavaScript",
      url: "https://github.com/sagar0kaushik"
    }
  ];

  return (
    <section id="code" className="relative py-20 md:py-28 px-6 md:px-12 border-b border-[#073B32]/18">
      <div className="max-w-7xl mx-auto">
        <div className="font-mono text-xs text-[#315BDD] tracking-widest uppercase mb-4 font-bold flex items-center gap-2">
          <span>06 / CODE</span>
          <span className="h-[1px] w-8 bg-[#315BDD]/40 inline-block" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-20 gap-6">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#073B32] tracking-tighter leading-[0.95]">
            THE CODE
            <span className="block text-[#315BDD]">BEHIND THE WORK.</span>
          </h2>

          <a
            href="https://github.com/sagar0kaushik"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 font-mono text-xs font-bold text-[#073B32] hover:text-[#315BDD] pb-1 border-b border-[#073B32]/40 hover:border-[#315BDD] transition-colors"
          >
            <Github className="w-4 h-4 text-[#315BDD]" />
            <span>VIEW GITHUB (SAGAR0KAUSHIK)</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo) => (
            <div
              key={repo.name}
              className="border border-[#073B32]/18 rounded-lg p-6 bg-white/70 hover:border-[#315BDD] transition-all duration-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-[#073B32] truncate">
                    {repo.name}
                  </span>
                  <span className="font-mono text-[10px] bg-[#073B32]/8 text-[#073B32] px-2 py-0.5 rounded font-semibold">
                    {repo.language}
                  </span>
                </div>
                <p className="text-xs text-[#073B32]/80 leading-relaxed font-sans mb-6">
                  {repo.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#073B32]/10 flex items-center justify-between font-mono text-xs">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[#073B32] hover:text-[#315BDD] font-bold transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>SOURCE ?</span>
                </a>
                {repo.liveUrl && (
                  <a
                    href={repo.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#315BDD] hover:underline font-bold transition-colors"
                  >
                    <span>LIVE</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 font-mono text-[11px] text-[#718078]">
          * ALL CODE REPOSITORIES LINK DIRECTLY TO SAGAR0KAUSHIK GITHUB PROFILE WITH UNALTERED PUBLIC COMMITS.
        </div>
      </div>
    </section>
  );
};
