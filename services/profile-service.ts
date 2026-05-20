import { createClient } from "@/supabase/client";
import type { Profile } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => createClient() as any;

export const profileService = {
  async get(userId: string): Promise<Profile | null> {
    const { data, error } = await db().from("profiles").select("*").eq("id", userId).single();
    if (error) return null;
    return data as Profile;
  },

  async update(userId: string, updates: Partial<Pick<Profile, "full_name" | "avatar_url">>): Promise<Profile> {
    const { data, error } = await db().from("profiles").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", userId).select().single();
    if (error) throw error;
    return data as Profile;
  },
};
