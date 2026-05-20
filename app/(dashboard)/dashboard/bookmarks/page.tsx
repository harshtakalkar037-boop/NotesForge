import { Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BookmarksPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Notes you&apos;ve saved for quick access
        </p>
      </div>

      <Card>
        <CardContent className="py-20 flex flex-col items-center justify-center text-center">
          <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
            <Bookmark className="h-7 w-7 text-indigo-400" />
          </div>
          <p className="font-medium mb-1">No bookmarks yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Bookmark notes to find them here quickly
          </p>
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/notes">Browse Notes</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
