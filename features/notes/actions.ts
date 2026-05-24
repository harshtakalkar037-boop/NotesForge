"use server";

import { createClient } from "@/supabase/server";
import { createAdminClient } from "@/supabase/admin";
import { revalidatePath } from "next/cache";
import { createRequire } from "module";

const require2 = createRequire(import.meta.url);

// ─── Text extraction ─────────────────────────────────────────────
async function extractText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (ext === "txt" || ext === "md") return buffer.toString("utf-8").slice(0, 50000);

  if (ext === "pdf") {
    try {
      const pdfParse = require2("pdf-parse");
      const data = await pdfParse(buffer);
      return (data.text as string).slice(0, 50000);
    } catch { return `[PDF: ${file.name}]`; }
  }

  if (ext === "docx" || ext === "doc") {
    try {
      const mammoth = require2("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return (result.value as string).slice(0, 50000);
    } catch { return `[Word Document: ${file.name}]`; }
  }

  if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) return `[Image: ${file.name}]`;
  if (["pptx", "ppt"].includes(ext)) return `[Presentation: ${file.name}]`;
  return `[File: ${file.name}]`;
}

// ─── AI provider: Google Gemini (free tier — 1500 req/day) ──────
// Models tried in order — skips 404/429 automatically
const GEMINI_MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
];

async function callAI(
  prompt: string,
  systemPrompt: string,
  history?: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to Vercel environment variables. Get a free key at aistudio.google.com/app/apikey"
    );
  }

  // Build conversation for Gemini format
  const geminiHistory = (history ?? []).slice(-8).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const contents = [
    ...geminiHistory,
    { role: "user", parts: [{ text: prompt }] },
  ];

  const errors: string[] = [];

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { temperature: 0.5, maxOutputTokens: 1024 },
        }),
      });

      // Skip on quota or model not found
      if (res.status === 429 || res.status === 503 || res.status === 404) {
        const msg = `${model}: ${res.status}`;
        errors.push(msg);
        console.warn(`Gemini ${msg}, trying next...`);
        continue;
      }

      // Bad key
      if (res.status === 400 || res.status === 401 || res.status === 403) {
        const body = await res.text();
        throw new Error(`Invalid GEMINI_API_KEY or request error: ${body.slice(0, 150)}`);
      }

      if (!res.ok) {
        const errText = await res.text();
        errors.push(`${model}: ${res.status}`);
        console.warn(`Gemini ${model} error:`, errText.slice(0, 100));
        continue;
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (!text) {
        errors.push(`${model}: empty`);
        continue;
      }
      return text;
    } catch (e: any) {
      if (e.message.includes("GEMINI_API_KEY") || e.message.includes("Invalid")) throw e;
      errors.push(`${model}: ${e.message}`);
      console.warn(`Gemini ${model} exception:`, e.message);
      continue;
    }
  }

  console.error("All Gemini models failed:", errors);
  throw new Error("AI temporarily unavailable. Please try again in a moment.");
}

// ─── AI Summary ──────────────────────────────────────────────────
async function generateSummary(
  text: string,
  title: string
): Promise<{ summary: string; tags: string[] }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      summary: "Add GEMINI_API_KEY to Vercel environment variables to enable AI summaries. Get a free key at aistudio.google.com/app/apikey",
      tags: [],
    };
  }

  const prompt = `Document title: "${title}"
Content:
${text.slice(0, 6000)}

Respond with ONLY this JSON (no markdown, no backticks):
{"summary":"3-5 sentence summary of the key points","tags":["tag1","tag2","tag3","tag4"]}`;

  try {
    const raw = await callAI(prompt, "You are a document summarizer. Always respond with valid JSON only. No markdown, no backticks.");
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return {
      summary: parsed.summary ?? "Summary unavailable.",
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6) : [],
    };
  } catch (e: any) {
    console.error("Summary error:", e);
    return {
      summary: e.message?.includes("quota")
        ? "AI quota reached — your file was saved! Summary will generate on next upload."
        : "Could not generate AI summary for this document.",
      tags: [],
    };
  }
}

// ─── Upload + Process ─────────────────────────────────────────────
export async function uploadAndProcessFile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "No file provided." };
  if (file.size > 50 * 1024 * 1024) return { error: "File too large. Maximum 50MB." };

  try {
    // 1. Upload to Supabase Storage
    const storagePath = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error: storageError } = await supabase.storage
      .from("note-files")
      .upload(storagePath, file, { upsert: false, contentType: file.type });

    if (storageError) return { error: `Upload failed: ${storageError.message}` };

    // 2. Get signed URL (1 hour) so the file can be viewed
    const { data: signedData } = await supabase.storage
      .from("note-files")
      .createSignedUrl(storagePath, 60 * 60);

    const fileUrl = signedData?.signedUrl ?? null;

    // 3. Extract text
    const extractedText = await extractText(file);

    // 4. AI summary
    const title = file.name.replace(/\.[^/.]+$/, "");
    const { summary, tags } = await generateSummary(extractedText, title);

    // 5. Save note to DB
    const { data: note, error: noteError } = await (supabase as any)
      .from("notes")
      .insert({
        user_id: user.id,
        title,
        content: extractedText,
        summary,
        tags,
        is_public: true,
      })
      .select()
      .single();

    if (noteError) return { error: `Failed to save note: ${noteError.message}` };

    // 6. Save file record with storage path
    const ext = file.name.split(".").pop() ?? "bin";
    await (supabase as any).from("note_files").insert({
      note_id: note.id,
      user_id: user.id,
      file_name: file.name,
      file_type: ext,
      file_size: file.size,
      storage_path: storagePath,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notes");

    return {
      success: true,
      note: {
        id: note.id,
        title: note.title,
        summary: note.summary,
        tags: note.tags,
        fileUrl,
        fileType: ext,
      },
    };
  } catch (err) {
    console.error("Upload error:", err);
    return { error: "An unexpected error occurred during upload." };
  }
}

// ─── Get signed URL for a stored file ────────────────────────────
export async function getFileUrl(storagePath: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.storage
    .from("note-files")
    .createSignedUrl(storagePath, 60 * 60);
  return data?.signedUrl ?? null;
}

// ─── AI Chat ─────────────────────────────────────────────────────
export async function chatWithNotes(
  message: string,
  noteIds: string[],
  history: { role: "user" | "assistant"; content: string }[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      error: "GEMINI_API_KEY not configured. Get a free key at aistudio.google.com and add it to Vercel environment variables.",
    };
  }

  // Fetch notes context
  const { data: notes } = await (supabase as any)
    .from("notes")
    .select("title, content, summary, tags")
    .eq("user_id", user.id)
    .limit(8);

  const context = notes?.length
    ? notes
        .map(
          (n: any) =>
            `### ${n.title}\nSummary: ${n.summary ?? "N/A"}\nContent excerpt: ${(n.content ?? "").slice(0, 2000)}`
        )
        .join("\n\n---\n\n")
    : null;

  const systemPrompt = `You are NoteForge AI, an expert study assistant. Help users understand, review, and learn from their uploaded documents.

${
  context
    ? `Here is content from the user's notes:\n\n${context}`
    : "The user hasn't uploaded any notes yet. Encourage them to go to the Upload page and add some documents first."
}

Be concise, helpful, and educational. When referencing notes, mention the document title. Use bullet points for lists.`;

  try {
    const reply = await callAI(message, systemPrompt, history.slice(-10));
    return { reply: reply || "I couldn't generate a response. Please try again." };
  } catch (err: any) {
    console.error("Chat error:", err);
    return { error: err.message ?? "Failed to get AI response." };
  }
}
