import { FileUploadZone } from "@/components/upload/file-upload-zone";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Shield } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Upload Notes</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload your documents and let AI do the heavy lifting.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Upload Files</CardTitle>
            <Badge variant="indigo">Free Plan: 10 uploads</Badge>
          </div>
          <CardDescription>
            Drag and drop files, or click to select. Supports PDF, DOCX, PPTX, TXT, images, and URLs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadZone />
        </CardContent>
      </Card>

      {/* AI features info */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: Brain,
            title: "AI Summary",
            desc: "Instantly get a concise summary of any document",
            color: "text-indigo-400 bg-indigo-500/10",
          },
          {
            icon: Zap,
            title: "Auto Quiz",
            desc: "Generate quiz questions to test your knowledge",
            color: "text-violet-400 bg-violet-500/10",
          },
          {
            icon: Shield,
            title: "Private by Default",
            desc: "Your files are encrypted and only visible to you",
            color: "text-cyan-400 bg-cyan-500/10",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex gap-3 p-4 rounded-xl border border-border"
            >
              <div className={`p-2 rounded-lg h-fit ${item.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
