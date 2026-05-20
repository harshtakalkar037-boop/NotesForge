"use client";

import { useCallback } from "react";
import { createClient } from "@/supabase/client";
import { useUploadStore } from "@/store";
import { getFileExtension, getFileTypeFromExtension } from "@/lib/utils";
import type { UploadedFile, FileType } from "@/types";

export function useUpload() {
  const { files, isUploading, addFile, updateFile, removeFile, clearFiles, clearCompleted, setUploading } =
    useUploadStore();

  const uploadFile = useCallback(
    async (rawFile: File) => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const ext = getFileExtension(rawFile.name);
      const fileType = getFileTypeFromExtension(ext) as FileType;
      const filePath = `${user.id}/${Date.now()}-${rawFile.name}`;

      const uploadEntry: UploadedFile = {
        id: crypto.randomUUID(),
        name: rawFile.name,
        type: fileType,
        size: rawFile.size,
        status: "uploading",
        progress: 0,
      };

      addFile(uploadEntry);
      setUploading(true);

      let progress = 0;
      const progressInterval = setInterval(() => {
        progress = Math.min(progress + 15, 85);
        updateFile(uploadEntry.id, { progress });
      }, 200);

      const { data, error } = await supabase.storage
        .from("note-files")
        .upload(filePath, rawFile, { upsert: false });

      clearInterval(progressInterval);

      if (error) {
        updateFile(uploadEntry.id, { status: "error", progress: 0, error: error.message });
        setUploading(false);
        return null;
      }

      updateFile(uploadEntry.id, { status: "complete", progress: 100, url: data.path });
      setUploading(false);
      return data.path;
    },
    [addFile, updateFile, setUploading]
  );

  const uploadMultiple = useCallback(
    async (rawFiles: File[]) => {
      const results = await Promise.all(rawFiles.map((f) => uploadFile(f)));
      return results.filter(Boolean) as string[];
    },
    [uploadFile]
  );

  return { files, isUploading, uploadFile, uploadMultiple, removeFile, clearFiles, clearCompleted };
}
