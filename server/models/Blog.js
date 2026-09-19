import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, required: true, trim: true },
    summary: { type: String, trim: true }, // backwards-compatible alias
    content: { type: String, required: true },
    featuredImage: { type: String, default: '' },
    featuredImageAlt: { type: String, default: '' },
    author: { type: String, default: 'Sagar Kaushik', trim: true },
    category: { type: String, default: 'Web Development', trim: true, index: true },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true
    },
    publishedAt: { type: Date, default: Date.now },
    readingTime: { type: String, default: '5 min read' },
    readTime: { type: String }, // backwards-compatible alias
    seoTitle: { type: String, default: '', trim: true },
    seoDescription: { type: String, default: '', trim: true },
    canonicalUrl: { type: String, default: '', trim: true },
    views: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to ensure summary/excerpt and readTime/readingTime parity
blogSchema.pre('save', function (next) {
  if (!this.excerpt && this.summary) {
    this.excerpt = this.summary;
  }
  if (!this.summary && this.excerpt) {
    this.summary = this.excerpt;
  }
  if (!this.readingTime && this.readTime) {
    this.readingTime = this.readTime;
  }
  if (!this.readTime && this.readingTime) {
    this.readTime = this.readingTime;
  }
  if (!this.canonicalUrl && this.slug) {
    this.canonicalUrl = `https://sagarkaushik.com/blogs/${this.slug}`;
  }
  next();
});

export const Blog = mongoose.model('Blog', blogSchema);

