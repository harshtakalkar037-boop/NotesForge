import { createClient } from "@/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, FileText, Sparkles, Clock, Tag,
  Download, ExternalLink, File, Image as ImageIcon,
  Presentation, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime, formatBytes } from "@/lib/utils";

const FILE_ICONS: Record<string, React.ElementType> = {
  pdf: FileText,
  docx: File, doc: File,
  pptx: Presentation, ppt: Presentation,
  txt: BookOpen, md: BookOpen,
  png: ImageIcon, jpg: ImageIcon, jpeg: ImageIcon, webp: ImageIcon, gif: ImageIcon,
};

const IMAGE_EXTS = ["png", "jpg", "jpeg", "webp", "gif"];

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the note (public notes visible to all, own notes always visible)
  const { data: note } = await (supabase as any)
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (!note) notFound();

  // Check access - own note or public note
  if (note.user_id !== user?.id && !note.is_public) notFound();

  // Fetch the file record for this note
  const { data: files } = await (supabase as any)
    .from("note_files")
    .select("*")
    .eq("note_id", id);

  // Get signed URLs for all files (1 hour expiry)
  const filesWithUrls = await Promise.all(
    (files ?? []).map(async (file: any) => {
      const { data } = await supabase.storage
        .from("note-files")
        .createSignedUrl(file.storage_path, 60 * 60);
      return { ...file, signedUrl: data?.signedUrl ?? null };
    })
  );

  // Fetch uploader profile
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("full_name, email")
    .eq("id", note.user_id)
    .single();

  const uploaderName = profile?.full_name ?? profile?.email?.split("@")[0] ?? "Anonymous";
  const isOwner = user?.id === note.user_id;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <Link href="/dashboard/notes">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Notes
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold mb-2 leading-tight">{note.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatRelativeTime(note.created_at)}
            </span>
            <span>by <span className="font-medium text-foreground">{uploaderName}</span></span>
            {isOwner && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20">
                Your note
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content - left 2/3 */}
        <div className="lg:col-span-2 space-y-6">

          {/* File viewer */}
          {filesWithUrls.length > 0 && filesWithUrls.map((file: any) => {
            const ext = file.file_name?.split(".").pop()?.toLowerCase() ?? "";
            const isImage = IMAGE_EXTS.includes(ext);
            const isPdf = ext === "pdf";
            const Icon = FILE_ICONS[ext] ?? File;

            return (
              <Card key={file.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{file.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {ext.toUpperCase()} • {formatBytes(file.file_size)}
                        </p>
                      </div>
                    </div>
                    {file.signedUrl && (
                      <div className="flex gap-2">
                        <a href={file.signedUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Open
                          </Button>
                        </a>
                        <a href={file.signedUrl} download={file.file_name}>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Image viewer */}
                  {isImage && file.signedUrl && (
                    <div className="rounded-xl overflow-hidden border border-border bg-muted/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={file.signedUrl}
                        alt={file.file_name}
                        className="w-full max-h-[600px] object-contain"
                      />
                    </div>
                  )}

                  {/* PDF viewer */}
                  {isPdf && file.signedUrl && (
                    <div className="rounded-xl overflow-hidden border border-border">
                      <iframe
                        src={`${file.signedUrl}#toolbar=1&navpanes=1`}
                        className="w-full h-[700px]"
                        title={file.file_name}
                      />
                    </div>
                  )}

                  {/* Other file types - show open button prominently */}
                  {!isImage && !isPdf && file.signedUrl && (
                    <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-border bg-muted/20 text-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                        <Icon className="h-7 w-7 text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">{file.file_name}</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          This file type opens in your device&apos;s default app
                        </p>
                        <div className="flex gap-3 justify-center">
                          <a href={file.signedUrl} target="_blank" rel="noopener noreferrer">
                            <Button className="gap-2">
                              <ExternalLink className="h-4 w-4" />
                              Open File
                            </Button>
                          </a>
                          <a href={file.signedUrl} download={file.file_name}>
                            <Button variant="outline" className="gap-2">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {!file.signedUrl && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      File URL expired. Please re-upload to view.
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Note content (extracted text) */}
          {note.content && !note.content.startsWith("[") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-400" />
                  Extracted Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed font-sans bg-muted/30 rounded-xl p-4 max-h-[400px] overflow-y-auto">
                    {note.content.slice(0, 3000)}
                    {note.content.length > 3000 && (
                      "\n\n... [content truncated for display]"
                    )}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - right 1/3 */}
        <div className="space-y-5">
          {/* AI Summary */}
          {note.summary && (
            <Card className="border-indigo-500/20 bg-indigo-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span className="text-indigo-400">AI Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {note.summary}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {note.tags?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Note info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Note Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uploaded by</span>
                <span className="font-medium">{uploaderName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uploaded</span>
                <span className="font-medium">{formatRelativeTime(note.created_at)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Files</span>
                <span className="font-medium">{filesWithUrls.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Visibility</span>
                <span className="font-medium text-green-400">Public</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Link href="/dashboard/chat">
              <Button className="w-full gap-2">
                <Sparkles className="h-4 w-4" />
                Chat with AI about this
              </Button>
            </Link>
            <Link href="/dashboard/notes">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Browse More Notes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
