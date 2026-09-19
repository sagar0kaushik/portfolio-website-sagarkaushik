import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { api } from '../services/api';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import {
  ArrowLeft, ArrowRight, Clock, Calendar, Tag, Share2, Check,
  Eye, BookOpen, User, Sparkles, ExternalLink
} from 'lucide-react';

export const BlogPostPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [prevBlog, setPrevBlog] = useState(null);
  const [nextBlog, setNextBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    api.getBlogBySlug(slug).then((res) => {
      if (res.success && res.data) {
        setBlog(res.data);
        if (res.related) setRelatedBlogs(res.related);
        if (res.prev) setPrevBlog(res.prev);
        if (res.next) setNextBlog(res.next);
      } else {
        setBlog(null);
      }
      setLoading(false);
    }).catch(() => {
      setBlog(null);
      setLoading(false);
    });
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${blog?.title} by Sagar Kaushik`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-36 px-6 max-w-4xl mx-auto font-mono text-xs text-[#073B32]">
        LOADING ARTICLE DISPATCH [{slug}]...
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="min-h-screen pt-36 px-6 max-w-3xl mx-auto text-center font-mono">
        <h1 className="text-4xl font-extrabold text-[#073B32] mb-4">ARTICLE NOT FOUND</h1>
        <p className="text-sm text-[#718078] mb-6">
          No publication matching slug "{slug}" exists or it has been archived.
        </p>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-[#315BDD] underline text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> RETURN TO ALL PUBLICATIONS
        </Link>
      </main>
    );
  }

  const publishedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recent publication';

  return (
    <main className="relative z-10 pt-28 md:pt-36 pb-24 px-6 md:px-12">
      <SEO
        title={blog.seoTitle || `${blog.title} | Sagar Kaushik`}
        description={blog.seoDescription || blog.summary || blog.excerpt}
        canonical={`https://sagarkaushik.com/blogs/${blog.slug}`}
        image={blog.featuredImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200'}
        type="article"
      />

      {/* Schema.org JSON-LD Article Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.summary || blog.excerpt,
            "image": blog.featuredImage ? [blog.featuredImage] : [],
            "datePublished": blog.publishedAt || '2026-09-01T00:00:00.000Z',
            "dateModified": blog.updatedAt || blog.publishedAt || '2026-09-01T00:00:00.000Z',
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://sagarkaushik.com/blogs/${blog.slug}`
            },
            "author": {
              "@type": "Person",
              "name": "Sagar Kaushik",
              "url": "https://sagarkaushik.com",
              "jobTitle": "Full-Stack Engineer & AI Architect"
            },
            "publisher": {
              "@type": "Person",
              "name": "Sagar Kaushik",
              "url": "https://sagarkaushik.com"
            },
            "keywords": (blog.tags || []).join(', ')
          })
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between font-mono text-xs text-[#718078] tracking-widest uppercase mb-8 border-b border-[#073B32]/12 pb-4">
          <Link
            to="/blogs"
            className="group flex items-center gap-1.5 text-[#073B32] hover:text-[#315BDD] transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>ALL PUBLICATIONS</span>
          </Link>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-[#315BDD] font-bold">{blog.category}</span>
            <span></span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {blog.readTime || blog.readingTime || '5 min read'}
            </span>
          </div>
        </div>

        {/* Article Header */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#073B32] tracking-tighter leading-[1.05] mb-6">
            {blog.title}
          </h1>

          {/* Metadata Card */}
          <div className="p-4 rounded-xl bg-white/70 border border-[#073B32]/14 font-mono text-xs text-[#073B32] flex flex-wrap items-center justify-between gap-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#073B32] text-white flex items-center justify-center font-bold text-xs">
                SK
              </div>
              <div>
                <div className="font-bold">SAGAR KAUSHIK</div>
                <div className="text-[#718078] text-[10px]">
                  {publishedDate}  {blog.views || 1} views
                </div>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                type="button"
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#073B32]/8 hover:bg-[#315BDD] hover:text-white transition-colors text-[11px] font-bold"
                title="Copy link"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3" />}
                <span>{copied ? 'COPIED' : 'SHARE'}</span>
              </button>
              <button
                onClick={handleShareTwitter}
                type="button"
                className="px-2.5 py-1 rounded bg-[#073B32]/8 hover:bg-[#315BDD] hover:text-white transition-colors text-[11px] font-bold"
              >
                X
              </button>
              <button
                onClick={handleShareLinkedIn}
                type="button"
                className="px-2.5 py-1 rounded bg-[#073B32]/8 hover:bg-[#315BDD] hover:text-white transition-colors text-[11px] font-bold"
              >
                IN
              </button>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        {blog.featuredImage && (
          <div className="mb-12 rounded-2xl overflow-hidden border border-[#073B32]/16 shadow-lg">
            <img
              src={blog.featuredImage}
              alt={blog.featuredImageAlt || blog.title}
              className="w-full max-h-[480px] object-cover"
            />
            {blog.featuredImageAlt && (
              <div className="bg-[#f7f6f2] px-4 py-2 font-mono text-[11px] text-[#718078] border-t border-[#073B32]/10">
                {blog.featuredImageAlt}
              </div>
            )}
          </div>
        )}

        {/* Article Summary Lead */}
        {blog.summary && (
          <div className="p-6 mb-8 rounded-xl bg-[#f5c85b]/15 border-l-4 border-[#e27809] font-sans text-base sm:text-lg text-[#073B32] font-medium leading-relaxed">
            {blog.summary}
          </div>
        )}

        {/* Article Markdown Body */}
        <article className="border-t border-[#073B32]/14 pt-8 font-sans">
          <MarkdownRenderer content={blog.content} />
        </article>

        {/* Tags Section */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-14 pt-6 border-t border-[#073B32]/16 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#718078] uppercase mr-1">TOPICS:</span>
            {blog.tags.map((t) => (
              <Link
                key={t}
                to={`/blogs?tag=${encodeURIComponent(t)}`}
                className="tech-tag hover:border-[#315BDD] hover:text-[#315BDD] transition-colors"
              >
                #{t}
              </Link>
            ))}
          </div>
        )}

        {/* Author Bio Box */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-[#073B32]/16 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-[#073B32] text-[#F3F0E6] flex items-center justify-center font-extrabold text-lg flex-shrink-0">
            SK
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-[#073B32] text-base">Written by Sagar Kaushik</h3>
            <p className="text-xs sm:text-sm text-[#073B32]/80 font-sans leading-relaxed">
              Full-stack software engineer and AI applications architect. Specializing in high-throughput MERN systems, RAG document intelligence, FAISS vector search, and clean production engineering.
            </p>
            <div className="pt-1 font-mono text-xs">
              <a href="/#contact" className="text-[#315BDD] font-bold underline hover:text-[#073B32]">
                Get in touch for engineering collaborations 
              </a>
            </div>
          </div>
        </div>

        {/* Previous & Next Navigation */}
        <div className="mt-12 pt-8 border-t border-[#073B32]/14 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          {prevBlog ? (
            <Link
              to={`/blogs/${prevBlog.slug}`}
              className="p-4 rounded-xl border border-[#073B32]/14 hover:border-[#315BDD] bg-white transition-all group text-left"
            >
              <div className="text-[#718078] text-[10px] mb-1 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                <span>PREVIOUS PUBLICATION</span>
              </div>
              <div className="font-bold text-[#073B32] group-hover:text-[#315BDD] line-clamp-1">
                {prevBlog.title}
              </div>
            </Link>
          ) : <div />}

          {nextBlog ? (
            <Link
              to={`/blogs/${nextBlog.slug}`}
              className="p-4 rounded-xl border border-[#073B32]/14 hover:border-[#315BDD] bg-white transition-all group text-right sm:text-right"
            >
              <div className="text-[#718078] text-[10px] mb-1 flex items-center justify-end gap-1">
                <span>NEXT PUBLICATION</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="font-bold text-[#073B32] group-hover:text-[#315BDD] line-clamp-1">
                {nextBlog.title}
              </div>
            </Link>
          ) : <div />}
        </div>

        {/* RELATED ARTICLES SECTION */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#073B32]/16">
            <div className="font-mono text-xs text-[#315BDD] uppercase font-bold tracking-wider mb-6">
              RELATED ARCHITECTURAL DISPATCHES
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/blogs/${rel.slug}`}
                  className="group bg-white p-5 rounded-xl border border-[#073B32]/14 hover:border-[#315BDD] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] text-[#315BDD] font-bold uppercase block mb-1">
                      {rel.category}
                    </span>
                    <h4 className="font-bold text-[#073B32] text-sm group-hover:text-[#315BDD] line-clamp-2 mb-2">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="font-mono text-[10px] text-[#718078] pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span>{rel.readTime || '5 min'}</span>
                    <span className="text-[#315BDD] font-bold group-hover:translate-x-1 transition-transform">
                      READ ?
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer Back Button */}
        <div className="mt-14 text-center font-mono text-xs">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#073B32] text-white font-bold hover:bg-[#315BDD] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>EXPLORE ALL ENGINEERING ARTICLES</span>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default BlogPostPage;
