"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Upload,
  MessageSquare,
  Bookmark,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Notes", href: "/dashboard/notes", icon: FileText },
  { label: "Upload", href: "/dashboard/upload", icon: Upload },
  { label: "AI Chat", href: "/dashboard/chat", icon: MessageSquare },
  { label: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-border bg-card/50 backdrop-blur-sm fixed left-0 top-0 bottom-0 z-30">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2 font-bold text-base">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          NoteForge AI
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-indigo-400" : "text-current"
                )}
              />
              {item.label}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Usage indicator */}
      <div className="p-4 border-t border-border">
        <div className="rounded-xl bg-gradient-to-br from-indigo-950/50 to-violet-950/50 border border-indigo-500/20 p-3">
          <p className="text-xs font-semibold mb-1">Free Plan</p>
          <p className="text-xs text-muted-foreground mb-2">
            3 / 10 uploads used
          </p>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[30%] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
          </div>
          <Link
            href="#"
            className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            Upgrade to Pro →
          </Link>
        </div>
      </div>
    </aside>
  );
}
