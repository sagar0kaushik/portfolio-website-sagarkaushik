import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { api } from '../services/api';
import {
  ArrowUpRight, Clock, Calendar, Search, Tag, Filter,
  BookOpen, Sparkles, ChevronLeft, ChevronRight, Check
} from 'lucide-react';

export const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  // Fetch categories, tags, and featured blogs on mount
  useEffect(() => {
    window.scrollTo(0, 0);

    Promise.all([
      api.getCategories(),
      api.getTags(),
      api.getFeaturedBlogs()
    ]).then(([catRes, tagRes, featRes]) => {
      if (catRes?.success && catRes.data) setCategories(catRes.data);
      if (tagRes?.success && tagRes.data) setTags(tagRes.data);
      if (featRes?.success && featRes.data) setFeaturedBlogs(featRes.data);
    }).catch(err => console.warn('Categories/tags fetch error:', err));
  }, []);

  // Fetch blogs on query changes
  useEffect(() => {
    setLoading(true);

    const params = {
      search: searchQuery,
      category: selectedCategory !== 'All' ? selectedCategory : '',
      tag: selectedTag,
      page: currentPage,
      limit: 6
    };

    api.getBlogs(params).then((res) => {
      if (res?.success && res.data) {
        setBlogs(res.data);
        if (res.pagination) setPagination(res.pagination);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // Sync URL params
    const nextParams = {};
    if (searchQuery) nextParams.search = searchQuery;
    if (selectedCategory !== 'All') nextParams.category = selectedCategory;
    if (selectedTag) nextParams.tag = selectedTag;
    if (currentPage > 1) nextParams.page = currentPage.toString();
    setSearchParams(nextParams, { replace: true });

  }, [searchQuery, selectedCategory, selectedTag, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
    setCurrentPage(1);
  };

  const heroPost = featuredBlogs.length > 0 ? featuredBlogs[0] : (blogs.length > 0 ? blogs[0] : null);

  return (
    <main className="relative z-10 pt-28 md:pt-36 pb-24 px-6 md:px-12">
      <SEO
        title="Technical Publications & Engineering Dispatches | Sagar Kaushik"
        description="Deep-dives into Full-Stack MERN Architecture, AI Document Chatbots with RAG & FAISS, Cloud Deployments, REST APIs, and Database Scalability by Sagar Kaushik."
        canonical="https://sagarkaushik.com/blogs"
      />

      <div className="max-w-6xl mx-auto">
        {/* Editorial Sub-Header */}
        <div className="font-mono text-xs text-[#315BDD] tracking-widest uppercase mb-4 font-bold flex items-center gap-2">
          <span>PUBLICATIONS // TECHNICAL WRITING // SAGAR KAUSHIK</span>
          <span className="h-[1px] w-12 bg-[#315BDD]/40 inline-block" />
        </div>

        {/* Section Title */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-[#073B32] tracking-tighter leading-[0.92] mb-6">
          ENGINEERING
          <span className="block text-[#315BDD]">DISPATCHES.</span>
        </h1>
        <p className="text-base sm:text-lg text-[#073B32]/80 max-w-2xl leading-relaxed font-sans mb-12">
          Real-world architectural case studies, production lessons, high-throughput systems design, and AI application engineering by Sagar Kaushik.
        </p>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white/80 p-5 rounded-2xl border border-[#073B32]/16 shadow-sm mb-12 space-y-4 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="md:col-span-7 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keywords, algorithms, technologies..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-sans focus:outline-none focus:border-[#315BDD] text-[#073B32]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-mono"
                >
                  CLEAR
                </button>
              )}
            </form>

            {/* Category Filter Pills */}
            <div className="md:col-span-5 flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => handleCategoryClick('All')}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-[#073B32] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ALL ({pagination.total || blogs.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleCategoryClick(c.name)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === c.name
                      ? 'bg-[#073B32] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {c.name} ({c.count})
                </button>
              ))}
            </div>
          </div>

          {/* Popular Tag Filters */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 font-mono text-[11px]">
              <span className="text-[#718078] font-bold flex items-center gap-1">
                <Tag className="w-3 h-3" /> TAGS:
              </span>
              {tags.slice(0, 10).map((t) => (
                <button
                  key={t}
                  onClick={() => handleTagClick(t)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    selectedTag === t
                      ? 'bg-[#315BDD] text-white font-bold'
                      : 'bg-[#073B32]/8 text-[#073B32] hover:bg-[#073B32]/14'
                  }`}
                >
                  #{t}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag('')}
                  className="text-rose-600 underline font-bold ml-1"
                >
                  Reset tag
                </button>
              )}
            </div>
          )}
        </div>

        {/* HERO FEATURED POST CARD (When viewing first page without search) */}
        {!searchQuery && selectedCategory === 'All' && !selectedTag && currentPage === 1 && heroPost && (
          <div className="mb-12">
            <Link
              to={`/blogs/${heroPost.slug}`}
              className="group block bg-white rounded-2xl border border-[#073B32]/16 overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 hover:border-[#315BDD]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {heroPost.featuredImage && (
                  <div className="lg:col-span-6 overflow-hidden max-h-96 lg:max-h-full">
                    <img
                      src={heroPost.featuredImage}
                      alt={heroPost.featuredImageAlt || heroPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className={`${heroPost.featuredImage ? 'lg:col-span-6' : 'lg:col-span-12'} p-8 sm:p-10 flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center gap-3 font-mono text-xs text-[#315BDD] font-bold mb-3 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>FEATURED CASE STUDY // {heroPost.category}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#073B32] tracking-tight group-hover:text-[#315BDD] transition-colors mb-4">
                      {heroPost.title}
                    </h2>
                    <p className="text-sm sm:text-base text-[#073B32]/80 font-sans leading-relaxed mb-6">
                      {heroPost.summary || heroPost.excerpt}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {heroPost.tags && heroPost.tags.slice(0, 4).map((t) => (
                        <span key={t} className="tech-tag text-[10px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between font-mono text-xs pt-4 border-t border-[#073B32]/10 text-[#718078]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-semibold text-[#073B32]">
                          <Clock className="w-3.5 h-3.5 text-[#315BDD]" /> {heroPost.readTime || heroPost.readingTime || '5 min read'}
                        </span>
                        <span></span>
                        <span>{heroPost.publishedAt ? new Date(heroPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[#315BDD] font-bold group-hover:translate-x-1 transition-transform">
                        <span>READ DISPATCH</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* ARTICLES GRID / LIST */}
        {loading ? (
          <div className="p-16 text-center font-mono text-xs text-[#718078]">
            QUERYING PRODUCTION DISPATCHES...
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-[#073B32]/14 space-y-3 font-mono">
            <BookOpen className="w-8 h-8 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold text-[#073B32]">NO ARTICLES FOUND</h3>
            <p className="text-xs text-[#718078]">
              No publications match your current filter or search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedTag('');
              }}
              className="text-[#315BDD] underline text-xs font-bold"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((article) => (
              <article
                key={article.slug}
                className="group flex flex-col bg-white rounded-xl border border-[#073B32]/16 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 hover:border-[#315BDD]"
              >
                {/* Cover Image */}
                {article.featuredImage ? (
                  <Link to={`/blogs/${article.slug}`} className="block overflow-hidden h-48 bg-gray-100">
                    <img
                      src={article.featuredImage}
                      alt={article.featuredImageAlt || article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                ) : (
                  <div className="h-28 bg-[#073B32]/5 border-b border-[#073B32]/10 p-4 flex items-center justify-between font-mono text-[10px] text-[#718078]">
                    <span className="text-[#315BDD] font-bold uppercase">{article.category}</span>
                    <span>{article.readTime || '5 min read'}</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#718078] mb-2">
                      <span className="text-[#315BDD] font-bold uppercase tracking-wider">
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime || article.readingTime || '5 min'}
                      </span>
                    </div>

                    <Link to={`/blogs/${article.slug}`} className="block group/title">
                      <h3 className="text-xl font-extrabold text-[#073B32] tracking-tight group-hover/title:text-[#315BDD] transition-colors mb-2.5 line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-[#073B32]/75 font-sans leading-relaxed mb-4 line-clamp-3">
                      {article.summary || article.excerpt}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags && article.tags.slice(0, 3).map((t) => (
                        <span key={t} className="tech-tag text-[9px]">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-[#073B32]/10 flex items-center justify-between font-mono text-xs">
                      <span className="text-[10px] text-[#718078]">
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '2026'}
                      </span>
                      <Link
                        to={`/blogs/${article.slug}`}
                        className="inline-flex items-center gap-1 font-bold text-[#073B32] group-hover:text-[#315BDD] transition-colors text-xs"
                      >
                        <span>READ</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {pagination.totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-3 font-mono text-xs">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-2 rounded-lg border border-[#073B32]/20 text-[#073B32] hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREVIOUS</span>
            </button>
            <span className="px-4 py-2 font-bold text-[#073B32]">
              PAGE {pagination.page} OF {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={currentPage >= pagination.totalPages}
              className="px-3 py-2 rounded-lg border border-[#073B32]/20 text-[#073B32] hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
            >
              <span>NEXT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default BlogPage;
