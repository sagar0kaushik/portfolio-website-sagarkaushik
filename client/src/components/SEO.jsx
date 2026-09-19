import { useEffect } from 'react';

export const SEO = ({
  title = 'Sagar Kaushik | Software Engineer & Full-Stack Developer',
  description = 'Portfolio of Sagar Kaushik, Software Engineer & Full-Stack Developer specializing in MERN stack, Python, and AI systems. View projects, case studies, and contact.',
  canonical = 'https://sagarkaushik.com/',
  ogType = 'website',
  ogImage = 'https://sagarkaushik.com/og-image.svg',
  noindex = false
}) => {
  useEffect(() => {
    // 1. Document Title
    document.title = title;

    // Helper to update or create meta tag
    const setMeta = (selector, attr, val, createTag = 'meta') => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement(createTag);
        if (selector.startsWith('meta[name=')) {
          const name = selector.match(/meta\[name="([^"]+)"\]/)?.[1];
          if (name) el.setAttribute('name', name);
        } else if (selector.startsWith('meta[property=')) {
          const prop = selector.match(/meta\[property="([^"]+)"\]/)?.[1];
          if (prop) el.setAttribute('property', prop);
        } else if (selector.startsWith('link[rel=')) {
          const rel = selector.match(/link\[rel="([^"]+)"\]/)?.[1];
          if (rel) el.setAttribute('rel', rel);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };

    // 2. Meta description
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[name="title"]', 'content', title);

    // 3. Canonical URL
    setMeta('link[rel="canonical"]', 'href', canonical, 'link');

    // 4. OpenGraph tags
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[property="og:type"]', 'content', ogType);
    setMeta('meta[property="og:image"]', 'content', ogImage);

    // 5. Twitter Card tags
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:url"]', 'content', canonical);
    setMeta('meta[name="twitter:image"]', 'content', ogImage);

    // 6. Robots meta
    setMeta('meta[name="robots"]', 'content', noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
  }, [title, description, canonical, ogType, ogImage, noindex]);

  return null;
};

