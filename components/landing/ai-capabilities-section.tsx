"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload your document",
    description:
      "Drag and drop any file — PDF, Word, PowerPoint, or even a URL. We handle all formats.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    number: "02",
    title: "AI processes & understands",
    description:
      "Our AI reads, understands context, and builds a knowledge graph from your content in seconds.",
    color: "from-violet-500 to-violet-600",
  },
  {
    number: "03",
    title: "Learn, quiz & chat",
    description:
      "Get instant summaries, auto-generated quizzes, and chat with your documents using natural language.",
    color: "from-cyan-500 to-cyan-600",
  },
];

export function AICapabilitiesSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent" />
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-6">
              <Sparkles className="h-3 w-3" />
              How it works
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Three steps to{" "}
              <span className="gradient-text">smarter learning</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Stop passively reading. NoteForge AI turns your documents into an
              active learning system that tests and teaches you.
            </p>

            <div className="space-y-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-xs font-bold shadow-lg`}
                  >
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-2xl border border-white/10 bg-card/80 backdrop-blur-xl p-6 shadow-2xl">
              {/* Chat simulation */}
              <div className="flex items-center gap-2 mb-5">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-muted-foreground font-mono">
                  AI Chat — Biology Lecture Notes.pdf
                </span>
              </div>

              <div className="space-y-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-indigo-600 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5">
                    What are the main differences between mitosis and meiosis?
                  </div>
                </div>

                {/* AI response */}
                <div className="flex gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="max-w-[85%] bg-muted text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 space-y-1.5">
                    <p className="font-medium text-foreground">
                      Based on your lecture notes:
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Mitosis</strong>{" "}
                      produces 2 identical diploid cells for growth and repair.
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Meiosis</strong>{" "}
                      produces 4 genetically unique haploid cells for sexual
                      reproduction.
                    </p>
                    <button className="flex items-center gap-1 text-xs text-indigo-400 mt-1 hover:text-indigo-300 transition-colors">
                      Generate a quiz on this
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex gap-2.5 items-center">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3 flex gap-1">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="mt-5 flex gap-2">
                <div className="flex-1 h-9 rounded-xl border border-border bg-background px-3 flex items-center">
                  <span className="text-xs text-muted-foreground">
                    Ask anything about your notes...
                  </span>
                </div>
                <button className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Floating stats */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-card border border-border rounded-xl px-4 py-2.5 shadow-xl"
            >
              <p className="text-xs text-muted-foreground">AI Accuracy</p>
              <p className="text-xl font-bold text-indigo-400">98.7%</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl px-4 py-2.5 shadow-xl"
            >
              <p className="text-xs text-muted-foreground">Avg. Summary Time</p>
              <p className="text-xl font-bold text-cyan-400">3.2s</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
