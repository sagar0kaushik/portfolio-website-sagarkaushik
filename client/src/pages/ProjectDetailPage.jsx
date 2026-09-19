import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { api } from '../services/api';
import { initialProjects } from '../data/projectsData';
import { ArrowLeft, ExternalLink, Check, Layers, Cpu, Server, ShieldCheck } from 'lucide-react';
import { Github } from '../components/Icons';

export const ProjectDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const localFallback = initialProjects.find(p => p.slug === slug) || null;
  const [project, setProject] = useState(localFallback);
  const [loading, setLoading] = useState(!localFallback);

  useEffect(() => {
    window.scrollTo(0, 0);
    const local = initialProjects.find(p => p.slug === slug);
    if (local) {
      setProject(local);
      setLoading(false);
    }
    api.getProjectBySlug(slug).then((res) => {
      if (res.success && res.data) {
        setProject(res.data);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-6 max-w-7xl mx-auto font-mono text-xs text-[#073B32]">
        LOADING SPECIFICATION FOR [{slug}]...
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-6 max-w-3xl mx-auto text-center font-mono">
        <h1 className="text-4xl font-extrabold text-[#073B32] mb-4">SPECIFICATION NOT FOUND</h1>
        <p className="text-sm text-[#718078] mb-6">No project matching slug "{slug}" exists.</p>
        <Link to="/" className="inline-flex items-center gap-2 text-[#315BDD] underline text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> RETURN TO PORTFOLIO
        </Link>
      </main>
    );
  }

  return (
    <main className="relative z-10 pt-28 md:pt-36 pb-24 px-6 md:px-12">
      <SEO
        title={`${project.title} | Sagar Kaushik Software Engineer Case Study`}
        description={project.description}
        canonical={`https://sagarkaushik.com/projects/${project.slug}`}
      />

      {/* SoftwareApplication Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": project.title,
            "applicationCategory": project.category,
            "operatingSystem": "Web",
            "author": {
              "@type": "Person",
              "name": "Sagar Kaushik",
              "url": "https://sagarkaushik.com"
            },
            "description": project.description
          })
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between font-mono text-xs text-[#718078] tracking-widest uppercase mb-8 border-b border-[#073B32]/12 pb-4">
          <Link
            to="/#work"
            className="group flex items-center gap-1.5 text-[#073B32] hover:text-[#315BDD] transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>RETURN TO SELECTED WORK</span>
          </Link>
          <div className="text-[11px] text-[#315BDD] font-bold">
            CASE STUDY // {project.category}
          </div>
        </div>

        {/* Header Hero */}
        <div className="mb-14 md:mb-20">
          <div className="font-mono text-xs text-[#315BDD] font-bold tracking-widest uppercase mb-3">
            {project.subtitle}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-[#073B32] tracking-tighter leading-[0.92] mb-6">
            {project.title}.
          </h1>
          <p className="text-base sm:text-xl text-[#073B32]/85 max-w-3xl leading-relaxed font-sans font-medium">
            {project.description}
          </p>

          {/* Direct CTA Links */}
          <div className="flex flex-wrap items-center gap-4 mt-8 font-mono text-xs font-bold">
            {project.liveUrl && project.liveUrl !== project.githubUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#315BDD] text-white px-5 py-3 rounded-sm hover:bg-[#2448B8] transition-colors shadow-sm"
              >
                <span>OPEN LIVE APPLICATION</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#073B32] text-[#F3F0E6] px-5 py-3 rounded-sm hover:bg-[#164B40] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>EXPLORE REPOSITORY</span>
            </a>
          </div>
        </div>

        {/* Technology Stack Badges */}
        <div className="mb-16 p-6 rounded-xl border border-[#073B32]/16 bg-[#E9E5D8]/40">
          <span className="font-mono text-[10px] text-[#718078] tracking-widest uppercase block mb-3 font-semibold">
            IMPLEMENTED ARCHITECTURAL STACK
          </span>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span key={t} className="font-mono text-xs px-3.5 py-1.5 border border-[#073B32]/22 text-[#073B32] bg-white rounded-sm font-semibold">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Deep Technical Case Study Sections */}
        <div className="space-y-16">
          {/* 01 Overview */}
          <section className="border-t-2 border-[#073B32] pt-8 grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 font-mono text-xs text-[#315BDD] font-bold tracking-widest uppercase">
              01 // SYSTEM OVERVIEW
            </div>
            <div className="md:col-span-8 font-sans text-base text-[#073B32] leading-relaxed">
              {project.overview}
            </div>
          </section>

          {/* 02 Problem & Solution */}
          <section className="border-t border-[#073B32]/18 pt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-6 space-y-3">
              <span className="font-mono text-xs text-rose-700 font-bold tracking-widest uppercase block">
                02 // THE PROBLEM
              </span>
              <p className="font-sans text-sm sm:text-base text-[#073B32] leading-relaxed">
                {project.problem}
              </p>
            </div>
            <div className="md:col-span-6 space-y-3">
              <span className="font-mono text-xs text-emerald-800 font-bold tracking-widest uppercase block">
                03 // THE ENGINEERING SOLUTION
              </span>
              <p className="font-sans text-sm sm:text-base text-[#073B32] leading-relaxed">
                {project.solution}
              </p>
            </div>
          </section>

          {/* 03 Features */}
          <section className="border-t border-[#073B32]/18 pt-8 grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 font-mono text-xs text-[#315BDD] font-bold tracking-widest uppercase">
              04 // FEATURE CAPABILITIES
            </div>
            <div className="md:col-span-8">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-sans text-xs text-[#073B32]">
                {project.features.map((feat, i) => (
                  <li key={i} className="p-3.5 bg-white/70 border border-[#073B32]/16 rounded flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#315BDD] shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 04 Architecture & Implementation */}
          <section className="border-t border-[#073B32]/18 pt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-6 space-y-3">
              <span className="font-mono text-xs text-[#073B32] font-bold tracking-widest uppercase block flex items-center gap-2">
                <Server className="w-4 h-4 text-[#315BDD]" />
                05 // SYSTEM ARCHITECTURE
              </span>
              <p className="font-sans text-sm text-[#073B32]/90 leading-relaxed bg-white/60 p-5 rounded border border-[#073B32]/12">
                {project.architecture}
              </p>
            </div>
            <div className="md:col-span-6 space-y-3">
              <span className="font-mono text-xs text-[#073B32] font-bold tracking-widest uppercase block flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#315BDD]" />
                06 // IMPLEMENTATION DETAILS
              </span>
              <p className="font-sans text-sm text-[#073B32]/90 leading-relaxed bg-white/60 p-5 rounded border border-[#073B32]/12">
                {project.implementation}
              </p>
            </div>
          </section>

          {/* 05 Challenges & Learnings */}
          <section className="border-t border-[#073B32]/18 pt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-6 space-y-3">
              <span className="font-mono text-xs text-[#718078] font-bold tracking-widest uppercase block">
                07 // TECHNICAL CHALLENGES OVERCOME
              </span>
              <p className="font-sans text-sm text-[#073B32] leading-relaxed">
                {project.challenges}
              </p>
            </div>
            <div className="md:col-span-6 space-y-3">
              <span className="font-mono text-xs text-[#315BDD] font-bold tracking-widest uppercase block">
                08 // WHAT I LEARNED
              </span>
              <p className="font-sans text-sm text-[#073B32] leading-relaxed">
                {project.learnings}
              </p>
            </div>
          </section>
        </div>

        {/* Bottom Case Study Footer */}
        <div className="mt-20 pt-8 border-t border-[#073B32]/18 flex flex-col sm:flex-row items-center justify-between font-mono text-xs gap-4">
          <Link
            to="/#work"
            className="flex items-center gap-2 text-[#073B32] hover:text-[#315BDD] font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO ALL PROJECTS</span>
          </Link>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[#315BDD] font-bold underline"
          >
            <span>VIEW REPOSITORY ON GITHUB</span>
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </main>
  );
};
