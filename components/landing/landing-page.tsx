"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  Sparkles, BookOpen, Brain, ArrowRight,
  FileText, Upload, MessageSquare, Star, Zap,
  GraduationCap, ChevronDown, Menu, X, Users, Play
} from "lucide-react";

// ── Mouse-tracking spotlight ──────────────────────────────────────
function MouseSpotlight() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 30 });
  const springY = useSpring(y, { stiffness: 80, damping: 30 });

  useEffect(() => {
    const fn = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [x, y]);

  return (
    <motion.div
      style={{
        left: springX,
        top: springY,
        translateX: "-50%",
        translateY: "-50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        position: "fixed",
        width: "600px",
        height: "600px",
        borderRadius: "9999px",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

// ── Animated grid background ──────────────────────────────────────
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base dark */}
      <div className="absolute inset-0 bg-[#030712]" />

      {/* Animated gradient orbs */}
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, -60, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(79,70,229,0.25) 0%, transparent 65%)", filter: "blur(60px)" }}
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, 80, 0], scale: [1.2, 1, 1.2] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 65%)", filter: "blur(80px)" }}
      />
      <motion.div
        animate={{ x: [0, 40, -40, 0], y: [0, 50, -30, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className="absolute top-[30%] right-[20%] w-[40vw] h-[40vw] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%)", filter: "blur(60px)" }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Radial fade on grid edges */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, #030712 100%)" }} />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
    </div>
  );
}

// ── Floating particles ────────────────────────────────────────────
function Particles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 8,
        color: i % 3 === 0 ? "rgba(99,102,241,0.6)" : i % 3 === 1 ? "rgba(139,92,246,0.5)" : "rgba(6,182,212,0.4)",
      })).map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color }}
          animate={{ y: [0, -120, 0], x: [0, Math.sin(p.id) * 30, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Typewriter ────────────────────────────────────────────────────
function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[index];
    if (!deleting && displayed.length < word.length) {
      const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 85);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === word.length) {
      const t = setTimeout(() => setDeleting(true), 2400);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    }
  }, [displayed, deleting, index, words]);
  return (
    <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
      {displayed}
      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="text-violet-400">|</motion.span>
    </span>
  );
}

// ── Counter ───────────────────────────────────────────────────────
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

// ── Sample notes ─────────────────────────────────────────────────
const NOTES = [
  { subject: "Physics", title: "Quantum Mechanics Ch.4", summary: "Wave-particle duality, Schrödinger equation, and superposition with real exam examples.", tags: ["quantum", "physics"], likes: 342, user: "Priya M." },
  { subject: "Chemistry", title: "Organic Reactions Summary", summary: "Complete reference for SN1, SN2, elimination reactions and their mechanisms.", tags: ["organic", "reactions"], likes: 218, user: "Rahul K." },
  { subject: "Maths", title: "Calculus Integration Tricks", summary: "By parts, substitution, partial fractions — all techniques with solved examples.", tags: ["calculus", "maths"], likes: 567, user: "Ananya S." },
  { subject: "Biology", title: "Cell Division — Mitosis & Meiosis", summary: "Step-by-step diagrams and differences with memory tricks for exams.", tags: ["biology", "cells"], likes: 189, user: "Dev P." },
  { subject: "History", title: "World War II Timeline", summary: "Key events, dates, and turning points organized chronologically.", tags: ["history", "wwii"], likes: 294, user: "Sara L." },
  { subject: "CS", title: "Data Structures Cheat Sheet", summary: "Arrays, linked lists, trees, graphs — operations and time complexities.", tags: ["dsa", "cs"], likes: 731, user: "Arjun V." },
];

const SUBJECT_GRAD: Record<string, string> = {
  Physics: "from-blue-500 to-cyan-500",
  Chemistry: "from-emerald-500 to-green-500",
  Maths: "from-violet-500 to-purple-500",
  Biology: "from-orange-500 to-amber-500",
  History: "from-rose-500 to-pink-500",
  CS: "from-indigo-500 to-blue-600",
};

// ── Note card ─────────────────────────────────────────────────────
function NoteCard({ note, i }: { note: typeof NOTES[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group cursor-pointer"
    >
      <div className="h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] p-6 transition-all duration-300 relative overflow-hidden">
        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />

        <div className="flex items-start justify-between mb-4 relative">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${SUBJECT_GRAD[note.subject]} text-white text-[11px] font-bold`}>
            <GraduationCap className="h-3 w-3" />
            {note.subject}
          </span>
          <div className="flex items-center gap-1 text-amber-400/80">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-medium">{note.likes}</span>
          </div>
        </div>

        <h3 className="font-bold text-[15px] text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
          {note.title}
        </h3>
        <p className="text-[13px] text-white/35 leading-relaxed line-clamp-3 mb-4">{note.summary}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {note.tags.map((t) => (
            <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-full border border-white/8 bg-white/3 text-white/30">#{t}</span>
          ))}
        </div>

        <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
          <span className="text-[12px] text-white/25">by {note.user}</span>
          <span className="text-[11px] text-indigo-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            View note <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="bg-[#030712] text-white overflow-x-hidden selection:bg-indigo-500/30">
      <MouseSpotlight />

      {/* ══ NAVBAR ══ */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#030712]/80 backdrop-blur-2xl border-b border-white/[0.06]" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}
              className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-4.5 w-4.5 text-white h-5 w-5" />
            </motion.div>
            <span className="font-bold text-lg tracking-tight text-white">NoteForge <span className="text-indigo-400">AI</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/40">
            {["Features", "How it Works", "Community", "About"].map((item) => (
              <motion.button key={item} whileHover={{ color: "#ffffff" }} className="transition-colors">{item}</motion.button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <button className="text-sm text-white/50 hover:text-white px-5 py-2 rounded-xl transition-colors hover:bg-white/5">Sign In</button>
            </Link>
            <Link href="/signup">
              <motion.button whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(99,102,241,0.4)" }} whileTap={{ scale: 0.97 }}
                className="text-sm font-semibold px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 transition-all">
                Get Started Free
              </motion.button>
            </Link>
          </div>

          <button className="md:hidden p-2 text-white/70" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-[#030712]/95 backdrop-blur-2xl px-6 py-5 space-y-3">
              {["Features", "How it Works", "Community", "About"].map((i) => (
                <button key={i} className="block text-sm text-white/50 w-full text-left hover:text-white">{i}</button>
              ))}
              <div className="flex gap-3 pt-2">
                <Link href="/login" className="flex-1"><button className="w-full py-2.5 text-sm rounded-xl border border-white/10">Sign In</button></Link>
                <Link href="/signup" className="flex-1"><button className="w-full py-2.5 text-sm rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold">Get Started</button></Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ══ HERO ══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatedGrid />
        <Particles />

        {/* Cinematic top/bottom bars */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030712] to-transparent z-10" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24 pb-16">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-sm text-indigo-300/80 text-xs font-medium tracking-widest uppercase mb-8">
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            The Student Knowledge Platform — 100% Free
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-7xl lg:text-[90px] font-black tracking-tight leading-[1.0] mb-7">
            <span className="text-white">Share notes.</span>
            <br />
            <span className="text-white">Ace your </span>
            <Typewriter words={["exams.", "subjects.", "future.", "degree."]} />
          </motion.h1>

          {/* Sub */}
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl text-white/40 max-w-xl mx-auto mb-12 leading-relaxed font-light">
            Upload your study notes. AI summarizes them instantly. Every student gets access — no limits, no paywalls, forever free.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/signup">
              <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(99,102,241,0.45)" }} whileTap={{ scale: 0.96 }}
                className="group px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_100%] text-white font-bold text-base shadow-2xl shadow-indigo-500/30 flex items-center gap-2.5 transition-all hover:bg-right">
                Start Sharing Notes
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
            <Link href="/dashboard/notes">
              <motion.button whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.05)" }} whileTap={{ scale: 0.97 }}
                className="group px-10 py-4 rounded-2xl border border-white/10 text-white/60 font-medium text-base backdrop-blur-sm transition-all flex items-center gap-2.5 hover:text-white hover:border-white/20">
                <Play className="h-4 w-4 fill-current" />
                Browse Notes
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.9 }}
            className="flex flex-wrap justify-center gap-12">
            {[
              { value: 12400, suffix: "+", label: "Notes Shared" },
              { value: 8500, suffix: "+", label: "Students" },
              { value: 50, suffix: "+", label: "Subjects" },
              { value: 100, suffix: "%", label: "Free Forever" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-white tabular-nums"><Counter to={s.value} suffix={s.suffix} /></div>
                <div className="text-xs text-white/30 mt-1 tracking-wide">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/20">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </section>

      {/* ══ NOTES GRID ══ */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-indigo-950/10 to-[#030712] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.3em] mb-4">Community Notes</p>
            <h2 className="text-4xl sm:text-6xl font-black mb-5 leading-tight">
              Notes from <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">real students</span>
            </h2>
            <p className="text-white/35 text-lg max-w-lg mx-auto">Discover what peers are sharing — every subject, every exam, every topic.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {NOTES.map((note, i) => <NoteCard key={note.title} note={note} i={i} />)}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
            <Link href="/dashboard/notes">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium">
                Browse All Notes <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <p className="text-xs font-bold text-violet-400 uppercase tracking-[0.3em] mb-4">Simple Process</p>
            <h2 className="text-4xl sm:text-6xl font-black">
              How it <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", icon: Upload, title: "Upload Your Notes", desc: "Drop any file — PDF, Word, PowerPoint, images. AI reads and processes in seconds.", grad: "from-indigo-600 to-blue-600", shadow: "shadow-indigo-500/20" },
              { n: "02", icon: Brain, title: "AI Summarizes", desc: "Groq AI generates a clean summary, extracts key concepts, and auto-tags your notes.", grad: "from-violet-600 to-purple-600", shadow: "shadow-violet-500/20" },
              { n: "03", icon: Users, title: "Everyone Learns", desc: "Notes are shared with the whole student community. Chat with any note using AI.", grad: "from-cyan-600 to-teal-600", shadow: "shadow-cyan-500/20" },
            ].map(({ n, icon: Icon, title, desc, grad, shadow }, i) => (
              <motion.div key={n} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="relative rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300">
                <span className="absolute top-6 right-7 text-8xl font-black text-white/[0.025] select-none">{n}</span>
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center mb-6 shadow-2xl ${shadow}`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />
        <div className="max-w-7xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-[0.3em] mb-4">Everything Included</p>
            <h2 className="text-4xl sm:text-6xl font-black">
              Built for <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">students</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Brain, title: "AI Summaries", desc: "Every uploaded note gets an instant AI-generated summary. Understand key points instantly.", c: "text-indigo-400", b: "border-indigo-500/15 bg-indigo-500/[0.04]" },
              { icon: MessageSquare, title: "Chat with Notes", desc: "Ask any question about any document. AI answers using the actual uploaded content.", c: "text-violet-400", b: "border-violet-500/15 bg-violet-500/[0.04]" },
              { icon: Users, title: "Open Community", desc: "All notes are visible to every student. No private walls — knowledge flows freely.", c: "text-cyan-400", b: "border-cyan-500/15 bg-cyan-500/[0.04]" },
              { icon: Zap, title: "Instant Processing", desc: "Upload to AI-processed in under 10 seconds. No queues, no waiting, no delays.", c: "text-amber-400", b: "border-amber-500/15 bg-amber-500/[0.04]" },
              { icon: FileText, title: "Any File Format", desc: "PDF, Word, PowerPoint, images, text — if students use it, we support it.", c: "text-green-400", b: "border-green-500/15 bg-green-500/[0.04]" },
              { icon: Star, title: "100% Free, Always", desc: "No plans, no subscriptions, no paywalls. Every feature free for every student forever.", c: "text-rose-400", b: "border-rose-500/15 bg-rose-500/[0.04]" },
            ].map(({ icon: Icon, title, desc, c, b }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className={`rounded-2xl border ${b} p-6 backdrop-blur-sm`}>
                <Icon className={`h-7 w-7 ${c} mb-4`} />
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-[13px] text-white/35 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.9 }}
            className="relative rounded-3xl overflow-hidden border border-white/[0.06]">

            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-[#09091f]/80 to-violet-950/80" />
            <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity }}
              className="absolute top-0 left-0 w-full h-full opacity-60"
              style={{ background: "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(99,102,241,0.3) 0%, transparent 60%)" }} />
            <motion.div animate={{ x: [0, -20, 0], y: [0, 30, 0] }} transition={{ duration: 15, repeat: Infinity, delay: 3 }}
              className="absolute top-0 left-0 w-full h-full opacity-50"
              style={{ background: "radial-gradient(ellipse 50% 60% at 70% 60%, rgba(139,92,246,0.25) 0%, transparent 60%)" }} />
            <div className="absolute inset-0 border border-white/5 rounded-3xl" />

            <div className="relative z-10 py-20 px-8 sm:px-16 text-center">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="inline-block mb-6">
                <GraduationCap className="h-14 w-14 text-indigo-400 mx-auto" />
              </motion.div>
              <h2 className="text-4xl sm:text-6xl font-black text-white mb-5 leading-tight">
                Join students who<br />
                <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  study smarter together
                </span>
              </h2>
              <p className="text-white/35 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
                Upload your notes. Discover thousands of others. Let AI explain anything. All free — because knowledge belongs to everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(99,102,241,0.5)" }} whileTap={{ scale: 0.97 }}
                    className="group px-12 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg shadow-2xl shadow-indigo-500/30 flex items-center gap-3 mx-auto sm:mx-0 transition-all">
                    Start for Free
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </Link>
                <Link href="/dashboard/notes">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="px-12 py-4 rounded-2xl border border-white/15 text-white/60 font-medium text-base hover:bg-white/5 hover:border-white/25 hover:text-white transition-all">
                    Browse Notes First
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-white/[0.05] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-2.5 text-white/50 hover:text-white transition-colors">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">NoteForge AI</span>
          </Link>
          <p className="text-sm text-white/20">© {new Date().getFullYear()} NoteForge AI — Free for every student, forever.</p>
          <div className="flex gap-6 text-sm text-white/25">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <button key={item} className="hover:text-white/50 transition-colors">{item}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
