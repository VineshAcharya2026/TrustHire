import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

export function EliteFounderBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <Badge variant="accent" className="gap-1 px-3 py-1 text-sm">
      <Award className="h-4 w-4" />
      Elite Founder 100
    </Badge>
  );
}
