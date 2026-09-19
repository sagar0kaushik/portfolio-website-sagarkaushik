import React, { useState, useEffect, useRef } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, CheckSquare, Quote, Link as LinkIcon, Image as ImageIcon,
  Code, Table, Minus, Video, AlertCircle, Info, Lightbulb, Eye, Edit3,
  Columns, Save, ArrowLeft, Check, AlertTriangle, Upload, RefreshCw, Globe
} from 'lucide-react';
import { api } from '../../services/api';
import { MarkdownRenderer } from '../MarkdownRenderer';

export const BlogEditor = ({ blog, onSave, onCancel, token }) => {
  // Mode: 'write' | 'split' | 'preview'
  const [viewMode, setViewMode] = useState('write');

  // Core Form State
  const [title, setTitle] = useState(blog?.title || '');
  const [slug, setSlug] = useState(blog?.slug || '');
  const [slugEdited, setSlugEdited] = useState(Boolean(blog?.slug));
  const [slugStatus, setSlugStatus] = useState({ checking: false, available: true, message: '' });
  const [content, setContent] = useState(blog?.content || '');
  const [category, setCategory] = useState(blog?.category || 'AI & Full Stack');
  const [newCategory, setNewCategory] = useState('');
  const [tags, setTags] = useState(blog?.tags || ['MERN', 'AI', 'Full Stack']);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState(blog?.status || 'draft');
  const [isFeatured, setIsFeatured] = useState(blog?.isFeatured || false);
  const [featuredImage, setFeaturedImage] = useState(blog?.featuredImage || '');
  const [featuredImageAlt, setFeaturedImageAlt] = useState(blog?.featuredImageAlt || '');
  const [summary, setSummary] = useState(blog?.summary || blog?.excerpt || '');
  const [seoTitle, setSeoTitle] = useState(blog?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(blog?.seoDescription || '');
  const [publishedAt, setPublishedAt] = useState(
    blog?.publishedAt
      ? new Date(blog.publishedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );

  // Uploading state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const inlineImageInputRef = useRef(null);

  // Available default categories
  const defaultCategories = [
    'AI & Full Stack',
    'System Architecture',
    'Cloud & DevOps',
    'Backend Systems',
    'Frontend Engineering',
    'Database Optimization',
    'Security & Auth'
  ];

  // Auto-generate slug from title if user hasn't manually edited slug
  useEffect(() => {
    if (!slugEdited && title) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  }, [title, slugEdited]);

  // Debounced check slug availability
  useEffect(() => {
    if (!slug) {
      setSlugStatus({ checking: false, available: false, message: 'Slug cannot be empty' });
      return;
    }

    const timer = setTimeout(async () => {
      setSlugStatus({ checking: true, available: false, message: 'Validating slug...' });
      try {
        const res = await api.checkSlug(slug, blog?._id, token);
        if (res.success && res.available) {
          setSlugStatus({ checking: false, available: true, message: 'Slug is available' });
        } else {
          setSlugStatus({ checking: false, available: false, message: res.message || 'Slug already taken' });
        }
      } catch (err) {
        setSlugStatus({ checking: false, available: true, message: 'Validation bypassed' });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [slug, blog?._id, token]);

  // Word count and reading time
  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  // Insert markdown helper at cursor
  const insertText = (before, after = '', placeholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || placeholder;
    const replacement = `${before}${selected}${after}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + before.length + selected.length + after.length;
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  // Add Tag
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Upload Featured Cover Image
  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.uploadBlogImage(formData, token);
      if (res.success && res.imageUrl) {
        setFeaturedImage(res.imageUrl);
        setFeedback({ type: 'success', message: 'Cover image uploaded!' });
      } else {
        setFeedback({ type: 'error', message: res.message || 'Image upload failed' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Upload error: ' + err.message });
    } finally {
      setUploadingImage(false);
    }
  };

  // Upload Inline Image and insert markdown
  const handleInlineImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.uploadBlogImage(formData, token);
      if (res.success && res.imageUrl) {
        insertText(`\n![Image description|center](`, `)\n`, res.imageUrl);
        setFeedback({ type: 'success', message: 'Inline image uploaded & inserted!' });
      } else {
        setFeedback({ type: 'error', message: res.message || 'Image upload failed' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Upload error: ' + err.message });
    } finally {
      setUploadingImage(false);
    }
  };

  // Save handler
  const handleSubmit = async (overrideStatus) => {
    if (!title.trim()) {
      setFeedback({ type: 'error', message: 'Article title is required' });
      return;
    }
    if (!slug.trim()) {
      setFeedback({ type: 'error', message: 'Valid slug is required' });
      return;
    }
    if (!content.trim()) {
      setFeedback({ type: 'error', message: 'Article content cannot be empty' });
      return;
    }

    const finalStatus = overrideStatus || status;
    const finalCategory = newCategory.trim() ? newCategory.trim() : category;

    const payload = {
      title,
      slug,
      category: finalCategory,
      tags,
      content,
      summary: summary || title,
      excerpt: summary || title,
      status: finalStatus,
      isFeatured,
      featuredImage,
      featuredImageAlt: featuredImageAlt || title,
      readTime: readingTime,
      readingTime,
      seoTitle: seoTitle || `${title} | Sagar Kaushik`,
      seoDescription: seoDescription || summary || `${title} by Sagar Kaushik`,
      canonicalUrl: `https://sagarkaushik.com/blogs/${slug}`,
      publishedAt: finalStatus === 'published' ? (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()) : null
    };

    setIsSaving(true);
    setFeedback(null);
    try {
      let res;
      if (blog?._id) {
        res = await api.updateBlog(blog._id, payload, token);
      } else {
        res = await api.createBlog(payload, token);
      }

      if (res.success) {
        setFeedback({ type: 'success', message: 'Article successfully saved!' });
        setTimeout(() => {
          onSave(res.data);
        }, 800);
      } else {
        setFeedback({ type: 'error', message: res.message || 'Failed to save article' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error saving article: ' + err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#fcfbf9] border border-[#073B32]/18 rounded-2xl shadow-xl overflow-hidden text-[#073B32]">
      {/* Top Action Header */}
      <div className="bg-white px-6 py-4 border-b border-[#073B32]/14 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#073B32]/20 hover:bg-gray-100 font-mono text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO ARTICLES</span>
          </button>
          <div>
            <span className="font-mono text-xs font-bold tracking-widest text-[#315BDD] uppercase">
              {blog?._id ? 'EDITING ARTICLE' : 'CREATING NEW PUBLICATION'}
            </span>
            <div className="font-mono text-[11px] text-[#718078]">
              {wordCount} words  {readingTime}
            </div>
          </div>
        </div>

        {/* View Mode Switcher + Action Buttons */}
        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 font-mono text-xs mr-2">
            <button
              onClick={() => setViewMode('write')}
              type="button"
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${viewMode === 'write' ? 'bg-white shadow text-[#073B32] font-bold' : 'text-[#718078]'}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>WRITE</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              type="button"
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${viewMode === 'split' ? 'bg-white shadow text-[#073B32] font-bold' : 'text-[#718078]'}`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>SPLIT</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              type="button"
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${viewMode === 'preview' ? 'bg-white shadow text-[#073B32] font-bold' : 'text-[#718078]'}`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>PREVIEW</span>
            </button>
          </div>

          {/* Quick Draft button */}
          <button
            onClick={() => handleSubmit('draft')}
            disabled={isSaving}
            type="button"
            className="px-3.5 py-1.5 rounded-lg border border-[#073B32]/30 hover:bg-gray-100 font-mono text-xs font-bold transition-colors disabled:opacity-50"
          >
            SAVE AS DRAFT
          </button>

          {/* Publish / Update Button */}
          <button
            onClick={() => handleSubmit('published')}
            disabled={isSaving}
            type="button"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#073B32] hover:bg-[#315BDD] text-white font-mono text-xs font-bold transition-colors shadow disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{status === 'published' ? 'UPDATE PUBLISHED POST' : 'PUBLISH POST'}</span>
          </button>
        </div>
      </div>

      {/* Alert banner if feedback */}
      {feedback && (
        <div className={`px-6 py-2.5 font-mono text-xs flex items-center gap-2 ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' : 'bg-rose-50 text-rose-800 border-b border-rose-200'}`}>
          {feedback.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 2-COLUMN CMS WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* LEFT COLUMN: MAIN EDITOR (col-span-8) */}
        <div className="lg:col-span-8 p-6 lg:border-r border-[#073B32]/14 bg-white flex flex-col min-h-[700px]">
          {/* Article Title Input */}
          <div className="mb-4">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title here..."
              className="w-full text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#073B32] placeholder-[#073B32]/30 border-none outline-none focus:ring-0 px-0 bg-transparent font-sans tracking-tight"
            />
          </div>

          {/* Rich Markdown Formatting Toolbar */}
          <div className="bg-[#f7f6f2] border border-[#073B32]/14 rounded-xl p-2 mb-4 flex flex-wrap items-center gap-1 text-[#073B32]">
            {/* Headings */}
            <button
              type="button"
              onClick={() => insertText('# ', '', 'Heading 1')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm font-bold text-xs"
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('## ', '', 'Heading 2')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm font-bold text-xs"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('### ', '', 'Heading 3')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm font-bold text-xs"
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <span className="h-4 w-[1px] bg-[#073B32]/20 mx-1" />

            {/* Basic Typography */}
            <button
              type="button"
              onClick={() => insertText('**', '**', 'bold text')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('*', '*', 'italic text')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('<u>', '</u>', 'underlined text')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('~~', '~~', 'strikethrough')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm"
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <span className="h-4 w-[1px] bg-[#073B32]/20 mx-1" />

            {/* Lists & Checklists */}
            <button
              type="button"
              onClick={() => insertText('- ', '', 'List item')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm"
              title="Bullet list"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('1. ', '', 'Numbered item')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm"
              title="Numbered list"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('- [ ] ', '', 'Checklist task')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm"
              title="Checklist"
            >
              <CheckSquare className="w-4 h-4" />
            </button>

            <span className="h-4 w-[1px] bg-[#073B32]/20 mx-1" />

            {/* Quotes, Links, Code, Tables */}
            <button
              type="button"
              onClick={() => insertText('> ', '', 'Quotation')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm"
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('[', '](https://example.com)', 'Link title')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm"
              title="Insert Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => inlineImageInputRef.current?.click()}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm text-[#315BDD]"
              title="Upload & Insert Inline Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={inlineImageInputRef}
              onChange={handleInlineImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => insertText('`', '`', 'code')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm"
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('\n```javascript\n', '\n```\n', '// Code block here')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm font-mono text-xs font-bold"
              title="Code Block"
            >
              {'</>'}
            </button>
            <button
              type="button"
              onClick={() => insertText('\n| Feature | Specification | Status |\n|---|---|---|\n| API Engine | Express.js REST | Production |\n| Database | MongoDB Atlas | Connected |\n')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm"
              title="Insert Table"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('\n---\n')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm"
              title="Horizontal Divider"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertText('\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ\n')}
              className="p-1.5 rounded hover:bg-white hover:shadow-sm"
              title="Embed YouTube Video"
            >
              <Video className="w-4 h-4" />
            </button>

            <span className="h-4 w-[1px] bg-[#073B32]/20 mx-1" />

            {/* Callout Boxes */}
            <button
              type="button"
              onClick={() => insertText('\n> [!NOTE]\n> Write your note information here.\n')}
              className="px-2 py-1 rounded hover:bg-white hover:shadow-sm font-mono text-[11px] font-bold text-blue-700 flex items-center gap-1"
              title="Note Box"
            >
              <Info className="w-3.5 h-3.5" />
              <span>NOTE</span>
            </button>
            <button
              type="button"
              onClick={() => insertText('\n> [!TIP]\n> Write practical performance tip here.\n')}
              className="px-2 py-1 rounded hover:bg-white hover:shadow-sm font-mono text-[11px] font-bold text-emerald-700 flex items-center gap-1"
              title="Tip Box"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>TIP</span>
            </button>
            <button
              type="button"
              onClick={() => insertText('\n> [!WARNING]\n> High-priority security warning or caveat.\n')}
              className="px-2 py-1 rounded hover:bg-white hover:shadow-sm font-mono text-[11px] font-bold text-amber-700 flex items-center gap-1"
              title="Warning Box"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>WARN</span>
            </button>
          </div>

          {/* Editor / Preview Area */}
          <div className="flex-1 flex flex-col">
            {viewMode === 'write' && (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content using markdown... Supports # Headings, ```code, tables, callouts, and images."
                className="w-full flex-1 min-h-[550px] p-4 bg-[#fcfbf9] border border-[#073B32]/12 rounded-xl font-mono text-sm leading-relaxed text-[#073B32] focus:outline-none focus:border-[#315BDD] resize-y"
              />
            )}

            {viewMode === 'preview' && (
              <div className="flex-1 min-h-[550px] p-6 bg-white border border-[#073B32]/12 rounded-xl overflow-y-auto">
                <div className="border-b border-[#073B32]/12 pb-4 mb-6">
                  <div className="font-mono text-xs text-[#315BDD] uppercase font-bold mb-1">
                    LIVE ARTICLE PREVIEW
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073B32]">
                    {title || 'Untitled Article'}
                  </h1>
                </div>
                {featuredImage && (
                  <div className="mb-6 rounded-xl overflow-hidden max-h-[360px] border border-[#073B32]/16">
                    <img src={featuredImage} alt={featuredImageAlt || title} className="w-full h-full object-cover" />
                  </div>
                )}
                <MarkdownRenderer content={content} />
              </div>
            )}

            {viewMode === 'split' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[550px]">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Markdown editor..."
                  className="w-full h-full min-h-[550px] p-4 bg-[#fcfbf9] border border-[#073B32]/12 rounded-xl font-mono text-xs leading-relaxed text-[#073B32] focus:outline-none focus:border-[#315BDD] resize-none"
                />
                <div className="h-full min-h-[550px] p-4 bg-white border border-[#073B32]/12 rounded-xl overflow-y-auto text-xs">
                  <div className="font-mono text-[11px] text-[#315BDD] uppercase font-bold mb-2">
                    LIVE SPLIT PREVIEW
                  </div>
                  <h2 className="text-xl font-bold text-[#073B32] mb-3">
                    {title || 'Untitled Article'}
                  </h2>
                  <MarkdownRenderer content={content} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR METADATA (col-span-4) */}
        <div className="lg:col-span-4 p-6 bg-[#f7f6f2] space-y-6 font-mono text-xs border-t lg:border-t-0">
          {/* Publish Status & Visibility */}
          <div className="bg-white p-4 rounded-xl border border-[#073B32]/14 shadow-sm space-y-3">
            <label className="block text-[#073B32] font-bold uppercase tracking-wider text-[11px]">
              PUBLISHING STATUS
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`py-2 px-3 rounded-lg border text-center font-bold transition-all ${status === 'draft' ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                DRAFT
              </button>
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`py-2 px-3 rounded-lg border text-center font-bold transition-all ${status === 'published' ? 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                PUBLISHED
              </button>
            </div>

            {/* Featured Post Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-[11px] font-bold text-[#073B32]">HERO FEATURED POST</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#315BDD]"></div>
              </label>
            </div>

            {/* Published Date */}
            <div className="pt-2">
              <label className="block text-[#718078] text-[10px] uppercase font-bold mb-1">
                PUBLICATION DATE
              </label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded font-mono text-xs"
              />
            </div>
          </div>

          {/* Featured Cover Image */}
          <div className="bg-white p-4 rounded-xl border border-[#073B32]/14 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[#073B32] font-bold uppercase tracking-wider text-[11px]">
                FEATURED COVER IMAGE
              </label>
              {featuredImage && (
                <button
                  type="button"
                  onClick={() => setFeaturedImage('')}
                  className="text-rose-600 hover:underline text-[10px] font-bold"
                >
                  REMOVE
                </button>
              )}
            </div>

            {/* Upload Box or Preview */}
            {featuredImage ? (
              <div className="relative rounded-lg overflow-hidden border border-[#073B32]/20 max-h-48 group">
                <img
                  src={featuredImage}
                  alt={featuredImageAlt || 'Cover image'}
                  className="w-full h-36 object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs"
                >
                  CHANGE IMAGE
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-[#315BDD] rounded-lg p-4 text-center cursor-pointer transition-colors bg-gray-50 hover:bg-blue-50/50"
              >
                <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                <span className="text-[11px] text-gray-600 font-bold block">
                  {uploadingImage ? 'UPLOADING...' : 'CLICK TO UPLOAD COVER'}
                </span>
                <span className="text-[10px] text-gray-400 block">PNG, JPG, WEBP up to 5MB</span>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFeaturedImageUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Direct Image URL input */}
            <div>
              <label className="block text-[#718078] text-[10px] uppercase font-bold mb-1">
                OR IMAGE URL
              </label>
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-[11px]"
              />
            </div>

            {/* Alt text */}
            <div>
              <label className="block text-[#718078] text-[10px] uppercase font-bold mb-1">
                IMAGE ALT TEXT (SEO)
              </label>
              <input
                type="text"
                value={featuredImageAlt}
                onChange={(e) => setFeaturedImageAlt(e.target.value)}
                placeholder="Descriptive alt text for Google Image SEO"
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-[11px]"
              />
            </div>
          </div>

          {/* Category & Tags */}
          <div className="bg-white p-4 rounded-xl border border-[#073B32]/14 shadow-sm space-y-3">
            <label className="block text-[#073B32] font-bold uppercase tracking-wider text-[11px]">
              CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-[#073B32]"
            >
              {defaultCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Or specify custom category..."
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-[11px]"
            />

            <div className="pt-2 border-t border-gray-100">
              <label className="block text-[#073B32] font-bold uppercase tracking-wider text-[11px] mb-1">
                TAGS (PRESS ENTER TO ADD)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 bg-[#073B32]/10 text-[#073B32] px-2 py-0.5 rounded text-[10px] font-bold"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-gray-500 hover:text-rose-600"
                    >
                      
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag and press Enter..."
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-[11px]"
              />
            </div>
          </div>

          {/* Slug & URL */}
          <div className="bg-white p-4 rounded-xl border border-[#073B32]/14 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[#073B32] font-bold uppercase tracking-wider text-[11px]">
                URL SLUG
              </label>
              <button
                type="button"
                onClick={() => setSlugEdited(!slugEdited)}
                className="text-[10px] text-[#315BDD] font-bold underline"
              >
                {slugEdited ? 'LOCK AUTO' : 'CUSTOM EDIT'}
              </button>
            </div>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugEdited(true);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
              }}
              placeholder="post-slug-url"
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs font-mono"
            />
            {/* Slug status message */}
            <div className="flex items-center gap-1.5 text-[10px]">
              {slugStatus.checking ? (
                <span className="text-gray-500">Checking availability...</span>
              ) : slugStatus.available ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> {slugStatus.message}
                </span>
              ) : (
                <span className="text-rose-700 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {slugStatus.message}
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-500 break-all">
              Canonical: https://sagarkaushik.com/blogs/{slug || 'slug'}
            </p>
          </div>

          {/* Excerpt / Summary */}
          <div className="bg-white p-4 rounded-xl border border-[#073B32]/14 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[#073B32] font-bold uppercase tracking-wider text-[11px]">
                EXCERPT / CARD SUMMARY
              </label>
              <span className="text-[10px] text-gray-500">{summary.length}/200</span>
            </div>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Concise summary shown on blog list cards and previews..."
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded font-sans text-xs text-[#073B32]"
            />
          </div>

          {/* SEO Metadata & Live SERP Preview */}
          <div className="bg-white p-4 rounded-xl border border-[#073B32]/14 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 text-[#073B32] font-bold uppercase tracking-wider text-[11px]">
              <Globe className="w-3.5 h-3.5 text-[#315BDD]" />
              <span>SEARCH ENGINE OPTIMIZATION</span>
            </div>

            {/* SEO Title */}
            <div>
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-[#718078] font-bold uppercase">SEO META TITLE</span>
                <span className={seoTitle.length > 60 ? 'text-amber-600 font-bold' : 'text-gray-500'}>
                  {seoTitle.length || (title ? title.length + 16 : 0)} / 60
                </span>
              </div>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title ? `${title} | Sagar Kaushik` : 'Title for Google search results'}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-[11px]"
              />
            </div>

            {/* SEO Description */}
            <div>
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-[#718078] font-bold uppercase">SEO META DESCRIPTION</span>
                <span className={seoDescription.length > 160 ? 'text-amber-600 font-bold' : 'text-gray-500'}>
                  {seoDescription.length || summary.length} / 160
                </span>
              </div>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder={summary || 'Snippet describing the article for Google search results'}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-[11px] font-sans"
              />
            </div>

            {/* Google SERP Preview */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 font-sans text-left space-y-1">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                GOOGLE SERP PREVIEW
              </div>
              <div className="text-xs text-[#202124] flex items-center gap-1">
                <span className="text-gray-700 font-medium">sagarkaushik.com</span>
                <span className="text-gray-400">? blogs ? {slug || 'article'}</span>
              </div>
              <div className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
                {seoTitle || (title ? `${title} | Sagar Kaushik` : 'Article Title | Sagar Kaushik')}
              </div>
              <div className="text-xs text-[#4d5156] line-clamp-2 leading-snug">
                {seoDescription || summary || 'Learn full-stack architecture, backend systems design, and production optimizations with Sagar Kaushik.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
