import { createClient } from "@/supabase/server";
import Link from "next/link";
import { Flame, Eye, Star, ArrowRight, FileText, TrendingUp, Clock } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TrendingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all notes - sorted by most recent (we'll show as "trending")
  const { data: notes } = await (supabase as any)
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: profiles } = await (supabase as any)
    .from("profiles")
    .select("id, full_name, email");

  const profileMap = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p]));

  const GRADIENTS: [string, string][] = [
    ["#6366f1", "#8b5cf6"], ["#3b82f6", "#6366f1"], ["#06b6d4", "#3b82f6"],
    ["#8b5cf6", "#a855f7"], ["#ec4899", "#f43f5e"], ["#f59e0b", "#f97316"],
    ["#10b981", "#06b6d4"], ["#8b5cf6", "#ec4899"],
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            Trending Notes
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Most popular notes in the community right now
          </p>
        </div>
      </div>

      {/* Top 3 spotlight */}
      {notes && notes.length >= 3 && (
        <div className="grid md:grid-cols-3 gap-4">
          {notes.slice(0, 3).map((note: any, i: number) => {
            const profile = profileMap[note.user_id];
            const uploaderName = profile?.full_name || profile?.email?.split("@")[0] || "Student";
            const grad = GRADIENTS[i];
            const medals = ["🥇", "🥈", "🥉"];
            return (
              <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
                <div className="relative rounded-2xl p-5 cursor-pointer group transition-all hover:-translate-y-1"
                  style={{ background: `linear-gradient(135deg, ${grad[0]}15, ${grad[1]}08)`, border: `1px solid ${grad[0]}30` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${grad[0]}25`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                    style={{ background: `linear-gradient(90deg, ${grad[0]}, ${grad[1]})` }} />

                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{medals[i]}</span>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                      <Flame className="h-3 w-3" /> Hot
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                    {note.title}
                  </h3>
                  {note.summary && (
                    <p className="text-xs line-clamp-2 mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>{note.summary}</p>
                  )}

                  <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{uploaderName}</span>
                    <span className="text-xs flex items-center gap-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                      <Clock className="h-3 w-3" /> {formatRelativeTime(note.created_at)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* All trending list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <TrendingUp className="h-4 w-4" style={{ color: "#818cf8" }} />
          <p className="text-sm font-bold text-white">All Notes</p>
          <span className="text-xs ml-auto" style={{ color: "rgba(255,255,255,0.3)" }}>{notes?.length ?? 0} notes</span>
        </div>

        <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          {(notes ?? []).map((note: any, i: number) => {
            const profile = profileMap[note.user_id];
            const uploaderName = profile?.full_name || profile?.email?.split("@")[0] || "Student";
            const grad = GRADIENTS[i % GRADIENTS.length];
            const isOwn = note.user_id === user?.id;

            return (
              <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
                <div className="flex items-center gap-4 px-5 py-4 group cursor-pointer transition-colors hover:bg-white/[0.03]">
                  {/* Rank */}
                  <span className="text-lg font-black w-8 text-center shrink-0" style={{ color: i < 3 ? "#f59e0b" : "rgba(255,255,255,0.2)" }}>
                    {i < 3 ? ["🥇","🥈","🥉"][i] : `#${i + 1}`}
                  </span>

                  {/* Icon */}
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})` }}>
                    <FileText className="h-4 w-4 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {note.title}
                      </p>
                      {isOwn && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0 font-bold"
                          style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>Yours</span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                      by {uploaderName} · {formatRelativeTime(note.created_at)}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="hidden sm:flex gap-1">
                    {note.tags?.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(99,102,241,0.08)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.15)" }}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-40 text-white shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
