"use client";

import { useEffect, useCallback } from "react";
import { createClient } from "@/supabase/client";
import { useNotesStore } from "@/store";
import type { Note } from "@/types";

export function useNotes() {
  const {
    notes,
    isLoading,
    setNotes,
    setLoading,
    addNote,
    updateNote,
    removeNote,
    filteredNotes,
    searchQuery,
    setSearchQuery,
  } = useNotesStore();

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setNotes(data as Note[]);
    setLoading(false);
  }, [setNotes, setLoading]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (title: string, content?: string) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("notes")
      .insert([{ title, content, user_id: user.id }] as never[])
      .select()
      .single();

    if (!error && data) addNote(data as Note);
    return error ? null : (data as Note);
  };

  const deleteNote = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (!error) removeNote(id);
    return !error;
  };

  return {
    notes,
    isLoading,
    filteredNotes: filteredNotes(),
    searchQuery,
    setSearchQuery,
    refetch: fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
}
