import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group rounded-lg border border-primary/8 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-card-hover",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
          {trend && <p className="mt-1 text-xs text-success">{trend}</p>}
        </div>
        <div className="rounded-lg bg-primary/5 p-2.5 transition-colors duration-300 group-hover:bg-accent/20">
          <Icon className="h-5 w-5 text-accent" />
        </div>
      </div>
    </div>
  );
}
