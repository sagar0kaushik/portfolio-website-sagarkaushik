import express from 'express';
import { Project } from '../models/Project.js';
import { memoryStore, getDbStatus } from '../config/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/projects - Public list of all projects
router.get('/', async (req, res) => {
  try {
    const { mode } = getDbStatus();
    let projects;
    if (mode === 'mongodb') {
      projects = await Project.find().sort({ order: 1, createdAt: -1 });
    } else {
      projects = [...memoryStore.projects].sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/projects/:slug - Single project case study
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { mode } = getDbStatus();
    let project;

    if (mode === 'mongodb') {
      project = await Project.findOne({ slug: slug.toLowerCase() });
    } else {
      project = memoryStore.projects.find(p => p.slug.toLowerCase() === slug.toLowerCase());
    }

    if (!project) {
      return res.status(404).json({ success: false, message: `Project with slug "${slug}" was not found.` });
    }

    return res.json({ success: true, data: project });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/projects - Create project (Admin protected)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, slug, subtitle, category, description, overview, problem, solution, technologies, features, architecture, implementation, challenges, learnings, githubUrl, liveUrl, previewType, order } = req.body;

    if (!title || !slug || !description || !githubUrl) {
      return res.status(400).json({ success: false, message: 'Title, slug, description, and GitHub URL are required.' });
    }

    const { mode } = getDbStatus();
    let created;

    if (mode === 'mongodb') {
      const existing = await Project.findOne({ slug: slug.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'A project with this slug already exists.' });
      }
      created = await Project.create(req.body);
    } else {
      const existing = memoryStore.projects.find(p => p.slug.toLowerCase() === slug.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'A project with this slug already exists.' });
      }
      created = {
        _id: 'proj-' + Date.now(),
        ...req.body,
        createdAt: new Date()
      };
      memoryStore.projects.push(created);
    }

    return res.status(201).json({ success: true, message: 'Project created successfully.', data: created });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/projects/:slug - Update project (Admin protected)
router.put('/:slug', requireAdmin, async (req, res) => {
  try {
    const { slug } = req.params;
    const { mode } = getDbStatus();
    let updated;

    if (mode === 'mongodb') {
      updated = await Project.findOneAndUpdate({ slug: slug.toLowerCase() }, req.body, { new: true, runValidators: true });
    } else {
      const idx = memoryStore.projects.findIndex(p => p.slug.toLowerCase() === slug.toLowerCase());
      if (idx !== -1) {
        memoryStore.projects[idx] = { ...memoryStore.projects[idx], ...req.body };
        updated = memoryStore.projects[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    return res.json({ success: true, message: 'Project updated successfully.', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/projects/:slug - Delete project (Admin protected)
router.delete('/:slug', requireAdmin, async (req, res) => {
  try {
    const { slug } = req.params;
    const { mode } = getDbStatus();

    if (mode === 'mongodb') {
      const deleted = await Project.findOneAndDelete({ slug: slug.toLowerCase() });
      if (!deleted) return res.status(404).json({ success: false, message: 'Project not found.' });
    } else {
      const idx = memoryStore.projects.findIndex(p => p.slug.toLowerCase() === slug.toLowerCase());
      if (idx === -1) return res.status(404).json({ success: false, message: 'Project not found.' });
      memoryStore.projects.splice(idx, 1);
    }

    return res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
