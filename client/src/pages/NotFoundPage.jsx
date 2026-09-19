import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <main className="relative z-10 min-h-[80vh] flex items-center justify-center px-6 py-32">
      <SEO title="404 ? Page Not Found | Sagar Kaushik" noindex={true} />
      <div className="max-w-xl mx-auto text-center">
        <div className="font-mono text-xs text-[#315BDD] tracking-widest uppercase mb-4 font-bold">
          404 // RESOURCE UNRESOLVED
        </div>
        <h1 className="text-7xl sm:text-9xl font-extrabold text-[#073B32] tracking-tighter mb-6">
          404.
        </h1>
        <p className="text-base text-[#073B32]/80 leading-relaxed font-sans mb-8">
          The requested coordinate does not exist within Sagar Kaushik's portfolio index.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#073B32] text-[#F3F0E6] px-6 py-3 font-mono text-xs font-bold tracking-wider hover:bg-[#315BDD] transition-colors rounded-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO HOME</span>
        </Link>
      </div>
    </main>
  );
};
