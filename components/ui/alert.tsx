import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const variants = {
  error: "border-error/20 bg-red-50 text-error",
  success: "border-success/20 bg-emerald-50 text-success",
  info: "border-primary/10 bg-primary/5 text-primary",
};

const icons = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

export function Alert({
  children,
  variant = "info",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  const Icon = icons[variant];
  return (
    <div className={cn("flex gap-2 rounded-lg border px-4 py-3 text-sm", variants[variant], className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
