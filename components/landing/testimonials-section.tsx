"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Medical Student",
    initials: "SC",
    content:
      "NoteForge AI helped me prepare for my boards in half the time. The AI summaries of complex textbooks are incredibly accurate.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "PhD Researcher",
    initials: "MJ",
    content:
      "I upload 20+ papers a week. Being able to chat with my documents and find connections between papers has been game-changing.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Software Engineer",
    initials: "PP",
    content:
      "The quizzes generated from my notes actually helped me retain information. Best study tool I've used in years.",
    rating: 5,
  },
  {
    name: "Alex Rivera",
    role: "Law Student",
    initials: "AR",
    content:
      "Case briefings that used to take hours now take minutes. NoteForge understands legal documents remarkably well.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Product Manager",
    initials: "EW",
    content:
      "I use it for meeting notes and PRDs. The search across all documents is incredibly fast and finds exactly what I need.",
    rating: 5,
  },
  {
    name: "Daniel Kim",
    role: "Undergraduate Student",
    initials: "DK",
    content:
      "Finally an AI tool that actually helps me understand material instead of just giving me answers. My GPA has never been better.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-4">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            Loved by <span className="gradient-text">learners worldwide</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of students and professionals already using NoteForge
            AI.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-card p-6 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs">{t.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
