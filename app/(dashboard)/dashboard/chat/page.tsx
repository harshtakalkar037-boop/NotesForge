"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, User, FileText, Zap, Brain, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { chatWithNotes } from "@/features/notes/actions";

interface Message { role: "user" | "assistant"; content: string; }

const STARTERS = [
  { icon: BookOpen, text: "Summarize my notes", color: "#6366f1" },
  { icon: Brain, text: "What are the key concepts?", color: "#8b5cf6" },
  { icon: Zap, text: "Create a quiz from my notes", color: "#06b6d4" },
  { icon: FileText, text: "Explain topics simply", color: "#f59e0b" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    const userMsg: Message = { role: "user", content: msg };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);
    const result = await chatWithNotes(msg, [], messages);
    const reply = result.reply ?? result.error ?? "Something went wrong.";
    // Show helpful message for API key issues
    const displayReply = reply.includes("OPENROUTER_API_KEY") || reply.includes("API key")
      ? "⚠️ AI not configured. Add OPENROUTER_API_KEY to Vercel. Get a free key at openrouter.ai/keys"
      : reply.includes("Invalid OPENROUTER_API_KEY")
      ? "⚠️ Invalid API key. Please update OPENROUTER_API_KEY in Vercel environment variables."
      : reply;
    setMessages((p) => [...p, { role: "assistant", content: displayReply }]);
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]" style={{ maxHeight: "calc(100vh - 5rem)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center animate-glow"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            AI Chat
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.25)" }}>
              Powered by AI
            </span>
          </h1>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Chat with your notes using AI</p>
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col overflow-hidden rounded-2xl"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center pb-8">
              {/* Animated orb */}
              <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }}
                className="h-20 w-20 rounded-3xl flex items-center justify-center mb-6 animate-glow"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)" }}>
                <Sparkles className="h-9 w-9 text-white" />
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2">Chat with your notes</h2>
              <p className="text-sm mb-8 max-w-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                Ask anything about your uploaded documents. AI reads your notes and answers based on the actual content.
              </p>
              {/* Starter prompts */}
              <div className="grid grid-cols-2 gap-3 max-w-md w-full">
                {STARTERS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.button key={s.text} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => send(s.text)}
                      className="flex items-center gap-2.5 p-3 rounded-xl text-left transition-all"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                    >
                      <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${s.color}20`, border: `1px solid ${s.color}30` }}>
                        <Icon className="h-3.5 w-3.5" style={{ color: s.color }} />
                      </div>
                      <span className="text-xs font-medium text-white/70">{s.text}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <>
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ease: [0.16, 1, 0.3, 1] }}
                    className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                    {msg.role === "assistant" && (
                      <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-lg"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className={cn("max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "user" ? "rounded-tr-sm text-white" : "rounded-tl-sm text-white/80")}
                      style={msg.role === "user"
                        ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }
                        : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <User className="h-4 w-4 text-white/60" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {loading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                  <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {[0, 0.15, 0.3].map((d, i) => (
                      <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.8, delay: d, repeat: Infinity }}
                        className="h-1.5 w-1.5 rounded-full" style={{ background: "#818cf8" }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-4 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex gap-2">
            <input ref={inputRef} type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask anything about your notes..."
              disabled={loading}
              className="flex-1 h-11 px-4 rounded-xl text-sm text-white outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={e => { e.target.style.border = "1px solid rgba(99,102,241,0.4)"; e.target.style.background = "rgba(99,102,241,0.06)"; }}
              onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
            />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => send()} disabled={!input.trim() || loading}
              className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: input.trim() ? "0 0 15px rgba(99,102,241,0.4)" : "none" }}>
              <Send className="h-4 w-4 text-white" />
            </motion.button>
          </div>
          <p className="text-[10px] text-center mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
            AI reads all community notes to answer your questions
          </p>
        </div>
      </div>
    </div>
  );
}
