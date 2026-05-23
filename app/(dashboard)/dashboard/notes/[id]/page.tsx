import { createClient } from "@/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, FileText, Sparkles, Clock, Tag,
  Download, ExternalLink, File, Image as ImageIcon,
  Presentation, BookOpen, User
} from "lucide-react";
import { formatRelativeTime, formatBytes } from "@/lib/utils";

const FILE_ICONS: Record<string, React.ElementType> = {
  pdf: FileText, docx: File, doc: File,
  pptx: Presentation, ppt: Presentation,
  txt: BookOpen, md: BookOpen,
  png: ImageIcon, jpg: ImageIcon, jpeg: ImageIcon, webp: ImageIcon, gif: ImageIcon,
};
const IMAGE_EXTS = ["png", "jpg", "jpeg", "webp", "gif"];

export default async function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: note } = await (supabase as any).from("notes").select("*").eq("id", id).single();
  if (!note) notFound();
  if (note.user_id !== user?.id && !note.is_public) notFound();

  const { data: files } = await (supabase as any).from("note_files").select("*").eq("note_id", id);

  const filesWithUrls = await Promise.all(
    (files ?? []).map(async (file: any) => {
      const { data } = await supabase.storage.from("note-files").createSignedUrl(file.storage_path, 60 * 60);
      return { ...file, signedUrl: data?.signedUrl ?? null };
    })
  );

  const { data: profile } = await (supabase as any).from("profiles").select("full_name, email").eq("id", note.user_id).single();
  const uploaderName = profile?.full_name ?? profile?.email?.split("@")[0] ?? "Anonymous";
  const isOwner = user?.id === note.user_id;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <Link href="/dashboard/notes">
        <button className="flex items-center gap-2 text-sm font-medium transition-all hover:translate-x-0.5"
          style={{ color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "white")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Notes
        </button>
      </Link>

      {/* Note header */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)" }} />
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />

        <div className="relative">
          <h1 className="text-2xl font-black text-white mb-3 leading-tight">{note.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> {uploaderName}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {formatRelativeTime(note.created_at)}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-green-400"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
              Public
            </span>
            {isOwner && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>
                Your note
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main - file viewer */}
        <div className="lg:col-span-2 space-y-5">
          {filesWithUrls.map((file: any) => {
            const ext = file.file_name?.split(".").pop()?.toLowerCase() ?? "";
            const isImage = IMAGE_EXTS.includes(ext);
            const isPdf = ext === "pdf";
            const Icon = FILE_ICONS[ext] ?? File;

            return (
              <div key={file.id} className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {/* File header */}
                <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}>
                      <Icon className="h-4.5 w-4.5 h-5 w-5" style={{ color: "#818cf8" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{file.file_name}</p>
                      <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {ext.toUpperCase()} · {formatBytes(file.file_size)}
                      </p>
                    </div>
                  </div>
                  {file.signedUrl && (
                    <div className="flex gap-2">
                      <a href={file.signedUrl} target="_blank" rel="noopener noreferrer">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                          <ExternalLink className="h-3.5 w-3.5" /> Open
                        </button>
                      </a>
                      <a href={file.signedUrl} download={file.file_name}>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <Download className="h-3.5 w-3.5" /> Download
                        </button>
                      </a>
                    </div>
                  )}
                </div>

                {/* File content */}
                {isImage && file.signedUrl && (
                  <div className="p-3">
                    <div className="rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.3)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={file.signedUrl} alt={file.file_name} className="w-full max-h-[600px] object-contain" />
                    </div>
                  </div>
                )}

                {isPdf && file.signedUrl && (
                  <div className="p-3">
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                      <iframe src={`${file.signedUrl}#toolbar=1`} className="w-full h-[700px]" title={file.file_name} />
                    </div>
                  </div>
                )}

                {!isImage && !isPdf && file.signedUrl && (
                  <div className="flex flex-col items-center justify-center py-14 gap-5">
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center"
                      style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                      <Icon className="h-8 w-8" style={{ color: "#818cf8" }} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-white mb-1">{file.file_name}</p>
                      <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>Opens in your device&apos;s default application</p>
                      <div className="flex gap-3 justify-center">
                        <a href={file.signedUrl} target="_blank" rel="noopener noreferrer">
                          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                            <ExternalLink className="h-4 w-4" /> Open File
                          </button>
                        </a>
                        <a href={file.signedUrl} download={file.file_name}>
                          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium"
                            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <Download className="h-4 w-4" /> Download
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Extracted text */}
          {note.content && !note.content.startsWith("[") && (
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2 p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <BookOpen className="h-4 w-4" style={{ color: "#818cf8" }} />
                <p className="text-sm font-semibold text-white">Extracted Content</p>
              </div>
              <div className="p-4">
                <pre className="whitespace-pre-wrap text-xs leading-relaxed max-h-96 overflow-y-auto font-sans"
                  style={{ color: "rgba(255,255,255,0.4)" }}>
                  {note.content.slice(0, 3000)}
                  {note.content.length > 3000 && "\n\n... [truncated]"}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* AI Summary */}
          {note.summary && (
            <div className="rounded-2xl p-4 relative overflow-hidden"
              style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.18)" }}>
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20"
                style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
              <div className="flex items-center gap-2 mb-3 relative">
                <div className="h-6 w-6 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#818cf8" }}>AI Summary</p>
              </div>
              <p className="text-xs leading-relaxed relative" style={{ color: "rgba(255,255,255,0.5)" }}>
                {note.summary}
              </p>
            </div>
          )}

          {/* Tags */}
          {note.tags?.length > 0 && (
            <div className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Topics</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {note.tags.map((tag: string) => (
                  <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                    style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>Note Info</p>
            {[
              { label: "Uploaded by", value: uploaderName },
              { label: "Uploaded", value: formatRelativeTime(note.created_at) },
              { label: "Files", value: filesWithUrls.length.toString() },
              { label: "Visibility", value: "Public" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</span>
                <span className="text-xs font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Link href="/dashboard/chat">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 15px rgba(99,102,241,0.25)" }}>
                <Sparkles className="h-4 w-4" /> Chat with AI
              </button>
            </Link>
            <Link href="/dashboard/notes">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <ArrowLeft className="h-4 w-4" /> Browse Notes
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
