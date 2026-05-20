export const APP_NAME = "NoteForge AI";
export const APP_TAGLINE = "Turn Your Notes into an AI-Powered Learning System";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  NOTES: "/dashboard/notes",
  UPLOAD: "/dashboard/upload",
  CHAT: "/dashboard/chat",
  BOOKMARKS: "/dashboard/bookmarks",
  SETTINGS: "/dashboard/settings",
} as const;

export const SUPABASE_BUCKET = "note-files";

export const FREE_PLAN_LIMITS = {
  UPLOADS: 10,
  SUMMARIES: 5,
  STORAGE_MB: 100,
  CHAT_MESSAGES: 20,
} as const;

export const SUPPORTED_FILE_TYPES = {
  pdf: { label: "PDF", accept: ".pdf", mime: "application/pdf" },
  docx: {
    label: "Word",
    accept: ".docx,.doc",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  pptx: {
    label: "PowerPoint",
    accept: ".pptx,.ppt",
    mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  txt: { label: "Text", accept: ".txt,.md", mime: "text/plain" },
  image: { label: "Image", accept: ".png,.jpg,.jpeg,.webp", mime: "image/*" },
} as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
  { label: "Notes", href: ROUTES.NOTES, icon: "FileText" },
  { label: "Upload", href: ROUTES.UPLOAD, icon: "Upload" },
  { label: "AI Chat", href: ROUTES.CHAT, icon: "MessageSquare" },
  { label: "Bookmarks", href: ROUTES.BOOKMARKS, icon: "Bookmark" },
  { label: "Settings", href: ROUTES.SETTINGS, icon: "Settings" },
] as const;
