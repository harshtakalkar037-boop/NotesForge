"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles, LayoutDashboard, FileText, Upload, MessageSquare, Settings, Flame, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Community Notes", href: "/dashboard/notes", icon: FileText },
  { label: "🔥 Trending", href: "/dashboard/trending", icon: Flame },
  { label: "Upload Note", href: "/dashboard/upload", icon: Upload },
  { label: "AI Chat", href: "/dashboard/chat", icon: MessageSquare },
  { label: "⚡ Quiz Mode", href: "/dashboard/quiz", icon: Brain },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button onClick={() => setOpen(true)} className="md:hidden p-2 rounded-lg transition-colors"
        style={{ color: "rgba(255,255,255,0.5)" }}>
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
      )}

      <div className={cn("fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 md:hidden",
        open ? "translate-x-0" : "-translate-x-full")}
        style={{ backgroundColor: "#060610", borderRight: "1px solid rgba(255,255,255,0.07)" }}>

        <div className="h-16 flex items-center justify-between px-5 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <div className="h-8 w-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">NoteForge <span style={{ color: "#818cf8" }}>AI</span></span>
          </Link>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={isActive ? {
                  background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))",
                  border: "1px solid rgba(99,102,241,0.2)", color: "white",
                } : { color: "rgba(255,255,255,0.4)", border: "1px solid transparent" }}>
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-indigo-400" : "text-current")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
