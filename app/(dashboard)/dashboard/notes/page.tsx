import Link from "next/link";
import { Plus, Search, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-muted-foreground text-sm mt-1">All your uploaded notes and documents</p>
        </div>
        <Link href="/dashboard/upload">
          <Button>
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </Link>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <Card>
        <CardContent className="py-20 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-indigo-400" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No notes yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">
            Upload your first document to start building your AI-powered knowledge base.
          </p>
          <Link href="/dashboard/upload">
            <Button>
              <Upload className="h-4 w-4" />
              Upload Your First Note
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
