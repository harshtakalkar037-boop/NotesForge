# NoteForge AI 🧠

**Turn Your Notes into an AI-Powered Learning System.**

NoteForge AI lets you upload PDFs, Word docs, PowerPoints, and more — then uses AI to summarize, quiz, and help you truly understand your material. Built for students, researchers, and lifelong learners.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Features

- **AI Summaries** — Instant summaries of any uploaded document
- **Chat with Notes** — Ask questions, get context-aware answers
- **Multi-format uploads** — PDF, DOCX, PPTX, TXT, images, URLs
- **Auto Quiz Generation** — Test your knowledge from your own notes
- **Smart Search** — Semantic search across all your documents
- **Dark / Light mode** — Fully themed with system preference support
- **Private by default** — Row Level Security on all data

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| State | Zustand |
| Validation | Zod |
| Forms | React Hook Form |
| Linting | ESLint + Prettier + Husky |

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/harshtakalkar037-boop/NotesForge.git
cd NotesForge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄 Supabase Setup

### 1. Create a project

Go to [supabase.com](https://supabase.com), create a new project, and copy your **Project URL** and **anon key** from **Settings → API**.

### 2. Run the database migration

In your Supabase dashboard, go to **SQL Editor** and run the contents of:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables, indexes, RLS policies, triggers, and the storage bucket.

### 3. Enable Google OAuth (optional)

1. Go to **Authentication → Providers → Google**
2. Enable it and enter your Google OAuth credentials
3. Add `https://your-project.supabase.co/auth/v1/callback` as an authorized redirect URI in your Google Cloud Console

### 4. Configure Storage

The migration automatically creates the `note-files` bucket. Verify it exists under **Storage** in your dashboard.

---

## 📁 Folder Structure

```
NotesForge/
├── app/
│   ├── (auth)/            # Login & signup pages
│   ├── (dashboard)/       # Authenticated dashboard pages
│   ├── auth/callback/     # OAuth callback handler
│   ├── layout.tsx         # Root layout with ThemeProvider
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # Reusable UI components (Button, Card, etc.)
│   ├── landing/           # Landing page sections
│   ├── dashboard/         # Dashboard layout components
│   └── upload/            # File upload components
├── features/
│   └── auth/              # Server actions for auth
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities, constants, validations
├── services/              # Supabase data service layer
├── store/                 # Zustand state stores
├── supabase/              # Supabase client configs + migrations
├── tests/                 # Test files (Day 2+)
└── types/                 # TypeScript type definitions
```

---

## 🌐 Vercel Deployment

### 1. Push to GitHub

```bash
git add -A
git commit -m "feat: initial NoteForge AI setup"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) and click **Add New Project**
2. Import your GitHub repository
3. Add all environment variables from `.env.example` in the **Environment Variables** section
4. Click **Deploy**

### 3. Update Supabase redirect URLs

After deploying, add your Vercel URL to **Supabase → Authentication → URL Configuration**:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/auth/callback`

---

## 🔑 Environment Variables Reference

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | ✅ |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | ✅ |

---

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run format:check # Check formatting
```

---

## 🗺 Roadmap

- **Day 1** ✅ Foundation — Next.js, Supabase, Auth, Landing page, Dashboard, Upload UI
- **Day 2** — AI Integration — OpenAI/Anthropic summaries, embeddings, vector search
- **Day 3** — Chat Interface — Full AI chat with note context, streaming responses
- **Day 4** — Quiz System — Auto-generated quizzes, scoring, progress tracking
- **Day 5** — Polish & Deploy — Performance, SEO, tests, production deployment

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

Built with ❤️ using [Next.js](https://nextjs.org) and [Supabase](https://supabase.com).
