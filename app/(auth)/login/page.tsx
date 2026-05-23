"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Sparkles, Globe, ArrowRight } from "lucide-react";
import { login, signInWithGoogle } from "@/features/auth/actions";

function InputField({ label, name, type, placeholder, icon: Icon, required, minLength }: any) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(255,255,255,0.25)" }} />
        <input name={name} type={type} placeholder={placeholder} required={required} minLength={minLength}
          className="w-full h-11 pl-10 pr-4 rounded-xl text-sm text-white outline-none transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          onFocus={e => { e.target.style.border = "1px solid rgba(99,102,241,0.5)"; e.target.style.background = "rgba(99,102,241,0.06)"; }}
          onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
        />
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null);
    const result = await login(new FormData(e.currentTarget));
    if (result?.error) { setError(result.error); setLoading(false); }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signInWithGoogle();
    setGoogleLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ backgroundColor: "#030712" }}>
      {/* Background orbs */}
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.4), transparent)" }} />
      <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.25, 0.1] }} transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.3), transparent)" }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}
              className="h-10 w-10 rounded-xl flex items-center justify-center shadow-xl"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}>
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
            <span className="font-bold text-xl text-white">NoteForge <span style={{ color: "#818cf8" }}>AI</span></span>
          </Link>
          <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Sign in to access the student knowledge hub</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-7 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)" }} />

          {/* Google */}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleGoogle} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2.5 h-11 rounded-xl text-sm font-semibold mb-6 transition-all"
            style={{ background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          >
            <Globe className="h-4 w-4" />
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </motion.button>

          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>or with email</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-400"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Email" name="email" type="email" placeholder="you@example.com" icon={Mail} required />
            <InputField label="Password" name="password" type="password" placeholder="••••••••" icon={Lock} required />
            <div className="flex justify-end">
              <button type="button" className="text-xs transition-colors" style={{ color: "rgba(129,140,248,0.7)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#818cf8")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(129,140,248,0.7)")}>
                Forgot password?
              </button>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              type="submit" disabled={loading}
              className="w-full h-11 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
              {loading ? "Signing in..." : <><span>Sign In</span><ArrowRight className="h-4 w-4" /></>}
            </motion.button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: "rgba(255,255,255,0.3)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold transition-colors" style={{ color: "#818cf8" }}
              onMouseEnter={(e: any) => (e.target.style.color = "#a78bfa")}
              onMouseLeave={(e: any) => (e.target.style.color = "#818cf8")}>
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
