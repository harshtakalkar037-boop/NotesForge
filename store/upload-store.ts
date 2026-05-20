import { create } from "zustand";
import type { UploadedFile } from "@/types";

interface UploadState {
  files: UploadedFile[];
  isUploading: boolean;
  addFile: (file: UploadedFile) => void;
  updateFile: (id: string, updates: Partial<UploadedFile>) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  clearCompleted: () => void;
  setUploading: (uploading: boolean) => void;
}

export const useUploadStore = create<UploadState>()((set) => ({
  files: [],
  isUploading: false,
  addFile: (file) => set((s) => ({ files: [...s.files, file] })),
  updateFile: (id, updates) =>
    set((s) => ({
      files: s.files.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),
  removeFile: (id) =>
    set((s) => ({ files: s.files.filter((f) => f.id !== id) })),
  clearFiles: () => set({ files: [] }),
  clearCompleted: () =>
    set((s) => ({ files: s.files.filter((f) => f.status !== "complete") })),
  setUploading: (isUploading) => set({ isUploading }),
}));
