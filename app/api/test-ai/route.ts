import { NextResponse } from "next/server";

export async function GET() {
  const orKey = process.env.OPENROUTER_API_KEY;
  const gemKey = process.env.GEMINI_API_KEY;

  const results: any = {};

  if (!orKey && !gemKey) {
    return NextResponse.json({
      status: "❌ NO KEYS",
      message: "No AI API keys configured",
      options: [
        "OPENROUTER_API_KEY — free at openrouter.ai/keys",
        "GEMINI_API_KEY — free at aistudio.google.com/app/apikey",
      ],
    }, { status: 500 });
  }

  // Test OpenRouter
  if (orKey) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${orKey}`, "HTTP-Referer": "https://notes-forge-mu.vercel.app" },
        body: JSON.stringify({ model: "meta-llama/llama-3.1-8b-instruct:free", messages: [{ role: "user", content: "Say OK" }], max_tokens: 5 }),
      });
      const data = await res.json();
      results.openrouter = res.ok ? `✅ Working — ${data.choices?.[0]?.message?.content}` : `❌ ${res.status}: ${JSON.stringify(data).slice(0, 80)}`;
    } catch (e: any) { results.openrouter = `❌ ${e.message}`; }
  }

  // Test Gemini
  if (gemKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${gemKey}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Say OK" }] }], generationConfig: { maxOutputTokens: 5 } }) }
      );
      const data = await res.json();
      results.gemini = res.ok ? `✅ Working — ${data.candidates?.[0]?.content?.parts?.[0]?.text}` : `❌ ${res.status}: ${JSON.stringify(data).slice(0, 80)}`;
    } catch (e: any) { results.gemini = `❌ ${e.message}`; }
  }

  const anyWorking = Object.values(results).some((v: any) => v.startsWith("✅"));

  return NextResponse.json({
    status: anyWorking ? "✅ AI IS WORKING" : "❌ ALL PROVIDERS FAILED",
    providers: results,
  }, { status: anyWorking ? 200 : 500 });
}
