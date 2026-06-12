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
    <aside className="hidden lg:flex w-64 flex-col border-r border-primary/8 bg-white shadow-subtle">
      <div className="flex h-16 items-center gap-2 border-b border-primary/8 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary shadow-subtle transition-transform duration-200 hover:scale-105">
          <Briefcase className="h-4 w-4 text-accent" />
        </div>
        <div>
          <p className="text-sm font-bold text-primary">TrustHire</p>
          <p className="text-[10px] uppercase tracking-wider text-muted">{title}</p>
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
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary text-white shadow-card"
                  : "text-muted hover:bg-surface hover:text-primary hover:shadow-subtle hover:translate-x-0.5"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
