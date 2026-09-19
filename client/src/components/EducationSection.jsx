import React from 'react';
import { MapPin, Calendar, BookOpen } from 'lucide-react';

export const EducationSection = () => {
  const coursework = [
    'Database Management Systems',
    'Computer Networks',
    'Operating Systems',
    'Object-Oriented Design',
    'Prompt Engineering',
    'Assisted Research'
  ];

  return (
    <section id="education" className="relative py-20 md:py-28 px-6 md:px-12 border-b border-[#073B32]/18">
      <div className="max-w-7xl mx-auto">
        <div className="font-mono text-xs text-[#315BDD] tracking-widest uppercase mb-4 font-bold flex items-center gap-2">
          <span>05 / EDUCATION</span>
          <span className="h-[1px] w-8 bg-[#315BDD]/40 inline-block" />
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#073B32] tracking-tighter leading-[0.95] mb-14 md:mb-20">
          ACADEMIC
          <span className="block text-[#315BDD]">FOUNDATION.</span>
        </h2>

        <div className="border-t-2 border-[#073B32] pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <span className="font-mono text-xs text-[#315BDD] font-bold tracking-widest block mb-2">
              01 // UNDERGRADUATE DEGREE
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#073B32] tracking-tight mb-2">
              B.Tech in Computer Science &amp; Engineering
            </h3>
            <div className="text-base text-[#164B40] font-semibold mb-4">
              Rajasthan Technical University
            </div>

            <div className="space-y-1.5 font-mono text-xs text-[#718078] mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#315BDD]" />
                <span>2022 ? 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#315BDD]" />
                <span>Bharatpur, India</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="font-mono text-xs font-bold text-[#073B32] tracking-wider uppercase mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#315BDD]" />
              <span>RELEVANT COURSEWORK &amp; DISCIPLINES</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coursework.map((course) => (
                <div
                  key={course}
                  className="font-mono text-xs p-3.5 border border-[#073B32]/18 bg-white/60 rounded-sm text-[#073B32] font-semibold flex items-center justify-between"
                >
                  <span>{course}</span>
                  <span className="text-[#315BDD] font-bold">?</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
