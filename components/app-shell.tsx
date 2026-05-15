"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BarChart3, Clock3, FileText, Gauge, Goal, Home, Settings, Sparkles } from "lucide-react";

const nav = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/platforms", label: "Platforms", icon: Gauge },
  { href: "/content", label: "Content", icon: FileText },
  { href: "/execution", label: "Execution", icon: Clock3 },
  { href: "/goals", label: "Goals", icon: Goal },
  { href: "/insights", label: "Insights", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings }
];

export const AppShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-ink">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(103,232,165,0.16),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(255,126,157,0.13),transparent_36%),linear-gradient(145deg,#0A0B10,#111827_55%,#16131E)]" />
      <div className="fixed inset-0 -z-10 grid-bg opacity-40" />
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-black/20 px-4 py-5 backdrop-blur-xl lg:block">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.18em] text-mint">Founder Signal</div>
          <div className="mt-2 text-xl font-semibold">Analytics OS</div>
        </div>
        <nav className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  active ? "bg-white/10 text-white shadow-glow" : "text-white/65 hover:bg-white/7 hover:text-white"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <header className="sticky top-0 z-30 border-b border-line bg-ink/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-mint">Founder Signal</div>
            <div className="text-lg font-semibold">Analytics OS</div>
          </div>
          <Link href="/analytics" className="rounded-lg border border-line p-2">
            <BarChart3 size={18} />
          </Link>
        </div>
      </header>
      <main className="px-4 py-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <nav className="fixed bottom-3 left-3 right-3 z-40 grid grid-cols-4 gap-2 rounded-xl border border-line bg-black/65 p-2 backdrop-blur-xl lg:hidden">
        {nav.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={`flex justify-center rounded-lg p-2 ${active ? "bg-white/12" : ""}`}>
              <Icon size={18} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
