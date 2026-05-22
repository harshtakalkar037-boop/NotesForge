"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Sparkles, BookOpen, Users, Brain, ArrowRight,
  FileText, Upload, MessageSquare, Star, Zap,
  GraduationCap, ChevronDown, Menu, X, Play
} from "lucide-react";

// ── Typewriter ────────────────────────────────────────────────────
function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    if (!deleting && displayed.length < word.length) {
      const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 90);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === word.length) {
      const t = setTimeout(() => setDeleting(true), 2200);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    }
  }, [displayed, deleting, index, words]);

  return (
    <span>
      <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
        {displayed}
      </span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="text-indigo-400"
      >|</motion.span>
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
const SAMPLE_NOTES = [
  { subject: "Physics", title: "Quantum Mechanics Ch.4", summary: "Wave-particle duality, Schrödinger equation, and quantum superposition with real examples.", tags: ["quantum", "physics", "exam"], likes: 342, user: "Priya M." },
  { subject: "Chemistry", title: "Organic Reactions Summary", summary: "Complete reference for SN1, SN2, elimination reactions and their mechanisms.", tags: ["organic", "reactions"], likes: 218, user: "Rahul K." },
  { subject: "Maths", title: "Calculus Integration Tricks", summary: "All techniques: by parts, substitution, partial fractions with solved examples.", tags: ["calculus", "integration"], likes: 567, user: "Ananya S." },
  { subject: "Biology", title: "Cell Division — Mitosis & Meiosis", summary: "Step-by-step diagrams and differences with memory tricks for exams.", tags: ["biology", "cells"], likes: 189, user: "Dev P." },
  { subject: "History", title: "World War II Timeline", summary: "Key events, dates, and turning points of WWII organized chronologically.", tags: ["history", "wwii"], likes: 294, user: "Sara L." },
  { subject: "Computer Sc.", title: "Data Structures Cheat Sheet", summary: "Arrays, linked lists, trees, graphs — operations and time complexities.", tags: ["cs", "dsa"], likes: 731, user: "Arjun V." },
];

const SUBJECT_COLORS: Record<string, string> = {
  Physics: "from-blue-500 to-cyan-500",
  Chemistry: "from-emerald-500 to-green-500",
  Maths: "from-violet-500 to-purple-500",
  Biology: "from-orange-500 to-amber-500",
  History: "from-rose-500 to-pink-500",
  "Computer Sc.": "from-indigo-500 to-blue-500",
};

// ── Main ──────────────────────────────────────────────────────────
export function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="bg-[#050508] text-white overflow-x-hidden">

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/60 backdrop-blur-2xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <Sparkles className="h-4.5 w-4.5 text-white h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">NoteForge AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white/50">
            {["Features", "How it Works", "Community", "About"].map((item) => (
              <button key={item} className="hover:text-white transition-colors duration-200">{item}</button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <button className="text-sm text-white/60 hover:text-white px-5 py-2.5 rounded-xl transition-all hover:bg-white/5">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="text-sm font-semibold px-6 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 transition-all shadow-xl"
              >
                Get Started Free
              </motion.button>
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-black/90 backdrop-blur-2xl px-6 py-5 space-y-4"
            >
              {["Features", "How it Works", "Community", "About"].map((item) => (
                <button key={item} className="block text-sm text-white/60 hover:text-white w-full text-left">{item}</button>
              ))}
              <div className="flex gap-3 pt-2">
                <Link href="/login" className="flex-1">
                  <button className="w-full text-sm py-2.5 rounded-xl border border-white/10">Sign In</button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <button className="w-full text-sm py-2.5 rounded-xl bg-white text-black font-semibold">Get Started</button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ══════════════════ HERO — CINEMATIC VIDEO BG ══════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Background Video */}
        <motion.div style={{ scale: videoScale }} className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Cinematic overlays */}
        {/* Top vignette */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/20 to-black/80" />
        {/* Left/right edge darkening */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-64 z-[2] bg-gradient-to-t from-[#050508] to-transparent" />
        {/* Subtle color grade — indigo tint */}
        <div className="absolute inset-0 z-[1] bg-indigo-950/20 mix-blend-multiply" />

        {/* Cinematic letterbox bars */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-black z-[3]" />
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-black z-[3]" />

        {/* Hero content */}
        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-white/70 text-xs font-medium tracking-widest uppercase mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-indigo-400"
            />
            The Student Knowledge Platform — 100% Free
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.02] mb-6"
          >
            <span className="text-white drop-shadow-2xl">Share notes.</span>
            <br />
            <span className="text-white drop-shadow-2xl">Ace your </span>
            <Typewriter words={["exams.", "subjects.", "future.", "degree."]} />
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            Upload your study notes. AI summarizes them instantly.
            Every student gets access — no limits, no paywalls, forever free.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.96 }}
                className="group px-9 py-4 rounded-2xl bg-white text-black font-bold text-base shadow-2xl flex items-center gap-2.5 transition-all"
              >
                Start Sharing Notes
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
            <Link href="/dashboard/notes">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group px-9 py-4 rounded-2xl border border-white/20 text-white font-medium text-base backdrop-blur-sm hover:bg-white/8 transition-all flex items-center gap-2.5"
              >
                <Play className="h-4 w-4 fill-current" />
                Browse Notes
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="flex flex-wrap justify-center gap-10 mt-20"
          >
            {[
              { value: 12400, suffix: "+", label: "Notes Shared" },
              { value: 8500, suffix: "+", label: "Students" },
              { value: 50, suffix: "+", label: "Subjects Covered" },
              { value: 100, suffix: "%", label: "Free Forever" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-white tabular-nums">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-white/35 mt-1 tracking-wide">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/25"
        >
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </section>

      {/* ══════════════════ NOTES GRID ══════════════════ */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-indigo-950/10 to-[#050508] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.3em] mb-4">Community Notes</p>
            <h2 className="text-4xl sm:text-6xl font-black mb-5 leading-tight">
              Notes from{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                real students
              </span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Discover what your peers are sharing — every subject, every exam, every topic.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SAMPLE_NOTES.map((note, i) => (
              <motion.div
                key={note.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group cursor-pointer"
              >
                <div className="h-full rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 p-6 transition-all duration-300 backdrop-blur-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${SUBJECT_COLORS[note.subject]} text-white text-[11px] font-bold`}>
                      <GraduationCap className="h-3 w-3" />
                      {note.subject}
                    </div>
                    <div className="flex items-center gap-1 text-amber-400/80">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-xs font-medium">{note.likes}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-[15px] text-white mb-2.5 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                    {note.title}
                  </h3>
                  <p className="text-[13px] text-white/35 leading-relaxed line-clamp-3 mb-4">{note.summary}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {note.tags.map((t) => (
                      <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/35">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[12px] text-white/25">by {note.user}</span>
                    <span className="text-[11px] text-indigo-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      View note <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/dashboard/notes">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium"
              >
                Browse All Notes <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-xs font-bold text-violet-400 uppercase tracking-[0.3em] mb-4">Simple Process</p>
            <h2 className="text-4xl sm:text-6xl font-black mb-5">
              How it{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                works
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", icon: Upload, title: "Upload Your Notes", desc: "Drop any file — PDF, Word, PowerPoint, images. AI reads and processes your content in seconds.", grad: "from-indigo-600 to-blue-600", glow: "shadow-indigo-500/30" },
              { n: "02", icon: Brain, title: "AI Summarizes", desc: "Groq AI generates a clean summary, extracts key points, and auto-tags your notes instantly.", grad: "from-violet-600 to-purple-600", glow: "shadow-violet-500/30" },
              { n: "03", icon: Users, title: "Everyone Learns", desc: "Notes are shared with the whole student community. Search, read, and chat with any note using AI.", grad: "from-cyan-600 to-teal-600", glow: "shadow-cyan-500/30" },
            ].map(({ n, icon: Icon, title, desc, grad, glow }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="relative rounded-3xl border border-white/5 bg-white/[0.02] p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
              >
                <span className="absolute top-6 right-7 text-7xl font-black text-white/[0.03] select-none">{n}</span>
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center mb-6 shadow-2xl ${glow}`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURES ══════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-violet-950/5 to-[#050508] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-[0.3em] mb-4">Everything Included</p>
            <h2 className="text-4xl sm:text-6xl font-black">
              Built for{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                students
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Brain, title: "AI Summaries", desc: "Every note gets an instant AI-generated summary so you understand the key points fast.", color: "text-indigo-400", border: "border-indigo-500/15", bg: "bg-indigo-500/5" },
              { icon: MessageSquare, title: "Chat with Notes", desc: "Ask any question about any uploaded document. AI answers using the actual content.", color: "text-violet-400", border: "border-violet-500/15", bg: "bg-violet-500/5" },
              { icon: Users, title: "Open Community", desc: "All notes are visible to every student. No private walls — knowledge flows freely.", color: "text-cyan-400", border: "border-cyan-500/15", bg: "bg-cyan-500/5" },
              { icon: Zap, title: "Instant Processing", desc: "Upload to AI-processed in under 10 seconds. No queues, no waiting, no delays.", color: "text-amber-400", border: "border-amber-500/15", bg: "bg-amber-500/5" },
              { icon: FileText, title: "Any File Format", desc: "PDF, Word, PowerPoint, images, text — if students use it, we support it.", color: "text-green-400", border: "border-green-500/15", bg: "bg-green-500/5" },
              { icon: Star, title: "100% Free, Always", desc: "No plans, no subscriptions, no paywalls. Every feature free for every student forever.", color: "text-rose-400", border: "border-rose-500/15", bg: "bg-rose-500/5" },
            ].map(({ icon: Icon, title, desc, color, border, bg }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className={`rounded-2xl border ${border} ${bg} p-6 backdrop-blur-sm`}
              >
                <Icon className={`h-7 w-7 ${color} mb-4`} />
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 1 }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* CTA background video snippet */}
            <div className="absolute inset-0">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-25">
                <source src="https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-[#0a0a1a]/90 to-violet-950/90" />
            </div>

            {/* Border glow */}
            <div className="absolute inset-0 rounded-3xl border border-indigo-500/20" />
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-cyan-500/10 blur-2xl -z-10" />

            <div className="relative z-10 py-20 px-8 sm:px-16 text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <GraduationCap className="h-14 w-14 text-indigo-400 mx-auto" />
              </motion.div>

              <h2 className="text-4xl sm:text-6xl font-black text-white mb-5 leading-tight">
                Join students who
                <br />
                <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  study smarter together
                </span>
              </h2>
              <p className="text-white/40 text-lg mb-12 max-w-xl mx-auto">
                Upload your notes. Discover thousands of others. Let AI explain anything.
                All free — because knowledge belongs to everyone.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(255,255,255,0.15)" }}
                    whileTap={{ scale: 0.97 }}
                    className="group px-10 py-4 rounded-2xl bg-white text-black font-bold text-lg shadow-2xl flex items-center gap-2.5 mx-auto sm:mx-0 transition-all"
                  >
                    Start for Free
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </Link>
                <Link href="/dashboard/notes">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-10 py-4 rounded-2xl border border-white/15 text-white/70 font-medium text-base hover:bg-white/5 hover:border-white/25 transition-all"
                  >
                    Browse Notes First
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-white/70 hover:text-white transition-colors">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            NoteForge AI
          </Link>
          <p className="text-sm text-white/20">
            © {new Date().getFullYear()} NoteForge AI — Free for every student, forever.
          </p>
          <div className="flex gap-6 text-sm text-white/30">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <button key={item} className="hover:text-white/60 transition-colors">{item}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
// cache bust Fri May 22 02:19:06 UTC 2026
