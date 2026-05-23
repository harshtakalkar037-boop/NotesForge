import { createClient } from "@/supabase/server";
import Link from "next/link";
import {
  FileText, Upload, MessageSquare, Bookmark,
  TrendingUp, Plus, ArrowRight, Users, Sparkles, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic"; // always re-render, never cache

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "there";

  // Fetch real stats in parallel
  const [
    { count: totalNotes },
    { count: myNotes },
    { count: totalFiles },
    { data: recentNotes },
    { count: totalStudents },
  ] = await Promise.all([
    // Total community notes
    (supabase as any).from("notes").select("*", { count: "exact", head: true }),
    // My notes
    (supabase as any).from("notes").select("*", { count: "exact", head: true }).eq("user_id", user?.id),
    // My uploaded files
    (supabase as any).from("note_files").select("*", { count: "exact", head: true }).eq("user_id", user?.id),
    // Recent notes (last 6 from community)
    (supabase as any)
      .from("notes")
      .select("id, title, summary, tags, created_at, user_id, profiles(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(6),
    // Total students (profiles)
    (supabase as any).from("profiles").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Community Notes", value: totalNotes ?? 0, icon: FileText, color: "indigo", desc: "notes shared" },
    { label: "My Notes", value: myNotes ?? 0, icon: Upload, color: "violet", desc: "uploaded by me" },
    { label: "My Files", value: totalFiles ?? 0, icon: Bookmark, color: "cyan", desc: "files stored" },
    { label: "Students", value: totalStudents ?? 0, icon: Users, color: "indigo", desc: "on the platform" },
  ];

  const colorMap: Record<string, string> = {
    indigo: "text-indigo-400 bg-indigo-500/10",
    violet: "text-violet-400 bg-violet-500/10",
    cyan: "text-cyan-400 bg-cyan-500/10",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Good morning, {firstName} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome to the student knowledge hub.
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button>
            <Plus className="h-4 w-4" />
            Share a Note
          </Button>
        </Link>
      </div>

      {/* Real stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = colorMap[stat.color];
          return (
            <Card key={stat.label} className="hover:border-indigo-500/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${colors}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                <p className="text-xs text-indigo-400 mt-1">{stat.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions + Recent Notes */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Upload a note", href: "/dashboard/upload", icon: Upload, desc: "PDF, DOCX, PPTX & more" },
              { label: "Browse all notes", href: "/dashboard/notes", icon: FileText, desc: "Community knowledge base" },
              { label: "Chat with AI", href: "/dashboard/chat", icon: MessageSquare, desc: "Ask about any topic" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group">
                  <div className="p-2 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors shrink-0">
                    <Icon className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent community notes */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Recent Community Notes
            </CardTitle>
            <Link href="/dashboard/notes">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {!recentNotes?.length ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
                  <FileText className="h-7 w-7 text-indigo-400" />
                </div>
                <p className="font-medium mb-1">No notes yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Be the first to share a note with the community!
                </p>
                <Link href="/dashboard/upload">
                  <Button size="sm">
                    <Upload className="h-4 w-4" />
                    Upload a Note
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentNotes.map((note: any) => {
                  const uploaderName =
                    note.profiles?.full_name ??
                    note.profiles?.email?.split("@")[0] ??
                    "Anonymous";
                  const isOwn = note.user_id === user?.id;
                  return (
                    <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group cursor-pointer">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-medium truncate group-hover:text-indigo-400 transition-colors">
                              {note.title}
                            </p>
                            {isOwn && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                                Yours
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">by {uploaderName}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatRelativeTime(note.created_at)}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-2" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Getting started banner — only show if user has no notes */}
      {(myNotes ?? 0) === 0 && (
        <Card className="bg-gradient-to-br from-indigo-950/30 to-violet-950/30 border-indigo-500/20">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="hidden sm:flex h-14 w-14 rounded-2xl bg-indigo-500/20 items-center justify-center shrink-0">
              <Sparkles className="h-7 w-7 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Share your first note with the community</h3>
              <p className="text-sm text-muted-foreground">
                Upload any study material — AI will summarize it and every student will benefit.
              </p>
            </div>
            <Link href="/dashboard/upload" className="shrink-0">
              <Button>
                <Upload className="h-4 w-4" />
                Upload Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
