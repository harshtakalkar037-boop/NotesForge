"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.3),rgba(255,255,255,0))]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay:"1s"}} />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="indigo" className="mb-6 gap-1.5 px-4 py-1.5 text-xs">
            <Sparkles className="h-3 w-3" />
            AI-Powered Note Learning System
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
        >
          Turn Your Notes Into{" "}
          <span className="gradient-text">Superpowers</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Upload PDFs, docs, slides, and more. NoteForge AI summarizes,
          quizzes, and helps you truly understand your material — not just read it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/signup">
            <Button size="xl" className="group w-full sm:w-auto">
              Get Started Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="xl" variant="outline" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          {["No credit card required", "Free forever plan", "Open source"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-indigo-400" />
              {item}
            </span>
          ))}
        </motion.div>

        {/* Hero mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 relative mx-auto max-w-4xl"
        >
          <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-amber-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-4 text-xs text-muted-foreground font-mono">noteforge.ai/dashboard</span>
            </div>
            <div className="p-8 grid grid-cols-3 gap-4">
              {[
                { label: "Notes Processed", value: "1,248", colorClass: "text-indigo-400" },
                { label: "AI Summaries", value: "342", colorClass: "text-violet-400" },
                { label: "Quiz Score Avg", value: "94%", colorClass: "text-cyan-400" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.colorClass}`}>{stat.value}</p>
                </div>
              ))}
              <div className="col-span-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-muted-foreground">AI Processing your latest upload...</span>
                </div>
                <div className="space-y-2">
                  {[80, 60, 90, 40].map((w, i) => (
                    <div key={i} className="h-2 rounded-full bg-white/10" style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 bg-indigo-500/5 rounded-3xl blur-2xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
