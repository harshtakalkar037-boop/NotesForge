"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, Image, Link as LinkIcon, CheckCircle2, AlertCircle, File, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn, formatBytes, getFileExtension, getFileTypeFromExtension } from "@/lib/utils";
import type { UploadedFile, FileType } from "@/types";

const FILE_TYPE_ICONS: Record<string, React.ElementType> = {
  pdf: FileText,
  docx: File,
  pptx: Presentation,
  txt: FileText,
  image: Image,
  link: LinkIcon,
};

const FILE_TYPE_COLORS: Record<string, string> = {
  pdf: "text-red-400 bg-red-500/10",
  docx: "text-blue-400 bg-blue-500/10",
  pptx: "text-orange-400 bg-orange-500/10",
  txt: "text-gray-400 bg-gray-500/10",
  image: "text-green-400 bg-green-500/10",
  link: "text-indigo-400 bg-indigo-500/10",
};

interface FileUploadZoneProps {
  onFilesAdded?: (files: UploadedFile[]) => void;
}

export function FileUploadZone({ onFilesAdded }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = useCallback((id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) => prev.map((f) => f.id === id ? { ...f, progress: 100, status: "complete" as const } : f));
      } else {
        setFiles((prev) => prev.map((f) => f.id === id ? { ...f, progress, status: "uploading" as const } : f));
      }
    }, 200);
  }, []);

  const processFiles = useCallback((rawFiles: File[]) => {
    const newFiles: UploadedFile[] = rawFiles.map((file) => {
      const ext = getFileExtension(file.name);
      const type = getFileTypeFromExtension(ext) as FileType;
      return { id: crypto.randomUUID(), name: file.name, type, size: file.size, status: "pending" as const, progress: 0 };
    });
    setFiles((prev) => [...prev, ...newFiles]);
    onFilesAdded?.(newFiles);
    newFiles.forEach((f) => simulateUpload(f.id));
  }, [onFilesAdded, simulateUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length) processFiles(droppedFiles);
  }, [processFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length) processFiles(selected);
    e.target.value = "";
  };

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const addLink = () => {
    if (!linkInput.trim()) return;
    const newFile: UploadedFile = { id: crypto.randomUUID(), name: linkInput, type: "link", size: 0, status: "pending", progress: 0 };
    setFiles((prev) => [...prev, newFile]);
    simulateUpload(newFile.id);
    setLinkInput("");
    setShowLinkInput(false);
  };

  return (
    <div className="space-y-4">
      <motion.div
        animate={isDragOver ? { scale: 1.01 } : { scale: 1 }}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all duration-200",
          isDragOver ? "border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/10" : "border-border hover:border-indigo-500/50 hover:bg-accent/30"
        )}
      >
        <input ref={fileInputRef} type="file" className="hidden" multiple onChange={handleFileInput} />
        <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center mb-4 transition-colors", isDragOver ? "bg-indigo-500/20" : "bg-secondary")}>
          <Upload className={cn("h-8 w-8 transition-colors", isDragOver ? "text-indigo-400" : "text-muted-foreground")} />
        </div>
        <h3 className="font-semibold text-lg mb-1">{isDragOver ? "Drop files here" : "Drag & drop files here"}</h3>
        <p className="text-sm text-muted-foreground mb-4">or click to browse from your computer</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["PDF", "DOCX", "PPTX", "TXT", "Images"].map((type) => (
            <Badge key={type} variant="secondary" className="text-xs">{type}</Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">Max 50MB per file</p>
      </motion.div>

      <div>
        {showLinkInput ? (
          <div className="flex gap-2">
            <input type="url" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLink()} placeholder="https://example.com/article" className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" autoFocus />
            <Button onClick={addLink} size="sm">Add</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowLinkInput(false)}>Cancel</Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowLinkInput(true)}>
            <LinkIcon className="h-4 w-4" />
            Add a URL instead
          </Button>
        )}
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{files.length} file{files.length !== 1 ? "s" : ""} queued</p>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setFiles([])}>Clear all</Button>
            </div>
            {files.map((file) => {
              const ext = getFileExtension(file.name);
              const typeKey = file.type || getFileTypeFromExtension(ext);
              const Icon = FILE_TYPE_ICONS[typeKey] ?? File;
              const colors = FILE_TYPE_COLORS[typeKey] ?? "text-muted-foreground bg-muted";
              return (
                <motion.div key={file.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
                  <div className={cn("p-2 rounded-lg shrink-0", colors)}><Icon className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {file.size > 0 && <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>}
                      {file.status === "uploading" && <Progress value={file.progress} className="h-1 flex-1 max-w-[120px]" />}
                      {file.status === "complete" && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Uploaded</span>}
                      {file.status === "error" && <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Failed</span>}
                      {file.status === "pending" && <span className="text-xs text-muted-foreground">Pending...</span>}
                    </div>
                  </div>
                  <button onClick={() => removeFile(file.id)} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1">
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
            {files.some((f) => f.status === "complete") && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button className="w-full mt-2">Process with AI</Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
