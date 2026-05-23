import { FileUploadZone } from "@/components/upload/file-upload-zone";
import { Brain, Zap, Shield, FileText, Sparkles } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.35)" }}>
            <FileText className="h-5 w-5 text-white" />
          </div>
          Share a Note
        </h1>
        <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
          Upload your study material — AI processes it instantly and shares it with the community.
        </p>
      </div>

      {/* Upload zone card */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {/* Ambient top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        <div className="relative">
          <FileUploadZone />
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: Brain, title: "AI Summary", desc: "Instant smart summary of every document", grad: ["#6366f1","#8b5cf6"] },
          { icon: Zap, title: "10 Second Processing", desc: "Upload to published in under 10 seconds", grad: ["#f59e0b","#f97316"] },
          { icon: Shield, title: "Community Benefit", desc: "Every student can read and learn from it", grad: ["#06b6d4","#3b82f6"] },
        ].map(({ icon: Icon, title, desc, grad }) => (
          <div key={title} className="rounded-2xl p-4 flex gap-3 transition-all hover:scale-[1.02]"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})` }}>
              <Icon className="h-4.5 w-4.5 text-white h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-white">{title}</p>
              <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Supported formats */}
      <div className="rounded-2xl p-4" style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4" style={{ color: "#818cf8" }} />
          <p className="text-xs font-bold text-white">Supported Formats</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["PDF", "DOCX", "DOC", "PPTX", "PPT", "TXT", "MD", "PNG", "JPG", "JPEG", "WEBP"].map((fmt) => (
            <span key={fmt} className="text-[11px] px-2.5 py-1 rounded-lg font-medium"
              style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>
              .{fmt.toLowerCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
