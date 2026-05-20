import { createClient } from "@/supabase/client";
import type { Note } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => createClient() as any;

export const notesService = {
  async getAll(): Promise<Note[]> {
    const { data, error } = await db().from("notes").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Note[];
  },

  async getById(id: string): Promise<Note | null> {
    const { data, error } = await db().from("notes").select("*").eq("id", id).single();
    if (error) return null;
    return data as Note;
  },

  async create(title: string, userId: string, content?: string, tags: string[] = []): Promise<Note> {
    const { data, error } = await db().from("notes").insert({ title, content, tags, user_id: userId }).select().single();
    if (error) throw error;
    return data as Note;
  },

  async update(id: string, updates: Partial<Pick<Note, "title" | "content" | "summary" | "tags" | "is_public">>): Promise<Note> {
    const { data, error } = await db().from("notes").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    return data as Note;
  },

  async delete(id: string): Promise<void> {
    const { error } = await db().from("notes").delete().eq("id", id);
    if (error) throw error;
  },

  async search(query: string): Promise<Note[]> {
    const { data, error } = await db().from("notes").select("*").or(`title.ilike.%${query}%,content.ilike.%${query}%`).order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Note[];
  },
};
