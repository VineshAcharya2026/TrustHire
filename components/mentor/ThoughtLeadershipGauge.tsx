import { cn } from "@/lib/utils";

export function ThoughtLeadershipGauge({ score }: { score: number }) {
  return (
    <div className="rounded-xl border border-primary/8 bg-white p-5 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">Thought leadership</p>
      <div className="mt-3 flex items-end gap-3">
        <p className="text-3xl font-bold text-primary">{score}</p>
        <p className="mb-1 text-sm text-muted">/ 100</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary/10">
        <div
          className={cn("h-full rounded-full bg-accent transition-all")}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}
