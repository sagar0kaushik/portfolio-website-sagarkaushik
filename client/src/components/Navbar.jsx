import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (id) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      window.location.href = '/#' + id;
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="site-header">
      {/* Brand Mark */}
      <Link to="/" className="flex items-center gap-2 group text-[var(--ink)]">
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--blue)] group-hover:scale-125 transition-transform" />
        <span className="font-mono text-xs font-bold tracking-widest uppercase">
          SK / PORTFOLIO
        </span>
      </Link>

      {/* Desktop Links */}
      <nav className="hidden md:flex items-center gap-7">
        <button onClick={() => handleNavClick('about')} className="hover:text-[var(--blue)] transition-colors">
          About
        </button>
        <button onClick={() => handleNavClick('work')} className="hover:text-[var(--blue)] transition-colors">
          Selected work
        </button>
        <button onClick={() => handleNavClick('stack')} className="hover:text-[var(--blue)] transition-colors">
          Stack
        </button>
        <button onClick={() => handleNavClick('experience')} className="hover:text-[var(--blue)] transition-colors">
          Experience
        </button>
        <Link to="/blogs" className="hover:text-[var(--blue)] transition-colors">
          Blogs
        </Link>
        <button onClick={() => handleNavClick('contact')} className="hover:text-[var(--blue)] transition-colors">
          Contact
        </button>
      </nav>

      {/* Start a Conversation CTA */}
      <div className="hidden sm:flex items-center">
        <button
          onClick={() => handleNavClick('contact')}
          className="group flex items-center gap-1.5 hover:text-[var(--blue)] transition-colors border-b border-[var(--ink)]/30 hover:border-[var(--blue)] pb-0.5"
        >
          <span>? Start a conversation</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden p-1 text-[var(--ink)]"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="absolute top-[68px] left-0 right-0 bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-6 shadow-xl flex flex-col gap-4 md:hidden">
          <button onClick={() => handleNavClick('about')} className="text-left font-mono text-sm uppercase py-1 border-b border-[var(--line)]">
            About
          </button>
          <button onClick={() => handleNavClick('work')} className="text-left font-mono text-sm uppercase py-1 border-b border-[var(--line)]">
            Selected work
          </button>
          <button onClick={() => handleNavClick('stack')} className="text-left font-mono text-sm uppercase py-1 border-b border-[var(--line)]">
            Stack
          </button>
          <button onClick={() => handleNavClick('experience')} className="text-left font-mono text-sm uppercase py-1 border-b border-[var(--line)]">
            Experience
          </button>
          <Link to="/blogs" onClick={() => setMobileOpen(false)} className="text-left font-mono text-sm uppercase py-1 border-b border-[var(--line)]">
            Blogs
          </Link>
          <button onClick={() => handleNavClick('contact')} className="text-left font-mono text-sm uppercase py-1 text-[var(--blue)] font-bold">
            ? Start a conversation ?
          </button>
        </div>
      )}
    </header>
  );
};
