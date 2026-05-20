import { createClient } from "@/supabase/server";
import Link from "next/link";
import {
  FileText,
  Upload,
  MessageSquare,
  Bookmark,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    label: "Total Notes",
    value: "0",
    icon: FileText,
    color: "indigo",
    change: "+0 this week",
  },
  {
    label: "Files Uploaded",
    value: "0",
    icon: Upload,
    color: "violet",
    change: "+0 this week",
  },
  {
    label: "AI Chats",
    value: "0",
    icon: MessageSquare,
    color: "cyan",
    change: "+0 this week",
  },
  {
    label: "Bookmarks",
    value: "0",
    icon: Bookmark,
    color: "indigo",
    change: "+0 this week",
  },
];

const quickLinks = [
  {
    label: "Upload a document",
    href: "/dashboard/upload",
    icon: Upload,
    desc: "PDF, DOCX, PPTX & more",
  },
  {
    label: "Browse notes",
    href: "/dashboard/notes",
    icon: FileText,
    desc: "View all your notes",
  },
  {
    label: "Chat with AI",
    href: "/dashboard/chat",
    icon: MessageSquare,
    desc: "Ask questions about your notes",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "there";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Good morning, {firstName} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here&apos;s what&apos;s happening with your notes today.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/upload">
            <Plus className="h-4 w-4" />
            Upload Note
          </Link>
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorMap = {
            indigo: "text-indigo-400 bg-indigo-500/10",
            violet: "text-violet-400 bg-violet-500/10",
            cyan: "text-cyan-400 bg-cyan-500/10",
          };
          const colors = colorMap[stat.color as keyof typeof colorMap];
          return (
            <Card key={stat.label} className="hover:border-indigo-500/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${colors}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
                <p className="text-xs text-indigo-400 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                    <Icon className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent notes */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Notes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/notes">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-indigo-400" />
              </div>
              <p className="font-medium mb-1">No notes yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your first document to get started
              </p>
              <Button size="sm" asChild>
                <Link href="/dashboard/upload">
                  <Upload className="h-4 w-4" />
                  Upload Document
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting started */}
      <Card className="bg-gradient-to-br from-indigo-950/30 to-violet-950/30 border-indigo-500/20">
        <CardContent className="p-6 flex items-center gap-6">
          <div className="hidden sm:flex h-14 w-14 rounded-2xl bg-indigo-500/20 items-center justify-center shrink-0">
            <TrendingUp className="h-7 w-7 text-indigo-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Get started with NoteForge AI</h3>
            <p className="text-sm text-muted-foreground">
              Upload your first document and let AI summarize it, create quizzes, and help you learn.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Badge variant="indigo">Step 1 of 3</Badge>
            <Button size="sm" asChild>
              <Link href="/dashboard/upload">Start</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
