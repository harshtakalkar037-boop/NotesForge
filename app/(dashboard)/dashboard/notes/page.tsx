import { createClient } from "@/supabase/server";
import Link from "next/link";
import { Plus, FileText, Upload, Sparkles, Tag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

export default async function NotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: notes } = await (supabase as any)
    .from("notes")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {notes?.length
              ? `${notes.length} note${notes.length !== 1 ? "s" : ""} in your library`
              : "Your uploaded documents and notes"}
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button>
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </Link>
      </div>

      {!notes?.length ? (
        <Card>
          <CardContent className="py-20 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No notes yet</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              Upload your first document and AI will instantly summarize it and add it here.
            </p>
            <Link href="/dashboard/upload">
              <Button>
                <Upload className="h-4 w-4" />
                Upload Your First Note
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note: any) => (
            <Card
              key={note.id}
              className="hover:border-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer group"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-indigo-400" />
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(note.created_at)}
                  </span>
                </div>

                <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                  {note.title}
                </h3>

                {note.summary && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1 mb-1">
                      <Sparkles className="h-3 w-3 text-indigo-400" />
                      <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wide">AI Summary</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {note.summary}
                    </p>
                  </div>
                )}

                {note.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {note.tags.slice(0, 4).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
