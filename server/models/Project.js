import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  subtitle: { type: String, default: '' },
  category: { type: String, required: true },
  description: { type: String, required: true },
  overview: { type: String, default: '' },
  problem: { type: String, default: '' },
  solution: { type: String, default: '' },
  technologies: [{ type: String }],
  features: [{ type: String }],
  architecture: { type: String, default: '' },
  implementation: { type: String, default: '' },
  challenges: { type: String, default: '' },
  learnings: { type: String, default: '' },
  githubUrl: { type: String, required: true },
  liveUrl: { type: String, default: '' },
  previewType: { type: String, enum: ['ecommerce', 'dashboard', 'banking', 'weather', 'rag', 'ai', 'general'], default: 'general' },
  featured: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Project = mongoose.model('Project', projectSchema);
