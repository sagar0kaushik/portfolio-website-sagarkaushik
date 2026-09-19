import React, { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BlogEditor } from '../components/admin/BlogEditor';
import {
  Shield, Lock, LogOut, Mail, PlusCircle, CheckCircle, Trash2, Calendar,
  BookOpen, Eye, Edit, Check, AlertTriangle, ExternalLink, RefreshCw,
  FolderPlus, Search, Filter, Globe, X
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, token, isAuthenticated, login, logout } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('blogs'); // 'blogs' | 'contacts' | 'new-project'
  const [statusMsg, setStatusMsg] = useState('');

  // Contacts State
  const [contacts, setContacts] = useState([]);

  // Blog CMS State
  const [adminBlogs, setAdminBlogs] = useState([]);
  const [blogMetrics, setBlogMetrics] = useState({ total: 0, published: 0, drafts: 0, views: 0 });
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [blogSearch, setBlogSearch] = useState('');
  const [blogStatusFilter, setBlogStatusFilter] = useState('all'); // 'all' | 'published' | 'draft'
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('all');
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteConfirmBlog, setDeleteConfirmBlog] = useState(null);
  const [previewBlogModal, setPreviewBlogModal] = useState(null);

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    title: '',
    slug: '',
    subtitle: '',
    category: 'FULL-STACK WEB APPLICATION',
    description: '',
    overview: '',
    problem: '',
    solution: '',
    technologies: 'REACT, NODE.JS, EXPRESS, MONGODB',
    features: 'Authentication, Responsive UI, REST APIs',
    architecture: '',
    implementation: '',
    challenges: '',
    learnings: '',
    githubUrl: '',
    liveUrl: '',
    previewType: 'dashboard'
  });

  useEffect(() => {
    if (isAuthenticated && token) {
      loadContacts();
      loadAdminBlogs();
    }
  }, [isAuthenticated, token]);

  const loadContacts = async () => {
    try {
      const res = await api.getContacts(token);
      if (res.success && res.data) {
        setContacts(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadAdminBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const res = await api.getAdminBlogs(token);
      if (res.success && res.data) {
        setAdminBlogs(res.data);
        if (res.metrics) {
          setBlogMetrics(res.metrics);
        }
      }
    } catch (err) {
      console.error('Error fetching admin blogs:', err);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const res = await login(credentials.username, credentials.password);
    if (!res.success) {
      setAuthError(res.message || 'Invalid credentials');
    }
  };

  const handleToggleBlogStatus = async (blog) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    try {
      const res = await api.toggleBlogStatus(blog._id, newStatus, token);
      if (res.success) {
        setStatusMsg(`Article "${blog.title}" status changed to ${newStatus.toUpperCase()}`);
        loadAdminBlogs();
      } else {
        setStatusMsg('Failed to update status: ' + (res.message || 'Error'));
      }
    } catch (err) {
      setStatusMsg('Error: ' + err.message);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      const res = await api.deleteBlog(blogId, token);
      if (res.success) {
        setStatusMsg('Article permanently deleted.');
        setDeleteConfirmBlog(null);
        loadAdminBlogs();
      } else {
        setStatusMsg('Failed to delete: ' + (res.message || 'Error'));
      }
    } catch (err) {
      setStatusMsg('Error: ' + err.message);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    const payload = {
      ...projectForm,
      technologies: projectForm.technologies.split(',').map(s => s.trim()),
      features: projectForm.features.split(',').map(s => s.trim())
    };
    const res = await api.createProject(payload, token);
    if (res.success) {
      setStatusMsg('Project created successfully!');
      setProjectForm({
        title: '',
        slug: '',
        subtitle: '',
        category: 'FULL-STACK WEB APPLICATION',
        description: '',
        overview: '',
        problem: '',
        solution: '',
        technologies: 'REACT, NODE.JS, EXPRESS, MONGODB',
        features: 'Authentication, Responsive UI, REST APIs',
        architecture: '',
        implementation: '',
        challenges: '',
        learnings: '',
        githubUrl: '',
        liveUrl: '',
        previewType: 'dashboard'
      });
    } else {
      setStatusMsg('Error creating project: ' + (res.message || 'Unknown error'));
    }
  };

  // Filtered admin blogs
  const filteredBlogs = adminBlogs.filter(b => {
    const matchesSearch = !blogSearch ||
      b.title?.toLowerCase().includes(blogSearch.toLowerCase()) ||
      b.category?.toLowerCase().includes(blogSearch.toLowerCase()) ||
      b.tags?.some(t => t.toLowerCase().includes(blogSearch.toLowerCase()));

    const matchesStatus = blogStatusFilter === 'all' || b.status === blogStatusFilter;
    const matchesCategory = blogCategoryFilter === 'all' || b.category === blogCategoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Extract distinct categories
  const blogCategories = Array.from(new Set(adminBlogs.map(b => b.category).filter(Boolean)));

  return (
    <main className="relative z-10 pt-28 md:pt-36 pb-24 px-6 md:px-12 min-h-screen">
      {/* Critical: Admin must have noindex and nofollow */}
      <SEO
        title="Admin Portal | Sagar Kaushik Portfolio"
        noindex={true}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between border-b border-[#073B32]/14 pb-4 mb-8 font-mono text-xs text-[#718078]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#315BDD]" />
            <span className="font-bold text-[#073B32] uppercase">SAGAR KAUSHIK // CONTROL CONSOLE</span>
          </div>
          <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded font-bold text-[10px]">
            PROTECTED NOINDEX / NOFOLLOW
          </span>
        </div>

        {!isAuthenticated ? (
          /* Login Form */
          <div className="max-w-md mx-auto mt-12 glass-panel p-8 rounded-2xl border border-[#073B32]/18 shadow-xl bg-white/80">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#073B32]/10">
              <div className="w-10 h-10 rounded-full bg-[#073B32] text-white flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-[#073B32] text-lg tracking-tight">Admin Authorization</h2>
                <p className="font-mono text-xs text-[#718078]">Enter administrative token credentials</p>
              </div>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono rounded">
                {authError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[#073B32] font-semibold mb-1 uppercase tracking-wider">USERNAME</label>
                <input
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="sagar"
                  className="w-full px-3 py-2 bg-white border border-[#073B32]/20 rounded focus:outline-none focus:border-[#315BDD]"
                />
              </div>

              <div>
                <label className="block text-[#073B32] font-semibold mb-1 uppercase tracking-wider">PASSWORD</label>
                <input
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Password"
                  className="w-full px-3 py-2 bg-white border border-[#073B32]/20 rounded focus:outline-none focus:border-[#315BDD]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#073B32] text-[#F3F0E6] py-3 rounded font-bold uppercase tracking-wider hover:bg-[#315BDD] transition-colors mt-2"
              >
                AUTHORIZE ROOT SESSION
              </button>
            </form>
          </div>
        ) : isEditingBlog ? (
          /* FULL TWO-COLUMN BLOG EDITOR COMPONENT */
          <BlogEditor
            blog={editingBlog}
            token={token}
            onCancel={() => {
              setIsEditingBlog(false);
              setEditingBlog(null);
            }}
            onSave={() => {
              setIsEditingBlog(false);
              setEditingBlog(null);
              loadAdminBlogs();
            }}
          />
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div>
            {/* Top Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-white/90 rounded-xl border border-[#073B32]/14 shadow-sm">
              <div className="font-mono text-xs text-[#073B32]">
                SESSION: <span className="font-bold text-[#315BDD]">{user?.username || 'sagar'}</span>
                <span className="ml-2 text-[#718078]">[FULL ACCESS ROOT]</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => setActiveTab('blogs')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'blogs' ? 'bg-[#073B32] text-white font-bold' : 'hover:bg-gray-100 text-[#073B32]'}`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>BLOG CMS ({blogMetrics.total})</span>
                </button>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'contacts' ? 'bg-[#073B32] text-white font-bold' : 'hover:bg-gray-100 text-[#073B32]'}`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>CONTACT INQUIRIES ({contacts.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('new-project')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'new-project' ? 'bg-[#073B32] text-white font-bold' : 'hover:bg-gray-100 text-[#073B32]'}`}
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>+ PROJECT</span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-rose-700 hover:text-rose-900 px-3 py-1.5 font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" /> LOGOUT
                </button>
              </div>
            </div>

            {statusMsg && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-900 font-mono text-xs rounded-lg flex items-center justify-between">
                <span>{statusMsg}</span>
                <button onClick={() => setStatusMsg('')} className="text-blue-700 hover:text-blue-900">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB: BLOG CMS MANAGEMENT */}
            {/* ==================================================== */}
            {activeTab === 'blogs' && (
              <div className="space-y-6">
                {/* METRICS ROW */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-[#073B32]/14 shadow-sm">
                    <div className="font-mono text-[11px] text-[#718078] uppercase font-bold tracking-wider mb-1">
                      TOTAL ARTICLES
                    </div>
                    <div className="text-3xl font-extrabold text-[#073B32]">
                      {blogMetrics.total}
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-[#073B32]/14 shadow-sm">
                    <div className="font-mono text-[11px] text-emerald-600 uppercase font-bold tracking-wider mb-1">
                      PUBLISHED (LIVE)
                    </div>
                    <div className="text-3xl font-extrabold text-emerald-700">
                      {blogMetrics.published}
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-[#073B32]/14 shadow-sm">
                    <div className="font-mono text-[11px] text-amber-600 uppercase font-bold tracking-wider mb-1">
                      DRAFTS (HIDDEN)
                    </div>
                    <div className="text-3xl font-extrabold text-amber-700">
                      {blogMetrics.drafts}
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-[#073B32]/14 shadow-sm">
                    <div className="font-mono text-[11px] text-[#315BDD] uppercase font-bold tracking-wider mb-1">
                      TOTAL VIEWS
                    </div>
                    <div className="text-3xl font-extrabold text-[#315BDD]">
                      {blogMetrics.views}
                    </div>
                  </div>
                </div>

                {/* SEARCH, FILTER & ACTION BAR */}
                <div className="bg-white p-4 rounded-xl border border-[#073B32]/14 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={blogSearch}
                        onChange={(e) => setBlogSearch(e.target.value)}
                        placeholder="Search articles by title, tag..."
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-sans focus:outline-none focus:border-[#315BDD]"
                      />
                    </div>

                    {/* Status Filter */}
                    <select
                      value={blogStatusFilter}
                      onChange={(e) => setBlogStatusFilter(e.target.value)}
                      className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs text-[#073B32]"
                    >
                      <option value="all">ALL STATUSES</option>
                      <option value="published">PUBLISHED ONLY</option>
                      <option value="draft">DRAFTS ONLY</option>
                    </select>

                    {/* Category Filter */}
                    {blogCategories.length > 0 && (
                      <select
                        value={blogCategoryFilter}
                        onChange={(e) => setBlogCategoryFilter(e.target.value)}
                        className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs text-[#073B32]"
                      >
                        <option value="all">ALL CATEGORIES</option>
                        {blogCategories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Create Article Button */}
                  <button
                    onClick={() => {
                      setEditingBlog(null);
                      setIsEditingBlog(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#073B32] hover:bg-[#315BDD] text-white rounded-lg font-mono text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ NEW PUBLICATION</span>
                  </button>
                </div>

                {/* ARTICLES TABLE */}
                <div className="bg-white rounded-xl border border-[#073B32]/14 shadow-sm overflow-hidden">
                  {loadingBlogs ? (
                    <div className="p-12 text-center font-mono text-xs text-[#718078]">
                      LOADING ARTICLES REPOSITORY...
                    </div>
                  ) : filteredBlogs.length === 0 ? (
                    <div className="p-12 text-center space-y-3 font-mono">
                      <BookOpen className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-xs text-[#718078]">No articles found matching your criteria.</p>
                      <button
                        onClick={() => {
                          setEditingBlog(null);
                          setIsEditingBlog(true);
                        }}
                        className="text-[#315BDD] font-bold text-xs underline"
                      >
                        Create your first article now
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-sans text-xs">
                        <thead className="bg-[#f7f6f2] font-mono text-[11px] uppercase tracking-wider text-[#718078] border-b border-[#073B32]/10">
                          <tr>
                            <th className="p-3.5 pl-6 font-bold">ARTICLE</th>
                            <th className="p-3.5 font-bold">CATEGORY</th>
                            <th className="p-3.5 font-bold">STATUS</th>
                            <th className="p-3.5 font-bold">VIEWS</th>
                            <th className="p-3.5 font-bold">DATE</th>
                            <th className="p-3.5 pr-6 text-right font-bold">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#073B32]/10">
                          {filteredBlogs.map((b) => (
                            <tr key={b._id} className="hover:bg-blue-50/30 transition-colors">
                              {/* Title & Cover */}
                              <td className="p-3.5 pl-6">
                                <div className="flex items-center gap-3">
                                  {b.featuredImage ? (
                                    <img
                                      src={b.featuredImage}
                                      alt={b.title}
                                      className="w-12 h-10 object-cover rounded border border-[#073B32]/14 flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-12 h-10 bg-gray-100 rounded border border-[#073B32]/10 flex items-center justify-center flex-shrink-0 text-gray-400 font-mono text-[10px]">
                                      NO IMG
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-bold text-[#073B32] text-sm line-clamp-1">
                                      {b.title}
                                    </div>
                                    <div className="font-mono text-[10px] text-[#718078] flex items-center gap-1.5">
                                      <span>/blogs/{b.slug}</span>
                                      {b.isFeatured && (
                                        <span className="text-[#315BDD] font-bold"> FEATURED</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Category */}
                              <td className="p-3.5">
                                <span className="font-mono text-[11px] text-[#315BDD] font-bold">
                                  {b.category}
                                </span>
                              </td>

                              {/* Status Badge */}
                              <td className="p-3.5">
                                <button
                                  onClick={() => handleToggleBlogStatus(b)}
                                  title="Click to toggle status"
                                  className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold transition-all ${
                                    b.status === 'published'
                                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                  }`}
                                >
                                  {b.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                                </button>
                              </td>

                              {/* Views */}
                              <td className="p-3.5 font-mono text-xs text-[#073B32]">
                                {b.views || 0}
                              </td>

                              {/* Date */}
                              <td className="p-3.5 font-mono text-[11px] text-[#718078]">
                                {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : 'Draft'}
                              </td>

                              {/* Actions */}
                              <td className="p-3.5 pr-6 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* View Public / Preview */}
                                  <a
                                    href={`/blogs/${b.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-gray-500 hover:text-[#315BDD] rounded hover:bg-gray-100"
                                    title="View live article"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>

                                  {/* Edit */}
                                  <button
                                    onClick={() => {
                                      setEditingBlog(b);
                                      setIsEditingBlog(true);
                                    }}
                                    className="p-1.5 text-[#073B32] hover:text-[#315BDD] rounded hover:bg-gray-100"
                                    title="Edit article"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    onClick={() => setDeleteConfirmBlog(b)}
                                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded hover:bg-gray-100"
                                    title="Delete article"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB: CONTACT SUBMISSIONS */}
            {/* ==================================================== */}
            {activeTab === 'contacts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs font-bold text-[#073B32] uppercase tracking-wider">
                    STORED CONTACT SUBMISSIONS (REST API / MONGODB)
                  </h3>
                  <button
                    onClick={loadContacts}
                    className="flex items-center gap-1 text-xs font-mono text-[#315BDD] hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" /> REFRESH
                  </button>
                </div>

                {contacts.length === 0 ? (
                  <div className="p-12 text-center font-mono text-xs text-[#718078] bg-white rounded-xl border border-[#073B32]/10">
                    NO CONTACT MESSAGES IN RECORD YET.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {contacts.map((c) => (
                      <div
                        key={c._id}
                        className="p-5 bg-white rounded-xl border border-[#073B32]/16 shadow-sm space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between font-mono text-xs border-b border-gray-100 pb-2">
                          <span className="font-bold text-[#073B32] text-sm">{c.name}</span>
                          <span className="text-[#315BDD] font-semibold">{c.email}</span>
                          <span className="text-[#718078] text-[10px]">
                            {new Date(c.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="font-sans text-sm text-[#073B32] whitespace-pre-wrap leading-relaxed">
                          {c.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB: NEW SPECIFICATION PROJECT */}
            {/* ==================================================== */}
            {activeTab === 'new-project' && (
              <form onSubmit={handleCreateProject} className="bg-white p-6 rounded-xl border border-[#073B32]/16 space-y-4 font-mono text-xs">
                <h3 className="font-bold text-[#073B32] uppercase tracking-wider text-sm border-b pb-2">
                  ADD NEW SPECIFICATION PROJECT
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#073B32] mb-1 font-semibold">TITLE *</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. DISTRIBUTED QUEUE SYSTEM"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[#073B32] mb-1 font-semibold">SLUG *</label>
                    <input
                      type="text"
                      required
                      value={projectForm.slug}
                      onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value.toLowerCase() })}
                      placeholder="e.g. distributed-queue-system"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[#073B32] mb-1 font-semibold">SUBTITLE</label>
                    <input
                      type="text"
                      value={projectForm.subtitle}
                      onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                      placeholder="e.g. HIGH-THROUGHPUT MESSAGE BROKER"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[#073B32] mb-1 font-semibold">CATEGORY</label>
                    <input
                      type="text"
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[#073B32] mb-1 font-semibold">DESCRIPTION *</label>
                    <textarea
                      rows={2}
                      required
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[#073B32] mb-1 font-semibold">GITHUB URL *</label>
                    <input
                      type="url"
                      required
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                      placeholder="https://github.com/sagar0kaushik/..."
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[#073B32] mb-1 font-semibold">LIVE URL</label>
                    <input
                      type="url"
                      value={projectForm.liveUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[#073B32] mb-1 font-semibold">TECHNOLOGIES (comma-separated)</label>
                    <input
                      type="text"
                      value={projectForm.technologies}
                      onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[#073B32] mb-1 font-semibold">PREVIEW TYPE</label>
                    <select
                      value={projectForm.previewType}
                      onChange={(e) => setProjectForm({ ...projectForm, previewType: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="ecommerce">Ecommerce</option>
                      <option value="dashboard">Dashboard</option>
                      <option value="banking">Banking</option>
                      <option value="weather">Weather</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-[#073B32] text-[#F3F0E6] px-6 py-2.5 rounded font-bold uppercase hover:bg-[#315BDD] transition-colors"
                >
                  SAVE PROJECT TO DATABASE
                </button>
              </form>
            )}
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteConfirmBlog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-[#073B32]/20 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <h3 className="text-lg font-bold text-[#073B32]">Delete Article?</h3>
              </div>
              <p className="text-sm text-[#073B32]/80 leading-relaxed font-sans">
                Are you sure you want to permanently delete{' '}
                <span className="font-bold text-[#073B32]">"{deleteConfirmBlog.title}"</span>?
                This action cannot be undone and will remove the publication from the database.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmBlog(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 font-mono text-xs font-bold text-gray-700 hover:bg-gray-100"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => handleDeleteBlog(deleteConfirmBlog._id)}
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white font-mono text-xs font-bold hover:bg-rose-700"
                >
                  CONFIRM DELETE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
