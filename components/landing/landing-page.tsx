"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Sparkles, Brain, ArrowRight, Users, Zap,
  FileText, Upload, MessageSquare, Star,
  GraduationCap, ChevronDown, Menu, X,
  BookOpen, Trophy, Clock, Search, Flame,
  Share2, Eye, TrendingUp
} from "lucide-react";

// ── Mouse spotlight ───────────────────────────────────────────────
function MouseSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + "px";
        ref.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return (
    <div ref={ref} className="pointer-events-none fixed z-0 rounded-full"
      style={{
        width: 500, height: 500,
        transform: "translate(-50%,-50%)",
        background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
        transition: "left 0.1s, top 0.1s",
      }} />
  );
}

// ── Typewriter ────────────────────────────────────────────────────
function Typewriter({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i];
    if (!del && text.length < w.length) {
      const t = setTimeout(() => setText(w.slice(0, text.length + 1)), 80);
      return () => clearTimeout(t);
    }
    if (!del && text.length === w.length) {
      const t = setTimeout(() => setDel(true), 2200);
      return () => clearTimeout(t);
    }
    if (del && text.length > 0) {
      const t = setTimeout(() => setText(text.slice(0, -1)), 40);
      return () => clearTimeout(t);
    }
    if (del && text.length === 0) {
      setDel(false);
      setI((prev) => (prev + 1) % words.length);
    }
  }, [text, del, i, words]);
  return (
    <span style={{ color: "#818cf8" }}>
      {text}
      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ color: "#a78bfa" }}>|</motion.span>
    </span>
  );
}

// ── Animated counter ──────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 2000, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, to]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Floating orbs background ──────────────────────────────────────
function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div style={{ position: "absolute", inset: 0, backgroundColor: "#030712" }} />
      <motion.div animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "-10%", left: "-5%", width: "55vw", height: "55vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <motion.div animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "50vw", height: "50vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", filter: "blur(50px)" }} />
      <motion.div animate={{ x: [0, 30, -30, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 8 }}
        style={{ position: "absolute", top: "40%", left: "40%", width: "35vw", height: "35vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.025,
        backgroundImage: "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
        backgroundSize: "72px 72px" }} />
    </div>
  );
}

// ── Sample notes for preview ──────────────────────────────────────
const NOTES = [
  { subject: "Physics", title: "Quantum Mechanics — Wave-Particle Duality", summary: "Explains superposition, Schrödinger equation and real exam examples.", tags: ["quantum", "exam"], likes: 847, views: 4230, hot: true },
  { subject: "Maths", title: "Integration Tricks Master Sheet", summary: "All techniques: by parts, substitution, partial fractions with solved examples.", tags: ["calculus", "tricks"], likes: 1203, views: 8900, hot: true },
  { subject: "Chemistry", title: "Organic Reactions Complete Reference", summary: "SN1, SN2, elimination reactions with mechanisms and stereochemistry.", tags: ["organic", "reactions"], likes: 634, views: 3100, hot: false },
  { subject: "Biology", title: "Cell Division — Mitosis vs Meiosis", summary: "Step-by-step diagrams with memory tricks for exams.", tags: ["cells", "division"], likes: 421, views: 2800, hot: false },
  { subject: "CS", title: "DSA Cheat Sheet — All Complexities", summary: "Arrays, trees, graphs, sorting — all time/space complexities in one place.", tags: ["dsa", "interview"], likes: 2100, views: 15000, hot: true },
  { subject: "History", title: "World War II — Complete Timeline", summary: "Every major event, date and turning point organized chronologically.", tags: ["wwii", "dates"], likes: 389, views: 1900, hot: false },
];

const SUBJ_GRAD: Record<string, [string, string]> = {
  Physics: ["#3b82f6", "#6366f1"],
  Maths: ["#8b5cf6", "#a855f7"],
  Chemistry: ["#10b981", "#06b6d4"],
  Biology: ["#f59e0b", "#f97316"],
  CS: ["#6366f1", "#8b5cf6"],
  History: ["#ec4899", "#f43f5e"],
};

// ── Unique features ───────────────────────────────────────────────
const UNIQUE_FEATURES = [
  { icon: "🧠", title: "AI Study Buddy", desc: "Chat with any note using AI. Ask questions, get explanations, generate quizzes — all from the actual content.", tag: "Unique" },
  { icon: "🔥", title: "Trending Notes", desc: "See what notes are going viral right now. Most-viewed, most-liked, hottest this week — like Reddit for study notes.", tag: "New" },
  { icon: "⚡", title: "Instant Quiz Mode", desc: "One click converts any note into a quiz. Practice questions auto-generated by AI from the actual content.", tag: "AI" },
  { icon: "📊", title: "Knowledge Graph", desc: "Visualize how subjects connect. See which topics are related and build a mental map of your curriculum.", tag: "Unique" },
  { icon: "🎯", title: "Exam Countdown", desc: "Set your exam date. Get smart study reminders and priority notes ranked by your exam topics.", tag: "New" },
  { icon: "👥", title: "Study Groups", desc: "Create private study rooms, share notes within groups, and collaborate with classmates in real time.", tag: "Coming" },
];

export function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeNote, setActiveNote] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Auto-rotate active note
  useEffect(() => {
    const t = setInterval(() => setActiveNote((p) => (p + 1) % NOTES.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ backgroundColor: "#030712", color: "white", overflowX: "hidden", minHeight: "100vh" }}>
      <MouseSpotlight />
      <Background />

      {/* ══ NAVBAR ══ */}
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          transition: "all 0.4s",
          ...(scrolled ? { background: "rgba(3,7,18,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" } : {}),
        }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}
              style={{ height: 36, width: 36, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>
              <Sparkles style={{ width: 18, height: 18, color: "white" }} />
            </motion.div>
            <span style={{ fontWeight: 800, fontSize: 17, color: "white" }}>NoteForge <span style={{ color: "#818cf8" }}>AI</span></span>
          </Link>

          <div style={{ display: "flex", gap: 32, fontSize: 14, color: "rgba(255,255,255,0.45)" }} className="hidden md:flex">
            {["Features", "How It Works", "Community"].map(item => (
              <motion.button key={item} whileHover={{ color: "#ffffff" }} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: "inherit" }}>{item}</motion.button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="hidden md:flex">
            <Link href="/login"><button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "8px 16px", borderRadius: 10, fontSize: 14, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>Sign In</button></Link>
            <Link href="/signup">
              <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99,102,241,0.5)" }} whileTap={{ scale: 0.97 }}
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "white", padding: "9px 22px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Get Started Free
              </motion.button>
            </Link>
          </div>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(3,7,18,0.97)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              {["Features", "How It Works", "Community"].map(i => (
                <button key={i} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", textAlign: "left", fontSize: 14, cursor: "pointer" }}>{i}</button>
              ))}
              <div style={{ display: "flex", gap: 8, paddingTop: 8 }}>
                <Link href="/login" style={{ flex: 1 }}><button style={{ width: "100%", padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer" }}>Sign In</button></Link>
                <Link href="/signup" style={{ flex: 1 }}><button style={{ width: "100%", padding: "10px", borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "white", fontWeight: 700, cursor: "pointer" }}>Get Started</button></Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ══ HERO ══ */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: 80 }}>
        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #06b6d4, transparent)" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity, maxWidth: 1100, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 10 }}>

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 9999, border: "1px solid rgba(99,102,241,0.25)", background: "rgba(99,102,241,0.08)", color: "rgba(129,140,248,0.9)", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 28 }}>
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: "50%", background: "#818cf8" }} />
            The Open Student Knowledge Platform
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: "clamp(42px, 8vw, 88px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-0.03em", marginBottom: 20, color: "white" }}>
            Where students<br />share & learn<br /><Typewriter words={["together.", "smarter.", "faster.", "for free."]} />
          </motion.h1>

          {/* Sub */}
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 }}
            style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "rgba(255,255,255,0.4)", maxWidth: 600, margin: "0 auto 36px", lineHeight: 1.6, fontWeight: 300 }}>
            Upload notes. AI summarizes instantly. Every student on the platform gets access — no paywalls, no limits, forever free.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.65 }}
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            <Link href="/signup">
              <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(99,102,241,0.5)" }} whileTap={{ scale: 0.96 }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 16, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", boxShadow: "0 0 30px rgba(99,102,241,0.3)" }}>
                Start Sharing Notes <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link href="/dashboard/notes">
              <motion.button whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.07)" }} whileTap={{ scale: 0.97 }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 16, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 16, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
                <Eye size={18} /> Browse Notes
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }}
            style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", marginBottom: 64 }}>
            {[
              { v: 12400, s: "+", l: "Notes Shared" },
              { v: 8500, s: "+", l: "Students" },
              { v: 50, s: "+", l: "Subjects" },
              { v: 100, s: "%", l: "Free Forever" },
            ].map(({ v, s, l }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 900, color: "white", fontVariantNumeric: "tabular-nums" }}>
                  <Counter to={v} suffix={s} />
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </motion.div>

          {/* Live notes ticker */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.1 }}
            style={{ maxWidth: 760, margin: "0 auto", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.05em" }}>LIVE NOTES FEED</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(239,68,68,0.6)" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(245,158,11,0.6)" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(34,197,94,0.6)" }} />
              </div>
            </div>

            {/* Note cards */}
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {NOTES.slice(0, 4).map((note, idx) => {
                const grad = SUBJ_GRAD[note.subject];
                const isActive = idx === activeNote % 4;
                return (
                  <motion.div key={note.title}
                    animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.99, x: isActive ? 0 : -4 }}
                    transition={{ duration: 0.4 }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12,
                      background: isActive ? "rgba(99,102,241,0.08)" : "transparent",
                      border: isActive ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
                      cursor: "pointer" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center",  flexShrink: 0 }}>
                      <FileText style={{ width: 14, height: 14, color: "white" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{note.title}</span>
                        {note.hot && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 9999, background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", flexShrink: 0 }}>🔥 Hot</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                        {note.subject} · {note.views.toLocaleString()} views · ❤️ {note.likes}
                      </div>
                    </div>
                    {isActive && (
                      <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                        style={{ fontSize: 11, color: "#818cf8", fontWeight: 600, flexShrink: 0 }}>
                        New →
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.2)" }}>
          <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase" }}>Scroll</span>
          <ChevronDown size={16} />
        </motion.div>
      </section>

      {/* ══ UNIQUE FEATURES ══ */}
      <section style={{ padding: "120px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#818cf8", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16 }}>Why NoteForge is Different</p>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: "white", marginBottom: 16, lineHeight: 1.1 }}>
            Features you won&apos;t find<br />anywhere else
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", maxWidth: 500, margin: "0 auto" }}>Not just a file dump — a living, breathing learning ecosystem.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {UNIQUE_FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{ borderRadius: 20, padding: 28, position: "relative", overflow: "hidden", cursor: "pointer",
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.3)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(99,102,241,0.1)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>

              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: i % 3 === 0 ? "linear-gradient(90deg, #6366f1, #8b5cf6)" : i % 3 === 1 ? "linear-gradient(90deg, #06b6d4, #6366f1)" : "linear-gradient(90deg, #8b5cf6, #ec4899)" }} />

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 36 }}>{f.icon}</span>
                <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 9999, fontWeight: 700, letterSpacing: "0.05em",
                  background: f.tag === "New" ? "rgba(34,197,94,0.1)" : f.tag === "AI" ? "rgba(99,102,241,0.12)" : f.tag === "Coming" ? "rgba(107,114,128,0.1)" : "rgba(139,92,246,0.12)",
                  color: f.tag === "New" ? "#4ade80" : f.tag === "AI" ? "#818cf8" : f.tag === "Coming" ? "#9ca3af" : "#a78bfa",
                  border: `1px solid ${f.tag === "New" ? "rgba(34,197,94,0.2)" : f.tag === "AI" ? "rgba(99,102,241,0.25)" : f.tag === "Coming" ? "rgba(107,114,128,0.2)" : "rgba(139,92,246,0.25)"}` }}>
                  {f.tag}
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ TRENDING NOTES PREVIEW ══ */}
      <section style={{ padding: "80px 24px 120px", maxWidth: 1280, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>🔥 Trending This Week</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, color: "white", lineHeight: 1.1 }}>Notes going viral<br />right now</h2>
          </div>
          <Link href="/dashboard/notes">
            <motion.button whileHover={{ scale: 1.04 }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 14 }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}>
              See all notes <ArrowRight size={16} />
            </motion.button>
          </Link>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {NOTES.filter(n => n.hot).map((note, i) => {
            const grad = SUBJ_GRAD[note.subject];
            return (
              <motion.div key={note.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                style={{ borderRadius: 20, overflow: "hidden", position: "relative", cursor: "pointer",
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${grad[0]}50`; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${grad[0]}20`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                <div style={{ height: 3, background: `linear-gradient(90deg, ${grad[0]}, ${grad[1]})` }} />
                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 9999, background: `${grad[0]}20`, color: grad[0], border: `1px solid ${grad[0]}30`, fontWeight: 700 }}>{note.subject}</span>
                    <span style={{ fontSize: 11, color: "#f87171", background: "rgba(239,68,68,0.1)", padding: "4px 10px", borderRadius: 9999, border: "1px solid rgba(239,68,68,0.2)" }}>🔥 Trending</span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 10, lineHeight: 1.4 }}>{note.title}</h3>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, marginBottom: 16 }}>{note.summary}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                    {note.tags.map(t => <span key={t} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 9999, background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.18)" }}>#{t}</span>)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={13} /> {note.views.toLocaleString()}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={13} /> {note.likes}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><TrendingUp size={13} /> Viral</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section style={{ padding: "80px 24px 120px", maxWidth: 1280, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#06b6d4", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16 }}>Simple as 1-2-3</p>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, color: "white", lineHeight: 1.1 }}>
            From upload to<br />the whole community
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, position: "relative" }}>
          {[
            { n: "01", icon: Upload, title: "Upload anything", desc: "Drop a PDF, Word doc, PowerPoint, image, or paste a URL. We handle every format students use.", grad: ["#6366f1", "#8b5cf6"] },
            { n: "02", icon: Brain, title: "AI processes in 10s", desc: "AI reads the content, writes a summary, extracts key concepts, generates tags automatically.", grad: ["#8b5cf6", "#a855f7"] },
            { n: "03", icon: Users, title: "Community learns", desc: "Your note is instantly visible to thousands of students. They can read, chat with AI about it, or download.", grad: ["#06b6d4", "#3b82f6"] },
          ].map(({ n, icon: Icon, title, desc, grad }, i) => (
            <motion.div key={n} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{ borderRadius: 24, padding: 32, position: "relative", overflow: "hidden",
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ position: "absolute", top: 20, right: 20, fontSize: 80, fontWeight: 900, color: "rgba(255,255,255,0.03)", lineHeight: 1, userSelect: "none" }}>{n}</div>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: `0 0 20px ${grad[0]}40` }}>
                <Icon style={{ width: 26, height: 26, color: "white" }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 12 }}>{title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ padding: "40px 24px 120px", maxWidth: 900, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ borderRadius: 28, overflow: "hidden", position: "relative", border: "1px solid rgba(99,102,241,0.2)" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(9,9,31,0.95), rgba(139,92,246,0.12))" }} />
          <motion.div animate={{ x: [0, 20, 0], y: [0, -15, 0] }} transition={{ duration: 12, repeat: Infinity }}
            style={{ position: "absolute", top: "-30%", left: "-10%", width: "60%", height: "160%", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.2), transparent)", filter: "blur(40px)" }} />

          <div style={{ position: "relative", zIndex: 1, padding: "60px 48px", textAlign: "center" }}>
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}
              style={{ fontSize: 56, marginBottom: 20, display: "inline-block" }}>🎓</motion.div>
            <h2 style={{ fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 900, color: "white", marginBottom: 16, lineHeight: 1.1 }}>
              Join 8,500+ students<br /><span style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>studying smarter together</span>
            </h2>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
              Upload your notes. Discover thousands of others. Let AI explain anything. Free — because knowledge belongs to everyone.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/signup">
                <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(99,102,241,0.5)" }} whileTap={{ scale: 0.97 }}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 40px", borderRadius: 16, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", boxShadow: "0 0 30px rgba(99,102,241,0.3)" }}>
                  Start for Free <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link href="/dashboard/notes">
                <motion.button whileHover={{ scale: 1.03 }} style={{ padding: "14px 40px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>
                  Browse Notes First
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "32px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles style={{ width: 14, height: 14, color: "white" }} />
            </div>
            <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>NoteForge AI</span>
          </Link>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.2)" }}>© {new Date().getFullYear()} NoteForge AI — Free for every student, forever.</p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Contact"].map(item => (
              <button key={item} style={{ background: "none", border: "none", fontSize: 13, color: "rgba(255,255,255,0.25)", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
