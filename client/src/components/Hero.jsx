import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Terminal as TerminalIcon, Sparkles } from 'lucide-react';

export const Hero = () => {
  const [activeTab, setActiveTab] = useState(0);

  const terminalTabs = [
    {
      cmd: '$ git status',
      output: '✔ clean working tree',
      color: 'text-emerald-700 font-bold',
      subcmd: '$ npm run dev',
      suboutput: '⚡ building useful things',
      subcolor: 'text-[var(--blue)] font-bold'
    },
    {
      cmd: '$ node -v && npm -v',
      output: 'v22.22.0 / npm 10.8.2',
      color: 'text-emerald-700 font-bold',
      subcmd: '$ mongo --eval "db.stats()"',
      suboutput: '✔ { ok: 1, collections: 5 }',
      subcolor: 'text-[var(--blue)] font-bold'
    },
    {
      cmd: '$ curl /api/health',
      output: '200 OK — latency: 1.2ms',
      color: 'text-emerald-700 font-bold',
      subcmd: '$ status check',
      suboutput: '⚡ all systems operational',
      subcolor: 'text-[var(--blue)] font-bold'
    }
  ];

  const techPills = ['React', 'Node.js', 'Express', 'MongoDB', 'Python', 'FastAPI'];

  return (
    <section className="hero-section">
      {/* Center Dividing Vertical Gridline */}
      <div className="hero-gridline" aria-hidden="true" />

      {/* Eyebrow */}
      <div className="hero-eyebrow flip-on-scroll">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--blue)] animate-pulse" />
          <span className="font-semibold">Full-stack developer</span>
        </div>
        <span className="text-[var(--ink-soft)] font-mono">Selected work</span>
      </div>

      {/* Giant Typography — Single Primary H1 for Personal Name SEO */}
      <h1 className="hero-title flip-on-scroll reveal-stagger-1" data-testid="text-hero-title">
        <span className="sr-only">Sagar Kaushik — Software Engineer &amp; Full-Stack Developer</span>
        <span aria-hidden="true">
          Sagar
          <br />
          <em>Kaushik</em>
          <span className="hero-period">.</span>
        </span>
      </h1>

      {/* Upper-Right Technical Panel with Interactive Terminal */}
      <div className="hero-technical flip-on-scroll reveal-stagger-2" aria-label="Technical focus">
        <div className="hero-technical__header">
          <div className="flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-[var(--blue)]" />
            <span>Current build</span>
          </div>
          <span className="text-[var(--blue)] font-bold">01–05</span>
        </div>

        {/* Terminal Container */}
        <div
          onClick={() => setActiveTab((prev) => (prev + 1) % terminalTabs.length)}
          className="hero-terminal cursor-pointer group hover:border-[var(--blue)] transition-colors relative"
          title="Click to cycle terminal output"
        >
          <div className="flex justify-between items-center text-[9px] text-[var(--ink-soft)] font-mono mb-2 border-b border-[var(--line)] pb-1">
            <span>TERMINAL_SESSION // 0{activeTab + 1}</span>
            <span className="text-[var(--blue)] group-hover:underline flex items-center gap-1">
              CYCLE <Sparkles className="w-2.5 h-2.5" />
            </span>
          </div>
          <div className="text-[var(--ink-soft)] font-mono mb-1">{terminalTabs[activeTab].cmd}</div>
          <div className={`font-mono flex items-center gap-1.5 mb-2 ${terminalTabs[activeTab].color}`}>
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span>{terminalTabs[activeTab].output}</span>
          </div>
          <div className="text-[var(--ink-soft)] font-mono mb-1">{terminalTabs[activeTab].subcmd}</div>
          <div className={`font-mono ${terminalTabs[activeTab].subcolor} flex items-center gap-1`}>
            <span>{terminalTabs[activeTab].suboutput}</span>
            <span className="inline-block w-1.5 h-3 bg-[var(--blue)] animate-cursor-blink ml-1" />
          </div>
        </div>

        {/* Tech Cloud Pills */}
        <div className="hero-tech-cloud">
          {techPills.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>

      {/* Hero Bottom Row */}
      <div className="hero-bottom flip-on-scroll reveal-stagger-2">
        <p className="hero-role">
          Full-Stack
          <br />
          Developer
        </p>

        <p className="hero-intro">
          Computer Science &amp; Engineering graduate building responsive, scalable and database-driven web applications.
        </p>

        <a
          href="#work"
          className="round-arrow"
          aria-label="Explore selected work"
          data-testid="link-explore-work"
        >
          <ArrowUpRight className="w-6 h-6" />
        </a>
      </div>

      {/* Hero Action Footer Links */}
      <div className="hero-actions flip-on-scroll reveal-stagger-3">
        <div className="flex items-center gap-6">
          <a href="#work" className="text-action" data-testid="link-view-work">
            View my work <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a href="#contact" className="text-action" data-testid="link-get-in-touch">
            Get in touch <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <span className="hero-location text-[var(--ink-soft)] font-mono text-[10px]">
          Based in India / open to opportunities
        </span>
      </div>
    </section>
  );
};
