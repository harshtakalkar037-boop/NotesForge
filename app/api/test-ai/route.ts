import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      status: "❌ MISSING",
      message: "OPENROUTER_API_KEY is not set",
      fix: "Go to Vercel → Settings → Environment Variables → add OPENROUTER_API_KEY",
      getKey: "https://openrouter.ai/keys",
    }, { status: 500 });
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://notes-forge-mu.vercel.app",
        "X-Title": "NoteForge AI",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [{ role: "user", content: "Reply with just: OK" }],
        max_tokens: 10,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        status: "❌ API ERROR",
        httpStatus: res.status,
        error: data,
        keyPrefix: apiKey.slice(0, 15) + "...",
      }, { status: 400 });
    }

    const reply = data.choices?.[0]?.message?.content ?? "no text";
    return NextResponse.json({
      status: "✅ WORKING",
      model: "meta-llama/llama-3.1-8b-instruct:free",
      reply,
      keyPrefix: apiKey.slice(0, 15) + "...",
    });
  } catch (e: any) {
    return NextResponse.json({
      status: "❌ FETCH ERROR",
      error: e.message,
    }, { status: 500 });
  }
}
