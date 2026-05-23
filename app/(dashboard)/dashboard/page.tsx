import { createClient } from "@/supabase/server";
import Link from "next/link";
import { FileText, Upload, MessageSquare, Plus, ArrowRight, Users, Sparkles, Clock, TrendingUp, Zap } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";

  const [
    { count: totalNotes },
    { count: myNotes },
    { count: totalFiles },
    { data: recentNotes },
    { count: totalStudents },
  ] = await Promise.all([
    (supabase as any).from("notes").select("*", { count: "exact", head: true }),
    (supabase as any).from("notes").select("*", { count: "exact", head: true }).eq("user_id", user?.id),
    (supabase as any).from("note_files").select("*", { count: "exact", head: true }).eq("user_id", user?.id),
    (supabase as any).from("notes").select("id, title, summary, tags, created_at, user_id, profiles(full_name, email)").order("created_at", { ascending: false }).limit(6),
    (supabase as any).from("profiles").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Community Notes", value: totalNotes ?? 0, icon: FileText, gradient: "from-indigo-500 to-violet-500", glow: "rgba(99,102,241,0.3)", desc: "total notes shared" },
    { label: "My Notes", value: myNotes ?? 0, icon: Upload, gradient: "from-violet-500 to-purple-500", glow: "rgba(139,92,246,0.3)", desc: "uploaded by me" },
    { label: "Files Stored", value: totalFiles ?? 0, icon: Sparkles, gradient: "from-cyan-500 to-blue-500", glow: "rgba(6,182,212,0.3)", desc: "in storage" },
    { label: "Students", value: totalStudents ?? 0, icon: Users, gradient: "from-pink-500 to-rose-500", glow: "rgba(236,72,153,0.3)", desc: "on the platform" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hey, <span className="gradient-text">{firstName}</span> 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Welcome to the student knowledge hub
          </p>
        </div>
        <Link href="/dashboard/upload">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.35)" }}>
            <Plus className="h-4 w-4" />
            Share a Note
          </button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl p-5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {/* Background glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${stat.glow} 0%, transparent 60%)` }} />

              <div className="relative">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-4 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${stat.gradient.replace("from-", "").replace(" to-", ", ").replace("indigo-500", "#6366f1").replace("violet-500", "#8b5cf6").replace("purple-500", "#a855f7").replace("cyan-500", "#06b6d4").replace("blue-500", "#3b82f6").replace("pink-500", "#ec4899").replace("rose-500", "#f43f5e")})` }}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-3xl font-black text-white mb-0.5">{(stat.value).toLocaleString()}</p>
                <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{stat.label}</p>
                <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{stat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-400" /> Quick Actions
          </p>
          <div className="space-y-2">
            {[
              { label: "Upload a note", href: "/dashboard/upload", icon: Upload, desc: "PDF, DOCX, PPTX & more", grad: "#6366f1, #8b5cf6" },
              { label: "Browse all notes", href: "/dashboard/notes", icon: FileText, desc: "Community knowledge base", grad: "#3b82f6, #6366f1" },
              { label: "Chat with AI", href: "/dashboard/chat", icon: MessageSquare, desc: "Ask about any topic", grad: "#06b6d4, #3b82f6" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all duration-150 group"
                  style={{ border: "1px solid transparent" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
                >
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-md"
                    style={{ background: `linear-gradient(135deg, ${item.grad})` }}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{item.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-40 transition-all group-hover:translate-x-0.5" style={{ color: "white" }} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent notes */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-400" /> Recent Community Notes
            </p>
            <Link href="/dashboard/notes">
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.background = "transparent"; }}
              >
                View all →
              </button>
            </Link>
          </div>

          {!recentNotes?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <FileText className="h-7 w-7" style={{ color: "#818cf8" }} />
              </div>
              <p className="font-semibold text-white mb-1">No notes yet</p>
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>Be the first to share!</p>
              <Link href="/dashboard/upload">
                <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  Upload Now
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recentNotes.map((note: any) => {
                const uploaderName = note.profiles?.full_name ?? note.profiles?.email?.split("@")[0] ?? "Anonymous";
                const isOwn = note.user_id === user?.id;
                return (
                  <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl transition-all duration-150 group cursor-pointer"
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}>
                        <FileText className="h-4 w-4" style={{ color: "#818cf8" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">{note.title}</p>
                          {isOwn && <span className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0 font-medium" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.25)" }}>Yours</span>}
                        </div>
                        <p className="text-[11px] flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                          <span>{uploaderName}</span>
                          <span>·</span>
                          <Clock className="h-3 w-3" />
                          <span>{formatRelativeTime(note.created_at)}</span>
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-30 transition-all" style={{ color: "white" }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Banner */}
      {(myNotes ?? 0) === 0 && (
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20"
            style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
          <div className="flex items-center gap-5 relative">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-white mb-0.5">Share your first note with the community</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                Upload any study material — AI summarizes it and every student benefits instantly.
              </p>
            </div>
            <Link href="/dashboard/upload">
              <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 transition-all hover:scale-105"
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
