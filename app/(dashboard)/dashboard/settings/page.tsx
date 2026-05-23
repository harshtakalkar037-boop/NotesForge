import { createClient } from "@/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Shield, Sparkles, Bell, Palette, LogOut } from "lucide-react";
import { signOut } from "@/features/auth/actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = user?.user_metadata?.full_name ?? "";
  const email = user?.email ?? "";
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || email[0]?.toUpperCase() || "U";

  const sections = [
    { id: "profile", label: "Profile", icon: User, color: "#6366f1" },
    { id: "account", label: "Account", icon: Mail, color: "#8b5cf6" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "#06b6d4" },
    { id: "appearance", label: "Appearance", icon: Palette, color: "#f59e0b" },
    { id: "security", label: "Security", icon: Shield, color: "#10b981" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {/* Ambient glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />

        <div className="flex items-center gap-5 mb-6 relative">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="text-xl font-bold"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "2px solid #060610" }}>
              <Sparkles className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          <div>
            <p className="font-bold text-white text-lg">{name || "Student"}</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{email}</p>
            <span className="inline-flex items-center gap-1.5 mt-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>
              <Sparkles className="h-3 w-3" />
              Free Plan — Unlimited
            </span>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4 relative">
          {[
            { label: "Full Name", value: name, placeholder: "Your full name", type: "text", icon: User },
            { label: "Email", value: email, placeholder: "your@email.com", type: "email", icon: Mail, disabled: true },
          ].map(({ label, value, placeholder, type, icon: Icon, disabled }) => (
            <div key={label}>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                {label}
              </label>
              <div className="relative">
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(255,255,255,0.25)" }} />
                <input type={type} defaultValue={value} placeholder={placeholder} disabled={disabled}
                  className="w-full h-11 pl-10 pr-4 rounded-xl text-sm text-white outline-none transition-all"
                  style={{
                    background: disabled ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    opacity: disabled ? 0.5 : 1,
                    cursor: disabled ? "not-allowed" : "text",
                  }} />
              </div>
              {disabled && <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>Email cannot be changed</p>}
            </div>
          ))}

          <button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 15px rgba(99,102,241,0.3)" }}>
            Save Changes
          </button>
        </div>
      </div>

      {/* Settings sections */}
      <div className="grid sm:grid-cols-2 gap-4">
        {sections.map(({ id, label, icon: Icon, color }) => (
          <div key={id} className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all hover:scale-[1.02] hover:bg-white/5"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
>
            <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
              <Icon className="h-4.5 w-4.5 h-5 w-5" style={{ color }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>Manage {label.toLowerCase()} settings</p>
            </div>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl p-5" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)" }}>
        <p className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4" /> Danger Zone
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">Sign out</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Sign out from your account</p>
          </div>
          <form action={signOut}>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-400 transition-all hover:scale-105"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
