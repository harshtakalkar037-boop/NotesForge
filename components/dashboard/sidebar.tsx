"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Upload,
  MessageSquare, Settings, Sparkles, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "from-indigo-500 to-violet-500" },
  { label: "Notes", href: "/dashboard/notes", icon: FileText, color: "from-blue-500 to-indigo-500" },
  { label: "Upload", href: "/dashboard/upload", icon: Upload, color: "from-violet-500 to-purple-500" },
  { label: "AI Chat", href: "/dashboard/chat", icon: MessageSquare, color: "from-cyan-500 to-blue-500" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, color: "from-slate-500 to-slate-600" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-30"
      style={{ backgroundColor: "#060610", borderRight: "1px solid rgba(255,255,255,0.05)" }}>

      {/* Ambient glow top */}
      <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />

      {/* Logo */}
      <div className="h-16 flex items-center px-5 relative" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.4 }}
            className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <Sparkles className="h-4.5 w-4.5 text-white h-5 w-5" />
          </motion.div>
          <div>
            <p className="font-bold text-white text-[15px] leading-none">NoteForge</p>
            <p className="text-[11px] font-medium mt-0.5" style={{ color: "#818cf8" }}>AI Platform</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto no-scrollbar">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 mb-3" style={{ color: "rgba(255,255,255,0.2)" }}>Navigation</p>

        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <motion.div key={item.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}>
              <Link href={item.href} className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
                style={isActive ? {
                  background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 100%)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  color: "white",
                } : { color: "rgba(255,255,255,0.35)", border: "1px solid transparent" }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; } }}
              >
                {/* Active indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} exit={{ scaleY: 0 }}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                      style={{ background: "linear-gradient(180deg, #818cf8, #a78bfa)" }} />
                  )}
                </AnimatePresence>

                {/* Icon */}
                <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-all",
                  isActive ? "shadow-lg" : "opacity-60 group-hover:opacity-100")}
                  style={isActive ? { background: `linear-gradient(135deg, ${item.color.includes("indigo") ? "#6366f1, #8b5cf6" : item.color.includes("blue") ? "#3b82f6, #6366f1" : item.color.includes("violet") ? "#8b5cf6, #a855f7" : item.color.includes("cyan") ? "#06b6d4, #3b82f6" : "#64748b, #475569"})` } : { background: "rgba(255,255,255,0.06)" }}>
                  <Icon className="h-3.5 w-3.5 text-white" />
                </div>

                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-40" />}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom card */}
      <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl p-4 relative overflow-hidden cursor-pointer"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)", border: "1px solid rgba(99,102,241,0.18)" }}>
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-xl opacity-30"
            style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
          <div className="flex items-center gap-2.5 relative">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">100% Free</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>No limits ever</p>
            </div>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}
