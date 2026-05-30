import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { noteTitle, noteContent } = await req.json();

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY not configured" }, { status: 500 });
  }

  const prompt = `Generate exactly 5 multiple choice questions from this study note. Return ONLY valid JSON with no markdown, no backticks, no explanation.

Note title: "${noteTitle}"
Content: ${noteContent?.slice(0, 4000)}

Return this exact JSON:
{"questions":[{"q":"Question?","options":["A","B","C","D"],"answer":0,"explanation":"Why A is correct"}]}

Rules:
- answer is the index (0-3) of the correct option in the options array
- Make questions test real understanding, not just memorization
- Keep options concise (under 15 words each)
- Explanations should be 1-2 sentences`;

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
            { role: "system", content: "You are a quiz generator. Always respond with valid JSON only. No markdown, no backticks." },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
          max_tokens: 1500,
        }),
      });

      if (!res.ok) continue;

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content ?? "";
      const clean = text.replace(/```json|```/g, "").trim();

      try {
        const parsed = JSON.parse(clean);
        if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          return NextResponse.json(parsed);
        }
      } catch {
        continue;
      }
    } catch {
      continue;
    }
  }

  return NextResponse.json({ error: "Could not generate quiz" }, { status: 500 });
}
