"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function VerifyEmailContent() {
  const params = useSearchParams();
  const email = params.get("email") ?? "your email";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            NoteForge AI
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-10 shadow-xl text-center">
          <div className="h-20 w-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-10 w-10 text-indigo-400" />
          </div>

          <h1 className="text-2xl font-bold mb-3">Confirm your email</h1>
          <p className="text-muted-foreground text-sm mb-2">
            We sent a confirmation link to:
          </p>
          <p className="font-semibold text-indigo-400 mb-6 text-sm">{email}</p>

          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 mb-6 text-left space-y-2">
            <p className="text-sm font-medium">Next steps:</p>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-indigo-400 font-bold shrink-0">1.</span>
              <span>Open your email inbox</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-indigo-400 font-bold shrink-0">2.</span>
              <span>Click the confirmation link from NoteForge AI</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-indigo-400 font-bold shrink-0">3.</span>
              <span>You&apos;ll be taken directly to your dashboard</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            Didn&apos;t receive it? Check your spam folder or{" "}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">
              try signing up again
            </Link>
          </p>

          <Link href="/login">
            <Button variant="outline" className="w-full gap-2">
              Go to Sign In
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
