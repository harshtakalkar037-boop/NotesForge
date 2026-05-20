import { create } from "zustand";
import type { Note } from "@/types";

interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  isLoading: boolean;
  searchQuery: string;
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  removeNote: (id: string) => void;
  setSelectedNote: (note: Note | null) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  filteredNotes: () => Note[];
}

export const useNotesStore = create<NotesState>()((set, get) => ({
  notes: [],
  selectedNote: null,
  isLoading: false,
  searchQuery: "",
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((s) => ({ notes: [note, ...s.notes] })),
  updateNote: (id, updates) =>
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    })),
  removeNote: (id) =>
    set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
  setSelectedNote: (note) => set({ selectedNote: note }),
  setLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  filteredNotes: () => {
    const { notes, searchQuery } = get();
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content?.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
    );
  },
}));
