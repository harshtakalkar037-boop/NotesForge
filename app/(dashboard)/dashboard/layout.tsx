import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNav } from "@/components/dashboard/top-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#060610" }}>
      <Sidebar />
      <TopNav user={user} />
      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="p-6 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
