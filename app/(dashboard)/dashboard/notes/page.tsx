import { createClient } from "@/supabase/server";
import Link from "next/link";
import { Plus, FileText, Upload, Sparkles, Clock, Search, Users, ArrowRight } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NotesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch notes
  let query = (supabase as any)
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (q) query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`);
  const { data: notes } = await query;

  // Fetch all profiles separately to avoid join issues
  const { data: profiles } = await (supabase as any)
    .from("profiles")
    .select("id, full_name, email");

  const profileMap = Object.fromEntries(
    (profiles ?? []).map((p: any) => [p.id, p])
  );

  const GRADIENTS = [
    ["#6366f1","#8b5cf6"], ["#3b82f6","#6366f1"], ["#06b6d4","#3b82f6"],
    ["#8b5cf6","#a855f7"], ["#ec4899","#f43f5e"], ["#f59e0b","#f97316"]
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Community Notes</h1>
          <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            <Users className="h-3.5 w-3.5" />
            {notes?.length ? `${notes.length} notes shared by students` : "No notes yet"}
          </p>
        </div>
        <Link href="/dashboard/upload">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
            <Plus className="h-4 w-4" /> Share a Note
          </button>
        </Link>
      </div>

      {/* Search */}
      <form method="GET">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(255,255,255,0.25)" }} />
          <input name="q" defaultValue={q} type="text"
            placeholder="Search by title, subject, topic..."
            className="w-full h-11 pl-11 pr-4 rounded-xl text-sm text-white outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          />
          {q && (
            <Link href="/dashboard/notes" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium px-2 py-1 rounded-lg"
              style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)" }}>
              Clear ×
            </Link>
          )}
        </div>
      </form>

      {/* Grid */}
      {!notes?.length ? (
        <div className="rounded-2xl flex flex-col items-center justify-center py-24 text-center"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <FileText className="h-8 w-8" style={{ color: "#818cf8" }} />
          </div>
          <p className="font-bold text-white text-lg mb-2">{q ? `No notes for "${q}"` : "No notes yet"}</p>
          <p className="text-sm mb-6 max-w-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            {q ? "Try a different search term" : "Be the first to share your notes!"}
          </p>
          <Link href="/dashboard/upload">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <Upload className="h-4 w-4" /> Upload First Note
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note: any, i: number) => {
            const profile = profileMap[note.user_id];
            const uploaderName = profile?.full_name || profile?.email?.split("@")[0] || "Student";
            const isOwn = note.user_id === user?.id;
            const grad = GRADIENTS[i % GRADIENTS.length];

            return (
              <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
                <div className="h-full rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group cursor-pointer relative overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>

                  {/* Top color accent */}
                  <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, ${grad[0]}, ${grad[1]})` }} />

                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${grad[0]}15 0%, transparent 60%)` }} />

                  <div className="flex items-start justify-between mb-3 relative">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-md"
                      style={{ background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})` }}>
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      {isOwn && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                          style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.25)" }}>
                          Yours
                        </span>
                      )}
                      <span className="text-[11px] flex items-center gap-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(note.created_at)}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-[14px] text-white mb-2 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors relative">
                    {note.title}
                  </h3>

                  {note.summary && (
                    <div className="mb-3 relative">
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles className="h-3 w-3" style={{ color: "#818cf8" }} />
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#818cf8" }}>AI Summary</span>
                      </div>
                      <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {note.summary}
                      </p>
                    </div>
                  )}

                  {note.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3 relative">
                      {note.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.18)" }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 relative" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                      by <span className="font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>{uploaderName}</span>
                    </span>
                    <span className="text-[11px] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "#818cf8" }}>
                      Open <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
