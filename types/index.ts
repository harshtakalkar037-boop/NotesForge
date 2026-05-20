export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string | null;
          summary: string | null;
          tags: string[];
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content?: string | null;
          summary?: string | null;
          tags?: string[];
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string | null;
          summary?: string | null;
          tags?: string[];
          is_public?: boolean;
          updated_at?: string;
        };
      };
      note_files: {
        Row: {
          id: string;
          note_id: string;
          user_id: string;
          file_name: string;
          file_type: string;
          file_size: number;
          storage_path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          note_id: string;
          user_id: string;
          file_name: string;
          file_type: string;
          file_size: number;
          storage_path: string;
          created_at?: string;
        };
        Update: {
          file_name?: string;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          note_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id: string;
          created_at?: string;
        };
        Update: never;
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          note_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id: string;
          created_at?: string;
        };
        Update: never;
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          note_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type NoteFile = Database["public"]["Tables"]["note_files"]["Row"];
export type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
export type Like = Database["public"]["Tables"]["likes"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];

export interface User {
  id: string;
  email: string;
  profile: Profile | null;
}

export type FileType = "pdf" | "docx" | "pptx" | "txt" | "image" | "link";

export interface UploadedFile {
  id: string;
  name: string;
  type: FileType;
  size: number;
  url?: string;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  progress: number;
  error?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
