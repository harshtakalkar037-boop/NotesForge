"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, ChevronRight, Trophy, RotateCcw, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { createClient } from "@/supabase/client";

interface Question {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface QuizState {
  questions: Question[];
  current: number;
  selected: number | null;
  score: number;
  finished: boolean;
  answers: (number | null)[];
}

export default function QuizPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [notesLoaded, setNotesLoaded] = useState(false);

  async function loadNotes() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await (supabase as any)
      .from("notes")
      .select("id, title, content, summary")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setNotes(data ?? []);
    setNotesLoaded(true);
  }

  async function generateQuiz() {
    if (!selectedNote) return;
    setLoading(true);

    const text = selectedNote.content?.slice(0, 4000) || selectedNote.summary || selectedNote.title;

    const prompt = `Generate exactly 5 multiple choice questions from this study note. Return ONLY valid JSON, no markdown.

Note title: "${selectedNote.title}"
Content: ${text}

Return this exact JSON structure:
{
  "questions": [
    {
      "q": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0,
      "explanation": "Brief explanation why this is correct"
    }
  ]
}

Make questions challenging but fair. answer is the index (0-3) of the correct option.`;

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "";
      // Use server action instead
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, noteTitle: selectedNote.title, noteContent: text }),
      });

      const data = await res.json();

      if (data.questions && Array.isArray(data.questions)) {
        setQuiz({
          questions: data.questions,
          current: 0,
          selected: null,
          score: 0,
          finished: false,
          answers: new Array(data.questions.length).fill(null),
        });
      } else {
        alert("Could not generate quiz. Make sure AI is configured.");
      }
    } catch (e) {
      alert("Failed to generate quiz. Please try again.");
    }
    setLoading(false);
  }

  function selectAnswer(optionIndex: number) {
    if (!quiz || quiz.selected !== null) return;
    const newAnswers = [...quiz.answers];
    newAnswers[quiz.current] = optionIndex;
    const isCorrect = optionIndex === quiz.questions[quiz.current].answer;
    setQuiz({
      ...quiz,
      selected: optionIndex,
      score: isCorrect ? quiz.score + 1 : quiz.score,
      answers: newAnswers,
    });
  }

  function nextQuestion() {
    if (!quiz) return;
    if (quiz.current + 1 >= quiz.questions.length) {
      setQuiz({ ...quiz, finished: true });
    } else {
      setQuiz({ ...quiz, current: quiz.current + 1, selected: null });
    }
  }

  function resetQuiz() {
    setQuiz(null);
    setSelectedNote(null);
  }

  const scorePercent = quiz ? Math.round((quiz.score / quiz.questions.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">⚡</span>
          Quiz Mode
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
          AI generates quiz questions from your notes instantly
        </p>
      </div>

      {/* Quiz finished */}
      {quiz?.finished && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="absolute top-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, ${scorePercent >= 80 ? "#22c55e" : scorePercent >= 60 ? "#f59e0b" : "#ef4444"}, ${scorePercent >= 80 ? "#10b981" : scorePercent >= 60 ? "#f97316" : "#dc2626"})` }} />

          <motion.div animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}
            className="text-6xl mb-4">
            {scorePercent >= 80 ? "🏆" : scorePercent >= 60 ? "⭐" : "📚"}
          </motion.div>

          <h2 className="text-3xl font-black text-white mb-2">{quiz.score}/{quiz.questions.length}</h2>
          <p className="text-xl font-bold mb-1" style={{ color: scorePercent >= 80 ? "#22c55e" : scorePercent >= 60 ? "#f59e0b" : "#ef4444" }}>
            {scorePercent >= 80 ? "Excellent! 🎉" : scorePercent >= 60 ? "Good Job! 👍" : "Keep Studying! 💪"}
          </p>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
            You scored {scorePercent}% on &ldquo;{selectedNote?.title}&rdquo;
          </p>

          {/* Score breakdown */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: "Correct", value: quiz.score, color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
              { label: "Wrong", value: quiz.questions.length - quiz.score, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
              { label: "Score", value: `${scorePercent}%`, color: "#818cf8", bg: "rgba(99,102,241,0.1)" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="rounded-xl p-3" style={{ background: bg }}>
                <p className="text-xl font-black" style={{ color }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
              </div>
            ))}
          </div>

          <button onClick={resetQuiz}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white mx-auto transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <RotateCcw className="h-4 w-4" /> Try Another Quiz
          </button>
        </motion.div>
      )}

      {/* Active quiz */}
      {quiz && !quiz.finished && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Progress */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Question {quiz.current + 1} of {quiz.questions.length}</span>
            <span className="text-sm font-bold" style={{ color: "#818cf8" }}>Score: {quiz.score}/{quiz.current + (quiz.selected !== null ? 1 : 0)}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6)" }}
              animate={{ width: `${((quiz.current) / quiz.questions.length) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div key={quiz.current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-start gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <p className="text-base font-semibold text-white leading-relaxed">{quiz.questions[quiz.current].q}</p>
              </div>

              <div className="space-y-2">
                {quiz.questions[quiz.current].options.map((option, idx) => {
                  const isSelected = quiz.selected === idx;
                  const isCorrect = idx === quiz.questions[quiz.current].answer;
                  const showResult = quiz.selected !== null;

                  let bg = "rgba(255,255,255,0.03)";
                  let border = "rgba(255,255,255,0.08)";
                  let color = "rgba(255,255,255,0.7)";

                  if (showResult) {
                    if (isCorrect) { bg = "rgba(34,197,94,0.1)"; border = "rgba(34,197,94,0.3)"; color = "#4ade80"; }
                    else if (isSelected) { bg = "rgba(239,68,68,0.1)"; border = "rgba(239,68,68,0.3)"; color = "#f87171"; }
                  } else if (isSelected) {
                    bg = "rgba(99,102,241,0.12)"; border = "rgba(99,102,241,0.4)"; color = "#818cf8";
                  }

                  return (
                    <motion.button key={idx} whileHover={!showResult ? { scale: 1.01 } : {}} whileTap={!showResult ? { scale: 0.99 } : {}}
                      onClick={() => selectAnswer(idx)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                      style={{ background: bg, border: `1px solid ${border}`, color, cursor: showResult ? "default" : "pointer" }}>
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: showResult && isCorrect ? "#22c55e" : showResult && isSelected ? "#ef4444" : "rgba(255,255,255,0.06)", color: "white" }}>
                        {showResult && isCorrect ? <CheckCircle className="h-4 w-4" /> : showResult && isSelected ? <XCircle className="h-4 w-4" /> : String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm font-medium">{option}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              {quiz.selected !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
                  <p className="text-xs font-bold mb-1" style={{ color: "#818cf8" }}>💡 Explanation</p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{quiz.questions[quiz.current].explanation}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {quiz.selected !== null && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={nextQuestion}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              {quiz.current + 1 === quiz.questions.length ? <><Trophy className="h-4 w-4" /> See Results</> : <><ChevronRight className="h-4 w-4" /> Next Question</>}
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Setup screen */}
      {!quiz && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4" style={{ color: "#818cf8" }} />
              Select a note to quiz yourself on
            </h2>

            {!notesLoaded ? (
              <button onClick={loadNotes}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                Load My Notes
              </button>
            ) : notes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white font-medium mb-2">No notes found</p>
                <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Upload some notes first to generate a quiz</p>
                <a href="/dashboard/upload" className="text-sm font-medium" style={{ color: "#818cf8" }}>→ Upload Notes</a>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notes.map((note: any) => (
                  <button key={note.id} onClick={() => setSelectedNote(note)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                    style={{
                      background: selectedNote?.id === note.id ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${selectedNote?.id === note.id ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.06)"}`,
                    }}>
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: selectedNote?.id === note.id ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(99,102,241,0.1)" }}>
                      <Brain className="h-4 w-4" style={{ color: selectedNote?.id === note.id ? "white" : "#818cf8" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{note.title}</p>
                      {note.summary && <p className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{note.summary}</p>}
                    </div>
                    {selectedNote?.id === note.id && <CheckCircle className="h-4 w-4 shrink-0" style={{ color: "#818cf8" }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedNote && (
            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              onClick={generateQuiz} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-base transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
              {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Generating Quiz with AI...</> : <><Sparkles className="h-5 w-5" /> Generate Quiz for &ldquo;{selectedNote.title.slice(0, 30)}...&rdquo;</>}
            </motion.button>
          )}

          {/* Info cards */}
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: "⚡", title: "5 Questions", desc: "Auto-generated by AI from your note content" },
              { icon: "🧠", title: "Smart MCQ", desc: "Multiple choice with explanations for each answer" },
              { icon: "🏆", title: "Instant Score", desc: "See your score and review mistakes immediately" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-2xl mb-2">{icon}</div>
                <p className="text-sm font-bold text-white mb-1">{title}</p>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
