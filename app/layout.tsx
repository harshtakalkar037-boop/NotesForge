import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "NoteForge AI — Turn Your Notes into a Learning System",
    template: "%s | NoteForge AI",
  },
  description:
    "Upload your notes, PDFs, and documents. Let AI summarize, quiz you, and help you learn smarter.",
  keywords: ["notes", "AI", "learning", "study", "productivity"],
  openGraph: {
    title: "NoteForge AI",
    description: "Turn Your Notes into an AI-Powered Learning System",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
