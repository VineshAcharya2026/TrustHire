"use client";

import { signOut, useSession } from "next-auth/react";
import { Bell, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Topbar({
  onMenuClick,
  breadcrumbs,
}: {
  onMenuClick?: () => void;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  const { data: session } = useSession();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => setUnread(d.unread ?? 0))
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-primary/8 bg-white/95 px-4 shadow-subtle backdrop-blur-sm lg:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        {breadcrumbs && (
          <nav className="flex items-center gap-1.5 text-sm text-muted">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {b.href ? (
                  <Link href={b.href} className="transition-colors hover:text-primary">
                    {b.label}
                  </Link>
                ) : (
                  <span className="font-medium text-primary">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/api/notifications"
          className="relative rounded-md p-2 transition-all duration-200 hover:bg-surface hover:shadow-subtle"
        >
          <Bell className="h-5 w-5 text-primary" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-primary">
              {unread}
            </span>
          )}
        </Link>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-primary">{session?.user?.name || session?.user?.email}</p>
          <Badge variant="accent" className="mt-0.5">{session?.user?.role}</Badge>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
