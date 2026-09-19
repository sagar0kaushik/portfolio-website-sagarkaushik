const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const api = {
  // Projects
  async getProjects() {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      return await res.json();
    } catch (err) {
      console.warn('API fallback for projects:', err.message);
      return { success: false, data: [] };
    }
  },

  async getProjectBySlug(slug) {
    try {
      const res = await fetch(`${API_BASE}/projects/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch project');
      return await res.json();
    } catch (err) {
      console.warn('API fallback for project detail:', err.message);
      return { success: false, data: null };
    }
  },

  // Blogs (Public)
  async getBlogs(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.search) query.set('search', params.search);
      if (params.category && params.category !== 'All') query.set('category', params.category);
      if (params.tag) query.set('tag', params.tag);
      if (params.page) query.set('page', params.page);
      if (params.limit) query.set('limit', params.limit);
      if (params.sort) query.set('sort', params.sort);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/blog${qs}`);
      if (!res.ok) throw new Error('Failed to fetch blogs');
      return await res.json();
    } catch (err) {
      console.warn('API fallback for blogs:', err.message);
      return { success: false, data: [], pagination: { total: 0, page: 1, totalPages: 1 } };
    }
  },

  async getFeaturedBlogs() {
    try {
      const res = await fetch(`${API_BASE}/blog/featured`);
      if (!res.ok) throw new Error('Failed to fetch featured blogs');
      return await res.json();
    } catch (err) {
      console.warn('API fallback for featured blogs:', err.message);
      return { success: false, data: [] };
    }
  },

  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/blog/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return await res.json();
    } catch (err) {
      console.warn('API fallback for categories:', err.message);
      return { success: false, data: [] };
    }
  },

  async getTags() {
    try {
      const res = await fetch(`${API_BASE}/blog/tags`);
      if (!res.ok) throw new Error('Failed to fetch tags');
      return await res.json();
    } catch (err) {
      console.warn('API fallback for tags:', err.message);
      return { success: false, data: [] };
    }
  },

  async getBlogBySlug(slug) {
    try {
      const res = await fetch(`${API_BASE}/blog/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch blog');
      return await res.json();
    } catch (err) {
      console.warn('API fallback for blog detail:', err.message);
      return { success: false, data: null };
    }
  },

  // Contact
  async sendContact(data) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Auth & Admin
  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await res.json();
  },

  async getContacts(token) {
    const res = await fetch(`${API_BASE}/contact`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
  },

  async getConnectionInfo(token) {
    const res = await fetch(`${API_BASE}/contact/connection-info`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
  },

  async deleteContact(id, token) {
    const res = await fetch(`${API_BASE}/contact/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
  },

  async updateContactStatus(id, status, token) {
    const res = await fetch(`${API_BASE}/contact/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return await res.json();
  },

  async createProject(data, token) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Blog CMS (Admin)
  async getAdminBlogs(token) {
    const res = await fetch(`${API_BASE}/blog/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
  },

  async checkSlug(slug, currentId, token) {
    const res = await fetch(`${API_BASE}/blog/check-slug`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ slug, currentId })
    });
    return await res.json();
  },

  async uploadBlogImage(formData, token) {
    const res = await fetch(`${API_BASE}/blog/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    return await res.json();
  },

  async createBlog(data, token) {
    const res = await fetch(`${API_BASE}/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateBlog(id, data, token) {
    const res = await fetch(`${API_BASE}/blog/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async toggleBlogStatus(id, status, token) {
    const res = await fetch(`${API_BASE}/blog/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return await res.json();
  },

  async deleteBlog(id, token) {
    const res = await fetch(`${API_BASE}/blog/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  }
};
