"use client";

import { Search, Bell, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { signOut } from "@/features/auth/actions";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TopNavProps {
  user?: { email?: string; user_metadata?: { full_name?: string; avatar_url?: string } } | null;
}

export function TopNav({ user }: TopNavProps) {
  const name = user?.user_metadata?.full_name ?? user?.email ?? "User";
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hasNotif] = useState(true);

  return (
    <header className="h-16 fixed top-0 left-0 right-0 md:left-64 z-20 flex items-center px-4 md:px-6 gap-3"
      style={{ backgroundColor: "rgba(6,6,16,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>

      <MobileSidebar />

      {/* Search */}
      <motion.div animate={{ width: searchFocused ? "100%" : "auto" }} className="flex-1 max-w-md relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="Search notes, topics, subjects..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-9 pl-9 pr-4 rounded-xl text-sm text-white placeholder:text-white/25 outline-none transition-all"
            style={{
              background: searchFocused ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.04)",
              border: searchFocused ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.06)",
            }}
          />
          <AnimatePresence>
            {searchFocused && (
              <motion.kbd
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/20 hidden sm:block"
              >
                ESC
              </motion.kbd>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Notification bell */}
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          className="relative h-9 w-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <Bell className="h-4 w-4" />
          {hasNotif && (
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500" />
          )}
        </motion.button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 pl-2 pr-3 h-9 rounded-xl transition-all outline-none ml-1"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="text-[10px] font-bold" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm font-medium text-white/80 max-w-[100px] truncate">{name}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52" style={{ background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.08)" }}>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-semibold text-white">{name}</p>
                <p className="text-xs text-white/30 truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator style={{ background: "rgba(255,255,255,0.06)" }} />
            <DropdownMenuItem asChild className="text-white/60 hover:text-white focus:text-white focus:bg-white/5">
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator style={{ background: "rgba(255,255,255,0.06)" }} />
            <DropdownMenuItem className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer" onClick={() => signOut()}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
