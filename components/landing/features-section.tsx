"use client";

import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  MessageSquare,
  Search,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Summaries",
    description:
      "Get intelligent, concise summaries of any document in seconds. Understand the key points without reading everything.",
    color: "indigo",
  },
  {
    icon: MessageSquare,
    title: "Chat with Notes",
    description:
      "Ask questions about your uploaded documents and get instant, context-aware answers powered by AI.",
    color: "violet",
  },
  {
    icon: FileText,
    title: "Multi-Format Support",
    description:
      "Upload PDFs, Word docs, PowerPoints, text files, images, and links. We handle everything.",
    color: "cyan",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Search across all your notes with semantic understanding. Find what you mean, not just what you type.",
    color: "indigo",
  },
  {
    icon: Zap,
    title: "Instant Quizzes",
    description:
      "Auto-generate quizzes from your notes to test your knowledge and reinforce learning.",
    color: "violet",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your notes are encrypted and private by default. You control what you share.",
    color: "cyan",
  },
];

const colorMap = {
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    icon: "text-indigo-400",
    glow: "group-hover:shadow-indigo-500/10",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    icon: "text-violet-400",
    glow: "group-hover:shadow-violet-500/10",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    icon: "text-cyan-400",
    glow: "group-hover:shadow-cyan-500/10",
  },
};

export function FeaturesSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Features
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            Everything you need to{" "}
            <span className="gradient-text">learn smarter</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Powerful tools built for students, researchers, and lifelong
            learners.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const colors = colorMap[feature.color as keyof typeof colorMap];
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`group relative rounded-2xl border ${colors.border} bg-card p-6 hover:shadow-xl ${colors.glow} transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} mb-4`}
                >
                  <Icon className={`h-6 w-6 ${colors.icon}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
