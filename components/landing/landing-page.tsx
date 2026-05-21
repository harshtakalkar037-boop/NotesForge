"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  Sparkles, BookOpen, Users, Brain, ArrowRight,
  FileText, Upload, MessageSquare, Star, Zap,
  GraduationCap, ChevronDown, Menu, X
} from "lucide-react";

// ── Floating particle background ─────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-indigo-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ── Typewriter effect ─────────────────────────────────────────────
function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    if (!deleting && displayed.length < word.length) {
      const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === word.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
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
    <span className="gradient-text">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// ── Floating card component ───────────────────────────────────────
function FloatingCard({ children, delay = 0, className = "" }: any) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Stats counter ─────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) setStarted(true);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let frame: number;
    const duration = 2000;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * to));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, to]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Note card preview ─────────────────────────────────────────────
const SAMPLE_NOTES = [
  { subject: "Physics", title: "Quantum Mechanics Ch.4", summary: "Wave-particle duality, Schrödinger equation, and quantum superposition explained with examples.", tags: ["quantum", "physics", "exam"], likes: 342, user: "Priya M." },
  { subject: "Chemistry", title: "Organic Reactions Summary", summary: "Complete reference for SN1, SN2, elimination reactions and their mechanisms.", tags: ["organic", "reactions", "chemistry"], likes: 218, user: "Rahul K." },
  { subject: "Maths", title: "Calculus Integration Tricks", summary: "All integration techniques: by parts, substitution, partial fractions with solved examples.", tags: ["calculus", "maths", "integration"], likes: 567, user: "Ananya S." },
  { subject: "Biology", title: "Cell Division - Mitosis & Meiosis", summary: "Step-by-step diagrams and differences between mitosis and meiosis with memory tricks.", tags: ["biology", "cells", "exam"], likes: 189, user: "Dev P." },
];

const SUBJECT_COLORS: Record<string, string> = {
  Physics: "from-blue-500 to-cyan-500",
  Chemistry: "from-green-500 to-emerald-500",
  Maths: "from-violet-500 to-purple-500",
  Biology: "from-orange-500 to-amber-500",
};

// ── Main Landing Page ─────────────────────────────────────────────
export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const springY = useSpring(heroY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030712] text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-[#030712]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              NoteForge
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            {["Features", "How it Works", "Community", "About"].map((item) => (
              <button key={item} className="hover:text-white transition-colors">{item}</button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <button className="text-sm text-white/70 hover:text-white px-4 py-2 transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <button className="text-sm px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-medium transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95">
                Get Started Free
              </button>
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-[#030712]/95 backdrop-blur-xl px-6 py-4 space-y-3"
            >
              {["Features", "How it Works", "Community", "About"].map((item) => (
                <button key={item} className="block text-sm text-white/70 hover:text-white w-full text-left py-1">
                  {item}
                </button>
              ))}
              <div className="flex gap-2 pt-2">
                <Link href="/login" className="flex-1">
                  <button className="w-full text-sm py-2 rounded-xl border border-white/10 hover:border-white/20">Sign In</button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <button className="w-full text-sm py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-medium">Get Started</button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[#030712]" />
          {/* Glowing orbs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 12, repeat: Infinity, delay: 2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-600/10 rounded-full blur-[150px]"
          />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </motion.div>

        <Particles />

        <motion.div style={{ y: springY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-sm"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="h-3.5 w-3.5" />
            </motion.div>
            The Student Notes Sharing Platform — 100% Free
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.05]"
          >
            <span className="text-white">Share Notes.</span>
            <br />
            <span className="text-white">Ace</span>{" "}
            <Typewriter words={["Exams.", "Subjects.", "Your Future.", "Studies."]} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload your notes. AI summarizes them instantly. Every student gets access.
            No paywalls. No limits. Just knowledge — shared.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-size-200 text-white font-semibold text-base shadow-2xl shadow-indigo-500/30 flex items-center gap-2 transition-all"
              >
                Start Sharing Notes
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
            <Link href="/dashboard/notes">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-2xl border border-white/10 text-white/80 font-medium text-base backdrop-blur-sm hover:bg-white/5 hover:border-white/20 transition-all flex items-center gap-2"
              >
                <BookOpen className="h-5 w-5" />
                Browse Notes
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 text-center mb-20"
          >
            {[
              { value: 12400, suffix: "+", label: "Notes Shared" },
              { value: 8500, suffix: "+", label: "Students" },
              { value: 50, suffix: "+", label: "Subjects" },
              { value: 100, suffix: "%", label: "Free Forever" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-2xl font-black text-white">
                  <Counter to={s.value} suffix={s.suffix} />
                </span>
                <span className="text-xs text-white/40 mt-0.5">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Floating note cards preview */}
          <div className="relative h-96 hidden md:block">
            {[
              { card: SAMPLE_NOTES[0], x: "5%", rotate: -6, delay: 0 },
              { card: SAMPLE_NOTES[1], x: "28%", rotate: 2, delay: 0.5 },
              { card: SAMPLE_NOTES[2], x: "54%", rotate: -3, delay: 1 },
              { card: SAMPLE_NOTES[3], x: "76%", rotate: 5, delay: 1.5 },
            ].map(({ card, x, rotate, delay }) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + delay }}
                style={{ left: x, rotate }}
                className="absolute w-52"
              >
                <FloatingCard delay={delay}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-2xl hover:border-white/20 transition-colors cursor-pointer">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${SUBJECT_COLORS[card.subject]} text-white text-[10px] font-bold mb-3`}>
                      <GraduationCap className="h-3 w-3" />
                      {card.subject}
                    </div>
                    <p className="text-xs font-semibold text-white mb-1.5 line-clamp-2">{card.title}</p>
                    <p className="text-[10px] text-white/50 line-clamp-2 mb-3">{card.summary}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/40">{card.user}</span>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-[10px]">{card.likes}</span>
                      </div>
                    </div>
                  </div>
                </FloatingCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-indigo-950/20 to-[#030712] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Simple as 1-2-3</span>
            <h2 className="text-4xl md:text-6xl font-black mt-3 mb-5">
              How <span className="gradient-text">NoteForge</span> works
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Upload once. AI processes it. Every student benefits forever.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            {[
              { step: "01", icon: Upload, title: "Upload Your Notes", desc: "PDF, DOCX, images — anything. Drag and drop and you're done. Our AI instantly reads and understands your content.", color: "from-indigo-600 to-blue-600" },
              { step: "02", icon: Brain, title: "AI Summarizes", desc: "Gemini AI generates a clean summary, extracts key concepts, and tags your notes automatically in seconds.", color: "from-violet-600 to-purple-600" },
              { step: "03", icon: Users, title: "Everyone Benefits", desc: "Your notes are shared with the entire student community. Find notes from others, chat with AI about any topic.", color: "from-cyan-600 to-teal-600" },
            ].map(({ step, icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative group"
              >
                <div className="rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] p-8 transition-all duration-300 hover:border-white/10 hover:-translate-y-2">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-2xl group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-6xl font-black text-white/5 absolute top-6 right-8">{step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Notes Grid ── */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Community Notes</span>
            <h2 className="text-4xl md:text-6xl font-black mt-3 mb-5">
              Notes from <span className="gradient-text">real students</span>
            </h2>
            <p className="text-white/50 text-lg">Discover notes shared by your peers across every subject</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SAMPLE_NOTES.map((note, i) => (
              <motion.div
                key={note.title}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group cursor-pointer"
              >
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/10 p-5 h-full transition-all duration-300">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${SUBJECT_COLORS[note.subject]} text-white text-xs font-bold mb-4`}>
                    <GraduationCap className="h-3 w-3" />
                    {note.subject}
                  </div>
                  <h3 className="font-bold text-sm text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                    {note.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed line-clamp-3 mb-4">{note.summary}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {note.tags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">#{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-[11px] text-white/30">{note.user}</span>
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-xs font-medium">{note.likes}</span>
                    </div>
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium flex items-center gap-2 mx-auto"
              >
                Browse All Notes
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-violet-950/10 to-[#030712] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Everything You Need</span>
            <h2 className="text-4xl md:text-6xl font-black mt-3 mb-5">
              Built for <span className="gradient-text">students</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Brain, title: "AI Summaries", desc: "Every uploaded note gets an instant AI summary. Understand content without reading everything.", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
              { icon: MessageSquare, title: "Chat with Notes", desc: "Ask any question about uploaded notes. AI answers using the actual content from the documents.", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
              { icon: Users, title: "Community Sharing", desc: "All notes are shared with everyone. Find notes for any subject, topic, or exam instantly.", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
              { icon: Zap, title: "Instant Processing", desc: "Upload and get AI-processed results in under 10 seconds. No waiting, no queues.", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
              { icon: FileText, title: "Any Format", desc: "PDF, Word, PowerPoint, images, plain text — we handle every file format students use.", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
              { icon: Star, title: "100% Free Forever", desc: "No subscriptions. No paywalls. No upload limits. Knowledge should be free for every student.", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
            ].map(({ icon: Icon, title, desc, color, bg }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`rounded-2xl border p-6 ${bg} backdrop-blur-sm transition-all hover:scale-[1.02]`}
              >
                <div className={`${color} mb-4`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-600 opacity-80" />
            <div className="absolute inset-[1px] rounded-3xl bg-[#080820]" />
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-violet-600/20" />
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative z-10 py-20 px-8 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6"
              >
                <GraduationCap className="h-12 w-12 text-indigo-400" />
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight">
                Join thousands of
                <br />
                <span className="gradient-text">students crushing it</span>
              </h2>
              <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                Stop studying alone. Share your notes, discover others&apos;, and let AI help you understand everything — completely free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(99,102,241,0.6)" }}
                    whileTap={{ scale: 0.97 }}
                    className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg shadow-2xl shadow-indigo-500/30 flex items-center gap-2 mx-auto sm:mx-0"
                  >
                    Start for Free
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </Link>
                <Link href="/dashboard/notes">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-10 py-4 rounded-2xl border border-white/20 text-white/80 font-medium text-base hover:bg-white/5 transition-all"
                  >
                    Browse Notes First
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-white/80">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            NoteForge AI
          </Link>
          <p className="text-sm text-white/30">
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
