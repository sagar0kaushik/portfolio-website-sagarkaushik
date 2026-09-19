import express from 'express';
import { initialProjects, initialBlogs } from '../data/seedData.js';
import { Project } from '../models/Project.js';
import { Blog } from '../models/Blog.js';
import { memoryStore, getDbStatus } from '../config/db.js';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const host = req.get('host');
    const isLocal = host && (host.includes('localhost') || host.includes('127.0.0.1'));
    const baseUrl = process.env.BASE_URL || (isLocal ? `http://${host}` : 'https://sagarkaushik.com');

    const { mode } = getDbStatus();
    let projects = [];
    let blogs = [];

    if (mode === 'mongodb') {
      projects = await Project.find().select('slug updatedAt');
      blogs = await Blog.find({ status: { $ne: 'draft' } }).select('slug publishedAt updatedAt');
    } else {
      projects = memoryStore.projects;
      blogs = (memoryStore.blogs || []).filter(b => b.status !== 'draft');
    }

    const staticPages = [
      '',
      '/about',
      '/work',
      '/stack',
      '/experience',
      '/education',
      '/blogs',
      '/contact'
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static pages
    staticPages.forEach(path => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${path}</loc>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += `    <priority>${path === '' ? '1.0' : '0.8'}</priority>\n`;
      xml += '  </url>\n';
    });

    // Project detail pages
    projects.forEach(p => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/projects/${p.slug}</loc>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.9</priority>\n';
      xml += '  </url>\n';
    });

    // Blog articles (Only published articles)
    blogs.forEach(b => {
      const pubDate = b.publishedAt || b.updatedAt
        ? new Date(b.publishedAt || b.updatedAt).toISOString().split('T')[0]
        : '2026-09-01';
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/blogs/${b.slug}</loc>\n`;
      xml += `    <lastmod>${pubDate}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    return res.send(xml);
  } catch (err) {
    return res.status(500).send('Error generating sitemap');
  }
});

router.get('/robots.txt', (req, res) => {
  const host = req.get('host');
  const isLocal = host && (host.includes('localhost') || host.includes('127.0.0.1'));
  const baseUrl = process.env.BASE_URL || (isLocal ? `http://${host}` : 'https://sagarkaushik.com');

  const robots = `User-agent: *
Allow: /
Allow: /about
Allow: /work
Allow: /stack
Allow: /experience
Allow: /education
Allow: /blogs
Allow: /blogs/
Allow: /blog
Allow: /contact
Allow: /projects/
Disallow: /admin
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.header('Content-Type', 'text/plain');
  return res.send(robots);
});

export default router;
