import { createClient } from "@/supabase/server";
import Link from "next/link";
import {
  Plus, FileText, Upload, Sparkles, Clock,
  Search, Users, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch ALL notes (this is a sharing platform — everyone sees everything)
  let query = (supabase as any)
    .from("notes")
    .select(`*, profiles(full_name, email)`)
    .order("created_at", { ascending: false })
    .limit(50);

  // Search filter
  if (q) {
    query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`);
  }

  const { data: notes } = await query;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Community Notes</h1>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {notes?.length
              ? `${notes.length} notes shared by the community`
              : "Notes shared by all students"}
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button>
            <Plus className="h-4 w-4" />
            Share a Note
          </Button>
        </Link>
      </div>

      {/* Search */}
      <form method="GET" className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          name="q"
          defaultValue={q}
          type="text"
          placeholder="Search notes by title, topic, subject..."
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
        {q && (
          <Link href="/dashboard/notes" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground">
            Clear
          </Link>
        )}
      </form>

      {/* Notes grid */}
      {!notes?.length ? (
        <Card>
          <CardContent className="py-20 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {q ? `No notes found for "${q}"` : "No notes yet"}
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              {q
                ? "Try a different search term"
                : "Be the first to share your notes with the community!"}
            </p>
            <Link href="/dashboard/upload">
              <Button>
                <Upload className="h-4 w-4" />
                Upload the First Note
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note: any) => {
            const uploaderName =
              note.profiles?.full_name ??
              note.profiles?.email?.split("@")[0] ??
              "Anonymous";
            const isOwn = note.user_id === user?.id;

            return (
              <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
                <Card className="h-full hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
                  <CardContent className="p-5 flex flex-col h-full">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="h-9 w-9 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <FileText className="h-4.5 w-4.5 text-indigo-400 h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        {isOwn && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                            Yours
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(note.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors leading-snug">
                      {note.title}
                    </h3>

                    {/* AI Summary */}
                    {note.summary && (
                      <div className="mb-3 flex-1">
                        <div className="flex items-center gap-1 mb-1">
                          <Sparkles className="h-3 w-3 text-indigo-400" />
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">AI Summary</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {note.summary}
                        </p>
                      </div>
                    )}

                    {/* Tags */}
                    {note.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        by <span className="font-medium text-foreground">{uploaderName}</span>
                      </span>
                      <span className="text-xs text-indigo-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Open <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
