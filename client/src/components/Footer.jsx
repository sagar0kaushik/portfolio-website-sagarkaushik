import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { Github, Linkedin } from './Icons';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer" style={{ backgroundColor: '#e27809' }}>
      <div className="site-footer-container">
        <div className="site-footer__main">
          {/* Brand Identity in #e27809 Footer */}
          <div className="site-footer__brand">
            <span className="font-mono text-[11px] text-white/90 uppercase tracking-widest block font-bold">
              ● SK / PORTFOLIO
            </span>
            <h4>Sagar Kaushik</h4>
            <p>
              Full-stack developer building robust, database-driven web applications and scalable REST services.
            </p>
          </div>

          {/* Connected Social & Direct Channels */}
          <div className="footer-links">
            <a
              href="https://github.com/sagar0kaushik"
              target="_blank"
              rel="noreferrer"
              data-testid="footer-github"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>

            <a
              href="https://www.linkedin.com/in/sagar-kaushik-21a833298/"
              target="_blank"
              rel="noreferrer"
              data-testid="footer-linkedin"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>

            <a
              href="mailto:sagarkaushik.work@gmail.com"
              data-testid="footer-email"
            >
              <span>Email</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Technical Footer Note & Navigation Controls */}
        <div className="footer-note">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} SAGAR KAUSHIK</span>
            <span>·</span>
            <span>MERN &amp; FASTAPI ARCHITECTURE</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/admin" className="hover:text-white underline text-xs">
              [ADMIN]
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 cursor-pointer font-mono text-xs font-bold"
            >
              <span>TOP</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
