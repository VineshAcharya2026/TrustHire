import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OverviewHeader({
  title,
  subtitle,
  badge,
  backHref,
  backLabel = "Back",
  icon,
  actions,
  accent = "from-primary via-accent to-primary/30",
}: {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  backHref: string;
  backLabel?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-primary/8 bg-white shadow-card">
      <div className={cn("h-2 bg-gradient-to-r", accent)} />
      <div className="p-6">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-muted hover:text-primary">
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {icon && (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary text-accent shadow-card">
                {icon}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-primary">{title}</h1>
                {badge}
              </div>
              {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}

export function EntityCardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>;
}
