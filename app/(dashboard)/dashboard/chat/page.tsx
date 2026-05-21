"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { chatWithNotes } from "@/features/notes/actions";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "Summarize my notes",
  "What are the key concepts?",
  "Create a quiz from my notes",
  "Explain the main topics simply",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text?: string) {
    const msg = text ?? input.trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const result = await chatWithNotes(msg, [], messages);

    if (result.error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${result.error}` },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.reply ?? "No response." },
      ]);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            AI Chat
            <Badge variant="indigo" className="text-xs">Powered by Claude</Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Ask anything about your uploaded notes
          </p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card flex flex-col">
        {messages.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center mb-5">
              <Sparkles className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Chat with your notes</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              Ask questions about your uploaded documents and get instant AI-powered answers.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-muted-foreground hover:text-indigo-400"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm"
                  )}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                  {[0, 0.15, 0.3].map((d, i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: `${d}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-4 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask anything about your notes..."
              className="flex-1 h-10 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              disabled={loading}
            />
            <Button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              size="icon"
              className="rounded-xl shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI reads your uploaded notes to answer questions
          </p>
        </div>
      </div>
    </div>
  );
}
