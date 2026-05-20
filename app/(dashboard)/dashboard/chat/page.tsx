import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)] space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            AI Chat
            <Badge variant="violet" className="text-xs">Beta</Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Chat with your notes and documents using AI
          </p>
        </div>
      </div>

      {/* Chat area */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardContent className="flex-1 flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center mb-5">
            <Sparkles className="h-8 w-8 text-indigo-400" />
          </div>
          <h3 className="font-semibold text-lg mb-2">
            Start a conversation with your notes
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mb-6">
            Upload documents first, then ask any question about them. The AI will
            find relevant information and answer based on your content.
          </p>
          <div className="flex flex-wrap gap-2 justify-center max-w-sm">
            {[
              "Summarize my lecture notes",
              "What are the key concepts?",
              "Create a study quiz",
              "Explain this topic simply",
            ].map((prompt) => (
              <button
                key={prompt}
                className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-muted-foreground hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
        </CardContent>

        {/* Input */}
        <div className="border-t border-border p-4 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask anything about your notes..."
              className="flex-1 h-10 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              disabled
            />
            <Button size="icon" disabled>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Upload documents first to enable AI chat
          </p>
        </div>
      </Card>
    </div>
  );
}
