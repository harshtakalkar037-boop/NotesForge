"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, X, FileText, Image, Link as LinkIcon,
  CheckCircle2, AlertCircle, File, Presentation, Sparkles, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn, formatBytes, getFileExtension, getFileTypeFromExtension } from "@/lib/utils";
import { uploadAndProcessFile } from "@/features/notes/actions";
import type { FileType } from "@/types";
import Link from "next/link";

const FILE_TYPE_ICONS: Record<string, React.ElementType> = {
  pdf: FileText, docx: File, pptx: Presentation,
  txt: FileText, image: Image, link: LinkIcon,
};
const FILE_TYPE_COLORS: Record<string, string> = {
  pdf: "text-red-400 bg-red-500/10",
  docx: "text-blue-400 bg-blue-500/10",
  pptx: "text-orange-400 bg-orange-500/10",
  txt: "text-gray-400 bg-gray-500/10",
  image: "text-green-400 bg-green-500/10",
  link: "text-indigo-400 bg-indigo-500/10",
};

interface QueuedFile {
  id: string;
  file: File;
  name: string;
  type: FileType;
  size: number;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  progress: number;
  error?: string;
  result?: { id: string; title: string; summary: string; tags: string[] };
}

export function FileUploadZone() {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateFile = useCallback((id: string, updates: Partial<QueuedFile>) => {
    setFiles((prev) => prev.map((f) => f.id === id ? { ...f, ...updates } : f));
  }, []);

  const uploadFile = useCallback(async (queued: QueuedFile) => {
    updateFile(queued.id, { status: "uploading", progress: 20 });

    // Fake progress while uploading
    const progressTimer = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === queued.id && f.status === "uploading"
            ? { ...f, progress: Math.min(f.progress + 10, 70) }
            : f
        )
      );
    }, 300);

    const formData = new FormData();
    formData.append("file", queued.file);

    updateFile(queued.id, { progress: 75, status: "processing" });
    clearInterval(progressTimer);

    const result = await uploadAndProcessFile(formData);

    if (result.error) {
      updateFile(queued.id, { status: "error", error: result.error, progress: 0 });
      return;
    }

    updateFile(queued.id, {
      status: "complete",
      progress: 100,
      result: result.note,
    });
  }, [updateFile]);

  const addFiles = useCallback((rawFiles: File[]) => {
    const newQueued: QueuedFile[] = rawFiles.map((file) => {
      const ext = getFileExtension(file.name);
      return {
        id: crypto.randomUUID(),
        file,
        name: file.name,
        type: getFileTypeFromExtension(ext) as FileType,
        size: file.size,
        status: "pending",
        progress: 0,
      };
    });
    setFiles((prev) => [...prev, ...newQueued]);
    // Upload each file
    newQueued.forEach((f) => uploadFile(f));
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, [addFiles]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  };

  const removeFile = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const completedFiles = files.filter((f) => f.status === "complete");
  const hasErrors = files.some((f) => f.status === "error");

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <motion.div
        animate={isDragOver ? { scale: 1.01 } : { scale: 1 }}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all duration-200",
          isDragOver
            ? "border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/10"
            : "border-border hover:border-indigo-500/50 hover:bg-accent/30"
        )}
      >
        <input ref={fileInputRef} type="file" className="hidden" multiple onChange={handleInput} />
        <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center mb-4 transition-colors", isDragOver ? "bg-indigo-500/20" : "bg-secondary")}>
          <Upload className={cn("h-8 w-8 transition-colors", isDragOver ? "text-indigo-400" : "text-muted-foreground")} />
        </div>
        <h3 className="font-semibold text-lg mb-1">{isDragOver ? "Drop files here" : "Drag & drop files here"}</h3>
        <p className="text-sm text-muted-foreground mb-4">or click to browse — uploads instantly to your notes</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["PDF", "DOCX", "PPTX", "TXT", "Images"].map((t) => (
            <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">Max 50MB per file</p>
      </motion.div>

      {/* URL input */}
      <div>
        {showLinkInput ? (
          <div className="flex gap-2">
            <input
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setShowLinkInput(false)}
              placeholder="https://example.com/article"
              className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={() => setShowLinkInput(false)}>Cancel</Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowLinkInput(true)}>
            <LinkIcon className="h-4 w-4" />
            Add a URL instead
          </Button>
        )}
      </div>

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {files.length} file{files.length !== 1 ? "s" : ""}
                {completedFiles.length > 0 && (
                  <span className="text-green-400 ml-2">• {completedFiles.length} processed</span>
                )}
              </p>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setFiles([])}>
                Clear all
              </Button>
            </div>

            {files.map((file) => {
              const typeKey = file.type || getFileTypeFromExtension(getFileExtension(file.name));
              const Icon = FILE_TYPE_ICONS[typeKey] ?? File;
              const colors = FILE_TYPE_COLORS[typeKey] ?? "text-muted-foreground bg-muted";

              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-3">
                    <div className={cn("p-2 rounded-lg shrink-0", colors)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {file.size > 0 && (
                          <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
                        )}
                        {(file.status === "uploading") && (
                          <span className="text-xs text-indigo-400 flex items-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Uploading...
                          </span>
                        )}
                        {file.status === "processing" && (
                          <span className="text-xs text-violet-400 flex items-center gap-1">
                            <Sparkles className="h-3 w-3 animate-pulse" />
                            AI processing...
                          </span>
                        )}
                        {file.status === "complete" && (
                          <span className="text-xs text-green-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Saved to notes
                          </span>
                        )}
                        {file.status === "error" && (
                          <span className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {file.error ?? "Upload failed"}
                          </span>
                        )}
                        {file.status === "pending" && (
                          <span className="text-xs text-muted-foreground">Queued...</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Progress bar */}
                  {(file.status === "uploading" || file.status === "processing") && (
                    <Progress value={file.progress} className="h-0.5 rounded-none" />
                  )}

                  {/* AI Summary result */}
                  {file.status === "complete" && file.result?.summary && (
                    <div className="px-3 pb-3 pt-1 border-t border-border/50">
                      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Sparkles className="h-3 w-3 text-indigo-400" />
                          <span className="text-xs font-semibold text-indigo-400">AI Summary</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {file.result.summary}
                        </p>
                        {file.result.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {file.result.tags.map((tag) => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Go to notes CTA */}
            {completedFiles.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 pt-1">
                <Link href="/dashboard/notes" className="flex-1">
                  <Button variant="outline" className="w-full">View in Notes</Button>
                </Link>
                <Link href="/dashboard/chat" className="flex-1">
                  <Button className="w-full gap-2">
                    <Sparkles className="h-4 w-4" />
                    Chat with AI
                  </Button>
                </Link>
              </motion.div>
            )}

            {hasErrors && (
              <p className="text-xs text-muted-foreground text-center">
                Some files failed. Check your file format and try again.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
