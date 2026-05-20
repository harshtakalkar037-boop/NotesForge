import { createClient } from "@/supabase/client";

const BUCKET = "note-files";

export const storageService = {
  async upload(userId: string, file: File): Promise<string> {
    const supabase = createClient();
    const path = `${userId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: false });
    if (error) throw error;
    return data.path;
  },

  async getUrl(path: string): Promise<string> {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 60); // 1 hour
    return data?.signedUrl ?? "";
  },

  async delete(path: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([path]);
    if (error) throw error;
  },

  async list(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(userId);
    if (error) throw error;
    return data ?? [];
  },
};
