"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Briefcase } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export function Sidebar({ items, title }: { items: NavItem[]; title: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-primary/8 bg-white/80 shadow-subtle backdrop-blur-sm">
      <div className="flex h-16 items-center gap-3 border-b border-primary/8 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 shadow-card">
          <Briefcase className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight text-primary">TrustHire</p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted">{title}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-accent text-white shadow-card"
                  : "text-muted hover:bg-accent/5 hover:text-accent hover:translate-x-0.5"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active && "text-white")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-primary/8 p-4">
        <p className="text-center text-[10px] text-muted">Trusted referral hiring</p>
      </div>
    </aside>
  );
}
