import { Badge } from "@/components/ui/badge";
import type { ReferralStatus } from "@prisma/client";

const referralVariant: Record<ReferralStatus, "submitted" | "shortlisted" | "interview" | "offer" | "hired" | "rejected"> = {
  SUBMITTED: "submitted",
  SHORTLISTED: "shortlisted",
  INTERVIEW_SCHEDULED: "interview",
  INTERVIEW_DONE: "interview",
  OFFER_MADE: "offer",
  HIRED: "hired",
  REJECTED: "rejected",
};

export function ReferralStatusBadge({ status }: { status: ReferralStatus }) {
  return (
    <Badge variant={referralVariant[status]}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
