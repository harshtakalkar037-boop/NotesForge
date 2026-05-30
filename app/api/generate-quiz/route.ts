import { NextRequest, NextResponse } from "next/server";

async function callWithOpenRouter(prompt: string, apiKey: string): Promise<string | null> {
  const models = [
    "meta-llama/llama-3.1-8b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "google/gemma-2-9b-it:free",
  ];
  for (const model of models) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://notes-forge-mu.vercel.app",
          "X-Title": "NoteForge AI",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: "You are a quiz generator. Respond with valid JSON only. No markdown." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      return data.choices?.[0]?.message?.content ?? null;
    } catch { continue; }
  }
  return null;
}

async function callWithGemini(prompt: string, apiKey: string): Promise<string | null> {
  const models = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-1.5-flash-latest"];
  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: "You are a quiz generator. Respond with valid JSON only. No markdown, no backticks." }] },
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 1500 },
          }),
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    } catch { continue; }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const { noteTitle, noteContent } = await req.json();

  const prompt = `Generate exactly 5 multiple choice questions from this study note. Return ONLY valid JSON, no markdown, no backticks.

Note: "${noteTitle}"
Content: ${noteContent?.slice(0, 3000)}

Return ONLY this JSON:
{"questions":[{"q":"Question?","options":["A","B","C","D"],"answer":0,"explanation":"Why correct"}]}

Rules: answer = index 0-3 of correct option. Make questions test real understanding.`;

  let raw: string | null = null;

  const orKey = process.env.OPENROUTER_API_KEY;
  const gemKey = process.env.GEMINI_API_KEY;

  if (orKey) raw = await callWithOpenRouter(prompt, orKey);
  if (!raw && gemKey) raw = await callWithGemini(prompt, gemKey);

  if (!raw) {
    return NextResponse.json({ error: "No AI provider configured or all failed" }, { status: 500 });
  }

  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    if (parsed.questions?.length > 0) return NextResponse.json(parsed);
  } catch { /* fall through */ }

  return NextResponse.json({ error: "Invalid AI response" }, { status: 500 });
}
