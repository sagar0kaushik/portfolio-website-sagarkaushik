# Sagar Kaushik — Production Portfolio & Engineering Blog CMS

> Full-Stack MERN Architecture, Swiss Editorial Design Language, and Integrated Two-Column Blog CMS.

Live Production URL: **[https://sagarkaushik.com](https://sagarkaushik.com)**

---

## Architecture Overview

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, React Router v7.
- **Backend**: Node.js, Express.js REST API, JWT Auth, Multer Image Engine.
- **Database**: MongoDB Atlas Cluster (`cluster0.uejj6gg.mongodb.net`) with embedded in-memory fallback.
- **Design Philosophy**: Swiss Editorial Art Direction (`#073B32` Forest Green, `#f3efe5` Editorial Cream, `#315BDD` Swiss Cobalt Blue, `#f5c85b` Amber Gold, `#e27809` Safety Orange).
- **SEO & Discoverability**: Personal Name SEO for **"Sagar Kaushik"**, dynamic XML Sitemap (`/sitemap.xml`), `robots.txt`, and Schema.org JSON-LD Article & Person metadata.

---

## Blog CMS Features

### Public (`/blogs` & `/blogs/:slug`)
- Dynamic publication feed with real-time keyword search.
- Category filtering (`AI & Full Stack`, `System Architecture`, `Cloud & DevOps`, etc.).
- Tag filter chips and reading time calculation.
- Hero Featured Publication showcase card.
- Article detail view with rich Markdown rendering:
  - Code blocks with one-click copy button and language badges.
  - Callout alert boxes (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`).
  - Tables, Checklists, YouTube video embeds, and Image captions with alignment.
  - One-click Social Sharing (Twitter/X, LinkedIn, Copy Link).
  - Previous & Next navigation + Related Dispatches.

### Admin CMS Console (`/admin`)
- Secure token-based authentication (Noindex, Nofollow).
- Publication metrics dashboard (Total, Published, Drafts, Views).
- Filterable article table with live status toggle (`DRAFT` ↔ `PUBLISHED`).
- Interactive two-column publication studio:
  - **Left Canvas**: Title editor, Markdown toolbar (H1-H3, formatting, lists, tables, callouts, embeds, image upload), Live Write / Split / Preview modes.
  - **Right Sidebar**: Cover image upload (Multer engine) with alt text, category creator, tag chips, real-time slug validator, card excerpt, SEO title/description counters, and Google SERP preview.

---

## Getting Started Locally

### 1. Clone & Setup
```bash
git clone https://github.com/sagar0kaushik/portfolio-website-sagarkaushik.git
cd portfolio-website-sagarkaushik
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
# Install root/server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Run Development
```bash
# Run server
cd server
npm run dev

# Run client (in separate terminal)
cd client
npm run dev
```

---

## Deployment Guide

### Frontend (Vercel)
1. Import repository on [Vercel](https://vercel.com).
2. Set Root Directory to `client`.
3. Set Build Command to `npm run build` and Output Directory to `dist`.
4. Add Environment Variable:
   - `VITE_API_BASE`: `https://<your-backend-domain>/api` (or relative `/api` if using Vercel rewrites).

### Backend (Render / Railway / VPS)
1. Deploy `server` directory to [Render](https://render.com) as a Web Service.
2. Build Command: `npm install`
3. Start Command: `node index.js`
4. Set Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://sagarkaushik.com`
   - `BASE_URL`: `https://sagarkaushik.com`
   - `MONGODB_URI`: `mongodb+srv://sagarkaushik584_db_user:sagar_6377@cluster0.uejj6gg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET`: `<secure-random-key>`
   - `ADMIN_USERNAME`: `sagar`
   - `ADMIN_PASSWORD`: `<your-secure-password>`
