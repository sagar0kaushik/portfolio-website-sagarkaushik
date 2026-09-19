import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage } from './pages/NotFoundPage';
import { useScrollReveal } from './hooks/useScrollReveal';

export function App() {
  // Global scroll reveal observer across all routes (Home, Blogs, Articles, Projects)
  useScrollReveal();

  return (
    <AuthProvider>
      <Router>
        {/* Subtle Custom Desktop Cursor */}
        <CustomCursor />

        {/* Global Continuous Matrix Coordinate Grid Background */}
        <div className="global-matrix-grid" aria-hidden="true" />

        {/* 12-Column Vertical Editorial Grid Guides */}
        <div className="editorial-grid" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="editorial-grid-col" />
          ))}
        </div>

        {/* Floating Editorial Taskbar */}
        <Navbar />

        {/* App Content */}
        <div className="min-h-screen flex flex-col justify-between relative z-10">
          <div className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<Navigate to="/#about" replace />} />
              <Route path="/work" element={<Navigate to="/#work" replace />} />
              <Route path="/stack" element={<Navigate to="/#stack" replace />} />
              <Route path="/experience" element={<Navigate to="/#experience" replace />} />
              <Route path="/education" element={<Navigate to="/#education" replace />} />
              <Route path="/contact" element={<Navigate to="/#contact" replace />} />

              {/* Individual Project Case Studies */}
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />

              {/* Technical Articles & Blog CMS */}
              <Route path="/blogs" element={<BlogPage />} />
              <Route path="/blogs/:slug" element={<BlogPostPage />} />
              <Route path="/blog" element={<Navigate to="/blogs" replace />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />

              {/* Admin Management (Noindex, Nofollow) */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>

          {/* Persistent Global Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
