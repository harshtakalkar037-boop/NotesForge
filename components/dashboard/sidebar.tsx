"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Upload,
  MessageSquare, Settings, Sparkles, ChevronRight,
  Flame, Zap, Brain
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: ["#6366f1", "#8b5cf6"], section: "main" },
  { label: "Community Notes", href: "/dashboard/notes", icon: FileText, color: ["#3b82f6", "#6366f1"], section: "main" },
  { label: "🔥 Trending", href: "/dashboard/trending", icon: Flame, color: ["#ef4444", "#f97316"], section: "main" },
  { label: "Upload Note", href: "/dashboard/upload", icon: Upload, color: ["#8b5cf6", "#a855f7"], section: "main" },
  { label: "AI Chat", href: "/dashboard/chat", icon: MessageSquare, color: ["#06b6d4", "#3b82f6"], section: "ai" },
  { label: "⚡ Quiz Mode", href: "/dashboard/quiz", icon: Brain, color: ["#f59e0b", "#f97316"], section: "ai" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, color: ["#64748b", "#475569"], section: "other" },
];

export function Sidebar() {
  const pathname = usePathname();

  const sections = [
    { id: "main", label: "Explore" },
    { id: "ai", label: "AI Tools" },
    { id: "other", label: "Account" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-30"
      style={{ backgroundColor: "#060610", borderRight: "1px solid rgba(255,255,255,0.05)" }}>

      {/* Top ambient glow */}
      <div className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />

      {/* Logo */}
      <div className="h-16 flex items-center px-5 relative shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.4 }}
            className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.35)" }}>
            <Sparkles className="h-4 w-4 text-white" />
          </motion.div>
          <div>
            <p className="font-bold text-white text-[15px] leading-none">NoteForge</p>
            <p className="text-[11px] font-semibold mt-0.5" style={{ color: "#818cf8" }}>AI Platform</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar space-y-5">
        {sections.map(section => {
          const items = navItems.filter(n => n.section === section.id);
          return (
            <div key={section.id}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 mb-1.5"
                style={{ color: "rgba(255,255,255,0.18)" }}>
                {section.label}
              </p>
              <div className="space-y-0.5">
                {items.map((item, i) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                  return (
                    <motion.div key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}>
                      <Link href={item.href}
                        className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group"
                        style={isActive ? {
                          background: `linear-gradient(135deg, ${item.color[0]}18, ${item.color[1]}0a)`,
                          border: `1px solid ${item.color[0]}28`,
                          color: "white",
                        } : {
                          color: "rgba(255,255,255,0.38)",
                          border: "1px solid transparent",
                        }}
                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; } }}
                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.38)"; } }}
                      >
                        {/* Active left bar */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} exit={{ scaleY: 0 }}
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                              style={{ background: `linear-gradient(180deg, ${item.color[0]}, ${item.color[1]})` }} />
                          )}
                        </AnimatePresence>

                        {/* Icon */}
                        <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-all",
                          isActive ? "shadow-lg" : "opacity-60 group-hover:opacity-100")}
                          style={isActive ? { background: `linear-gradient(135deg, ${item.color[0]}, ${item.color[1]})` } : { background: "rgba(255,255,255,0.06)" }}>
                          <Icon className="h-3.5 w-3.5 text-white" />
                        </div>

                        <span className="flex-1 truncate">{item.label}</span>
                        {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-35 shrink-0" />}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom card */}
      <div className="p-4 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl p-4 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.07))", border: "1px solid rgba(99,102,241,0.18)" }}>
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-xl opacity-25"
            style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
          <div className="flex items-center gap-2.5 relative">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">100% Free</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>No limits, no paywalls</p>
            </div>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}
