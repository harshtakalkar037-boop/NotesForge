"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Upload, MessageSquare, Plus, ArrowRight, Users, Sparkles, Clock, TrendingUp, Zap } from "lucide-react";
import { createClient } from "@/supabase/client";

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalNotes: 0, myNotes: 0, totalFiles: 0, totalStudents: 0 });
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [firstName, setFirstName] = useState("there");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      setFirstName(user.user_metadata?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "there");

      const [
        { count: totalNotes },
        { count: myNotes },
        { count: totalFiles },
        { data: recent },
        { count: totalStudents },
      ] = await Promise.all([
        (supabase as any).from("notes").select("*", { count: "exact", head: true }),
        (supabase as any).from("notes").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        (supabase as any).from("note_files").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        (supabase as any).from("notes").select("id, title, created_at, user_id, profiles(full_name, email)").order("created_at", { ascending: false }).limit(6),
        (supabase as any).from("profiles").select("*", { count: "exact", head: true }),
      ]);

      setStats({ totalNotes: totalNotes ?? 0, myNotes: myNotes ?? 0, totalFiles: totalFiles ?? 0, totalStudents: totalStudents ?? 0 });
      setRecentNotes(recent ?? []);
      setLoading(false);
    }

    load();
  }, []);

  const statCards = [
    { label: "Community Notes", value: stats.totalNotes, icon: FileText, grad: ["#6366f1","#8b5cf6"], glow: "rgba(99,102,241,0.2)", desc: "total notes shared" },
    { label: "My Notes", value: stats.myNotes, icon: Upload, grad: ["#8b5cf6","#a855f7"], glow: "rgba(139,92,246,0.2)", desc: "uploaded by me" },
    { label: "Files Stored", value: stats.totalFiles, icon: Sparkles, grad: ["#06b6d4","#3b82f6"], glow: "rgba(6,182,212,0.2)", desc: "in storage" },
    { label: "Students", value: stats.totalStudents, icon: Users, grad: ["#ec4899","#f43f5e"], glow: "rgba(236,72,153,0.2)", desc: "on the platform" },
  ];

  function timeAgo(date: string) {
    const d = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (d < 60) return "just now";
    if (d < 3600) return `${Math.floor(d/60)}m ago`;
    if (d < 86400) return `${Math.floor(d/3600)}h ago`;
    return `${Math.floor(d/86400)}d ago`;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hey, <span className="gradient-text">{firstName}</span> 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Welcome to the student knowledge hub</p>
        </div>
        <Link href="/dashboard/upload">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.35)" }}>
            <Plus className="h-4 w-4" /> Share a Note
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, grad, glow, desc }) => (
          <div key={label} className="rounded-2xl p-5 relative overflow-hidden transition-transform hover:scale-[1.02]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-40"
              style={{ background: `radial-gradient(circle, ${glow}, transparent)` }} />
            <div className="relative">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-4 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})` }}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-3xl font-black text-white">{loading ? "—" : value.toLocaleString()}</p>
              <p className="text-sm font-medium mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
              <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-400" /> Quick Actions
          </p>
          <div className="space-y-1">
            {[
              { label: "Upload a note", href: "/dashboard/upload", icon: Upload, grad: "#6366f1, #8b5cf6", desc: "PDF, DOCX, PPTX & more" },
              { label: "Browse all notes", href: "/dashboard/notes", icon: FileText, grad: "#3b82f6, #6366f1", desc: "Community knowledge base" },
              { label: "Chat with AI", href: "/dashboard/chat", icon: MessageSquare, grad: "#06b6d4, #3b82f6", desc: "Ask about any topic" },
            ].map(({ label, href, icon: Icon, grad, desc }) => (
              <Link key={href} href={href} className="flex items-center gap-3 p-3 rounded-xl transition-colors group hover:bg-white/5">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${grad})` }}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-40 text-white transition-all group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent notes */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-400" /> Recent Community Notes
            </p>
            <Link href="/dashboard/notes" className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)" }}>
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-12 rounded-xl animate-shimmer" />
              ))}
            </div>
          ) : !recentNotes.length ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "rgba(99,102,241,0.1)" }}>
                <FileText className="h-6 w-6" style={{ color: "#818cf8" }} />
              </div>
              <p className="text-sm font-medium text-white mb-1">No notes yet</p>
              <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>Be the first to share!</p>
              <Link href="/dashboard/upload">
                <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  Upload Now
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-0.5">
              {recentNotes.map((note: any) => {
                const uploaderName = note.profiles?.full_name ?? note.profiles?.email?.split("@")[0] ?? "Anonymous";
                const isOwn = note.user_id === userId;
                return (
                  <Link key={note.id} href={`/dashboard/notes/${note.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.15)" }}>
                      <FileText className="h-4 w-4" style={{ color: "#818cf8" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">{note.title}</p>
                        {isOwn && <span className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0 font-bold"
                          style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>Yours</span>}
                      </div>
                      <p className="text-[11px] flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                        {uploaderName} · <Clock className="h-3 w-3" /> {timeAgo(note.created_at)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-30 text-white transition-all" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Banner */}
      {!loading && stats.myNotes === 0 && (
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.07))", border: "1px solid rgba(99,102,241,0.18)" }}>
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
          <div className="flex items-center gap-5 relative">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-white mb-0.5">Share your first note with the community</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Upload any material — AI summarizes it and every student benefits.</p>
            </div>
            <Link href="/dashboard/upload">
              <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shrink-0 transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 15px rgba(99,102,241,0.3)" }}>
                Upload Now
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
