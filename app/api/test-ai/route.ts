import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      status: "❌ MISSING",
      message: "GEMINI_API_KEY is not set in environment variables",
      fix: "Go to Vercel → Settings → Environment Variables → add GEMINI_API_KEY",
      getKey: "https://aistudio.google.com/app/apikey",
    }, { status: 500 });
  }

  // Test with the cheapest/fastest model
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Reply with just: OK" }] }],
        generationConfig: { maxOutputTokens: 10 },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        status: "❌ API ERROR",
        httpStatus: res.status,
        error: data,
        keyPrefix: apiKey.slice(0, 10) + "...",
      }, { status: 400 });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "no text";
    return NextResponse.json({
      status: "✅ WORKING",
      model: "gemini-2.0-flash-lite",
      reply,
      keyPrefix: apiKey.slice(0, 10) + "...",
    });
  } catch (e: any) {
    return NextResponse.json({
      status: "❌ FETCH ERROR",
      error: e.message,
    }, { status: 500 });
  }
}
