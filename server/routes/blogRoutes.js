import express from 'express';
import { Blog } from '../models/Blog.js';
import { memoryStore, getDbStatus } from '../config/db.js';
import { requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Helper: Calculate reading time from text content
const calculateReadingTime = (text = '') => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

// Helper: Generate clean URL-safe slug
const slugify = (text = '') => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// -------------------------------------------------------------
// PUBLIC ROUTES
// -------------------------------------------------------------

// GET /api/blog/categories - Get distinct categories with counts
router.get('/categories', async (req, res) => {
  try {
    const { mode } = getDbStatus();
    let categories = [];

    if (mode === 'mongodb') {
      const agg = await Blog.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      categories = agg.map(c => ({ name: c._id || 'Uncategorized', count: c.count }));
    } else {
      const counts = {};
      memoryStore.blogs
        .filter(b => b.status === 'published')
        .forEach(b => {
          const cat = b.category || 'Uncategorized';
          counts[cat] = (counts[cat] || 0) + 1;
        });
      categories = Object.entries(counts).map(([name, count]) => ({ name, count }));
    }

    return res.json({ success: true, data: categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blog/tags - Get distinct tags
router.get('/tags', async (req, res) => {
  try {
    const { mode } = getDbStatus();
    let tags = [];

    if (mode === 'mongodb') {
      tags = await Blog.distinct('tags', { status: 'published' });
    } else {
      const tagSet = new Set();
      memoryStore.blogs
        .filter(b => b.status === 'published')
        .forEach(b => (b.tags || []).forEach(t => tagSet.add(t)));
      tags = Array.from(tagSet);
    }

    return res.json({ success: true, data: tags.filter(Boolean) });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blog/featured - Get featured published articles
router.get('/featured', async (req, res) => {
  try {
    const { mode } = getDbStatus();
    let featured = [];

    if (mode === 'mongodb') {
      featured = await Blog.find({ status: 'published', isFeatured: true })
        .select('-content')
        .sort({ publishedAt: -1 })
        .limit(3);

      if (featured.length === 0) {
        featured = await Blog.find({ status: 'published' })
          .select('-content')
          .sort({ publishedAt: -1 })
          .limit(2);
      }
    } else {
      featured = memoryStore.blogs
        .filter(b => b.status === 'published' && b.isFeatured)
        .slice(0, 3);
      if (featured.length === 0) {
        featured = memoryStore.blogs
          .filter(b => b.status === 'published')
          .slice(0, 2);
      }
    }

    return res.json({ success: true, data: featured });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blog - Public list of published blog posts with search, filter, pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, tag, sort = 'newest', page = 1, limit = 9 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));
    const skip = (pageNum - 1) * limitNum;

    const { mode } = getDbStatus();
    let blogs = [];
    let total = 0;

    if (mode === 'mongodb') {
      const query = { status: 'published' };

      if (category && category !== 'All') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }

      if (tag) {
        query.tags = { $in: [tag] };
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: regex },
          { excerpt: regex },
          { summary: regex },
          { content: regex },
          { category: regex },
          { tags: regex }
        ];
      }

      let sortOptions = { publishedAt: -1 };
      if (sort === 'oldest') sortOptions = { publishedAt: 1 };
      if (sort === 'popular') sortOptions = { views: -1, publishedAt: -1 };

      total = await Blog.countDocuments(query);
      blogs = await Blog.find(query)
        .select('-content')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum);
    } else {
      let filtered = memoryStore.blogs.filter(b => b.status === 'published');

      if (category && category !== 'All') {
        filtered = filtered.filter(b => (b.category || '').toLowerCase() === category.toLowerCase());
      }

      if (tag) {
        filtered = filtered.filter(b => (b.tags || []).includes(tag));
      }

      if (search && search.trim()) {
        const term = search.trim().toLowerCase();
        filtered = filtered.filter(b =>
          (b.title || '').toLowerCase().includes(term) ||
          (b.excerpt || b.summary || '').toLowerCase().includes(term) ||
          (b.content || '').toLowerCase().includes(term) ||
          (b.category || '').toLowerCase().includes(term) ||
          (b.tags || []).some(t => t.toLowerCase().includes(term))
        );
      }

      if (sort === 'oldest') {
        filtered.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
      } else if (sort === 'popular') {
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
      } else {
        filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      }

      total = filtered.length;
      blogs = filtered.slice(skip, skip + limitNum).map(b => {
        const { content, ...rest } = b;
        return rest;
      });
    }

    return res.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blog/:slug - Single blog post with related and prev/next navigation
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { mode } = getDbStatus();
    let blog = null;
    let related = [];
    let prev = null;
    let next = null;

    if (mode === 'mongodb') {
      blog = await Blog.findOne({ slug: slug.toLowerCase() });

      if (!blog) {
        return res.status(404).json({ success: false, message: `Article with slug "${slug}" was not found.` });
      }

      // Increment views count asynchronously
      Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } }).exec();

      // Related articles (matching category or shared tags)
      related = await Blog.find({
        status: 'published',
        slug: { $ne: blog.slug },
        $or: [{ category: blog.category }, { tags: { $in: blog.tags || [] } }]
      })
        .select('title slug excerpt summary category featuredImage readingTime publishedAt')
        .limit(3);

      // Prev and Next articles
      const older = await Blog.find({ status: 'published', publishedAt: { $lt: blog.publishedAt } })
        .select('title slug')
        .sort({ publishedAt: -1 })
        .limit(1);
      const newer = await Blog.find({ status: 'published', publishedAt: { $gt: blog.publishedAt } })
        .select('title slug')
        .sort({ publishedAt: 1 })
        .limit(1);

      prev = older[0] || null;
      next = newer[0] || null;
    } else {
      const idx = memoryStore.blogs.findIndex(b => b.slug.toLowerCase() === slug.toLowerCase());
      if (idx === -1) {
        return res.status(404).json({ success: false, message: `Article with slug "${slug}" was not found.` });
      }

      blog = memoryStore.blogs[idx];
      blog.views = (blog.views || 0) + 1;

      related = memoryStore.blogs
        .filter(b => b.status === 'published' && b.slug !== blog.slug && b.category === blog.category)
        .slice(0, 3)
        .map(b => ({
          title: b.title,
          slug: b.slug,
          excerpt: b.excerpt || b.summary,
          category: b.category,
          featuredImage: b.featuredImage,
          readingTime: b.readingTime || b.readTime,
          publishedAt: b.publishedAt
        }));

      prev = memoryStore.blogs[idx + 1] ? { title: memoryStore.blogs[idx + 1].title, slug: memoryStore.blogs[idx + 1].slug } : null;
      next = idx > 0 ? { title: memoryStore.blogs[idx - 1].title, slug: memoryStore.blogs[idx - 1].slug } : null;
    }

    return res.json({
      success: true,
      data: blog,
      related,
      prev,
      next
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// ADMIN PROTECTED ROUTES
// -------------------------------------------------------------

// GET /api/blog/admin/all - All blogs (drafts + published) with admin metrics
router.get('/admin/all', requireAdmin, async (req, res) => {
  try {
    const { search, status, category, sort = 'newest' } = req.query;
    const { mode } = getDbStatus();
    let blogs = [];

    if (mode === 'mongodb') {
      const query = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (category && category !== 'all') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ title: regex }, { slug: regex }, { category: regex }, { tags: regex }];
      }

      let sortOptions = { updatedAt: -1 };
      if (sort === 'oldest') sortOptions = { publishedAt: 1 };
      if (sort === 'popular') sortOptions = { views: -1 };

      blogs = await Blog.find(query).sort(sortOptions);
    } else {
      blogs = [...memoryStore.blogs];
      if (status && status !== 'all') {
        blogs = blogs.filter(b => b.status === status);
      }
      if (category && category !== 'all') {
        blogs = blogs.filter(b => (b.category || '').toLowerCase() === category.toLowerCase());
      }
      if (search && search.trim()) {
        const term = search.trim().toLowerCase();
        blogs = blogs.filter(b =>
          (b.title || '').toLowerCase().includes(term) ||
          (b.slug || '').toLowerCase().includes(term) ||
          (b.category || '').toLowerCase().includes(term)
        );
      }
      blogs.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    }

    const total = blogs.length;
    const publishedCount = blogs.filter(b => b.status === 'published').length;
    const draftCount = blogs.filter(b => b.status === 'draft').length;
    const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

    return res.json({
      success: true,
      data: blogs,
      metrics: {
        total,
        published: publishedCount,
        drafts: draftCount,
        views: totalViews
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/blog/check-slug - Check if slug is available
router.post('/check-slug', requireAdmin, async (req, res) => {
  try {
    const { slug, excludeId } = req.body;
    if (!slug) {
      return res.status(400).json({ success: false, message: 'Slug is required.' });
    }

    const cleanSlug = slugify(slug);
    const { mode } = getDbStatus();
    let exists = false;

    if (mode === 'mongodb') {
      const query = { slug: cleanSlug };
      if (excludeId) query._id = { $ne: excludeId };
      exists = !!(await Blog.findOne(query));
    } else {
      exists = memoryStore.blogs.some(b => b.slug === cleanSlug && String(b._id) !== String(excludeId));
    }

    return res.json({
      success: true,
      available: !exists,
      slug: cleanSlug
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/blog/upload-image - Upload image for cover or inline markdown
router.post('/upload-image', requireAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    // Public URL format
    const imageUrl = `/uploads/${req.file.filename}`;
    return res.json({
      success: true,
      message: 'Image uploaded successfully.',
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/blog - Create new article (Admin protected)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      summary,
      content,
      category = 'Web Development',
      tags = [],
      status = 'draft',
      featuredImage = '',
      featuredImageAlt = '',
      author = 'Sagar Kaushik',
      seoTitle = '',
      seoDescription = '',
      canonicalUrl = '',
      isFeatured = false
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Content is required.' });
    }

    // Prepare slug
    let finalSlug = slug ? slugify(slug) : slugify(title);
    const finalExcerpt = (excerpt || summary || content.slice(0, 160).replace(/[#*`_]/g, '')).trim();
    const readingTime = calculateReadingTime(content);

    const { mode } = getDbStatus();

    // Check slug uniqueness
    if (mode === 'mongodb') {
      let counter = 1;
      let baseSlug = finalSlug;
      while (await Blog.findOne({ slug: finalSlug })) {
        finalSlug = `${baseSlug}-${counter++}`;
      }
    } else {
      let counter = 1;
      let baseSlug = finalSlug;
      while (memoryStore.blogs.some(b => b.slug === finalSlug)) {
        finalSlug = `${baseSlug}-${counter++}`;
      }
    }

    const blogData = {
      title: title.trim(),
      slug: finalSlug,
      excerpt: finalExcerpt,
      summary: finalExcerpt,
      content,
      category: category.trim(),
      tags: Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean),
      status: status === 'published' ? 'published' : 'draft',
      publishedAt: status === 'published' ? (req.body.publishedAt || new Date()) : null,
      readingTime,
      readTime: readingTime,
      featuredImage,
      featuredImageAlt,
      author: author.trim(),
      seoTitle: seoTitle || `${title} | Sagar Kaushik`,
      seoDescription: seoDescription || finalExcerpt,
      canonicalUrl: canonicalUrl || `https://sagarkaushik.com/blogs/${finalSlug}`,
      views: 0,
      isFeatured: !!isFeatured
    };

    let created;
    if (mode === 'mongodb') {
      created = await Blog.create(blogData);
    } else {
      created = {
        _id: 'blog-' + Date.now(),
        ...blogData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryStore.blogs.unshift(created);
    }

    return res.status(201).json({
      success: true,
      message: status === 'published' ? 'Article published successfully.' : 'Draft saved successfully.',
      data: created
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/blog/:id - Update article (Admin protected)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { mode } = getDbStatus();

    const updateFields = { ...req.body };
    if (updateFields.title) updateFields.title = updateFields.title.trim();
    if (updateFields.slug) updateFields.slug = slugify(updateFields.slug);
    if (updateFields.content) {
      updateFields.readingTime = calculateReadingTime(updateFields.content);
      updateFields.readTime = updateFields.readingTime;
    }
    if (updateFields.excerpt) {
      updateFields.summary = updateFields.excerpt;
    }
    if (updateFields.tags && typeof updateFields.tags === 'string') {
      updateFields.tags = updateFields.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (updateFields.status === 'published' && !updateFields.publishedAt) {
      updateFields.publishedAt = new Date();
    }
    if (updateFields.slug) {
      updateFields.canonicalUrl = `https://sagarkaushik.com/blogs/${updateFields.slug}`;
    }
    updateFields.updatedAt = new Date();

    let updated = null;

    if (mode === 'mongodb') {
      // Check slug uniqueness if slug changed
      if (updateFields.slug) {
        const slugExists = await Blog.findOne({ slug: updateFields.slug, _id: { $ne: id } });
        if (slugExists) {
          return res.status(400).json({ success: false, message: 'Another article already uses this slug.' });
        }
      }

      updated = await Blog.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
      if (!updated) {
        // Try finding by slug
        updated = await Blog.findOneAndUpdate({ slug: id }, updateFields, { new: true });
      }
    } else {
      const idx = memoryStore.blogs.findIndex(b => String(b._id) === String(id) || b.slug === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Article not found.' });
      }
      memoryStore.blogs[idx] = {
        ...memoryStore.blogs[idx],
        ...updateFields
      };
      updated = memoryStore.blogs[idx];
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    return res.json({
      success: true,
      message: 'Article updated successfully.',
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/blog/:id/status - Quick toggle publish / draft
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be "draft" or "published".' });
    }

    const { mode } = getDbStatus();
    const update = {
      status,
      updatedAt: new Date()
    };
    if (status === 'published') {
      update.publishedAt = new Date();
    }

    let updated = null;
    if (mode === 'mongodb') {
      updated = await Blog.findByIdAndUpdate(id, update, { new: true });
      if (!updated) updated = await Blog.findOneAndUpdate({ slug: id }, update, { new: true });
    } else {
      const idx = memoryStore.blogs.findIndex(b => String(b._id) === String(id) || b.slug === id);
      if (idx !== -1) {
        memoryStore.blogs[idx] = { ...memoryStore.blogs[idx], ...update };
        updated = memoryStore.blogs[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    return res.json({
      success: true,
      message: `Article ${status === 'published' ? 'published' : 'moved to drafts'}.`,
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/blog/:id - Delete article (Admin protected)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { mode } = getDbStatus();

    if (mode === 'mongodb') {
      let deleted = await Blog.findByIdAndDelete(id);
      if (!deleted) {
        deleted = await Blog.findOneAndDelete({ slug: id.toLowerCase() });
      }
      if (!deleted) return res.status(404).json({ success: false, message: 'Article not found.' });
    } else {
      const idx = memoryStore.blogs.findIndex(b => String(b._id) === String(id) || b.slug === id.toLowerCase());
      if (idx === -1) return res.status(404).json({ success: false, message: 'Article not found.' });
      memoryStore.blogs.splice(idx, 1);
    }

    return res.json({ success: true, message: 'Article deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

