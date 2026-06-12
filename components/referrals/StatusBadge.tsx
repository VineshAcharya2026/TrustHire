import { Badge } from "@/components/ui/badge";
import type { ReferralStatus, RewardStatus } from "@prisma/client";

const referralVariant: Record<ReferralStatus, "submitted" | "shortlisted" | "interview" | "offer" | "hired" | "rejected"> = {
  SUBMITTED: "submitted",
  SHORTLISTED: "shortlisted",
  INTERVIEW_SCHEDULED: "interview",
  INTERVIEW_DONE: "interview",
  OFFER_MADE: "offer",
  HIRED: "hired",
  REJECTED: "rejected",
};

const rewardVariant: Record<RewardStatus, "locked" | "released" | "disputed" | "rejected"> = {
  LOCKED: "locked",
  PARTIAL: "locked",
  RELEASED: "released",
  CANCELLED: "rejected",
  DISPUTED: "disputed",
};

export function ReferralStatusBadge({ status }: { status: ReferralStatus }) {
  return (
    <Badge variant={referralVariant[status]}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function RewardStatusBadge({ status }: { status: RewardStatus }) {
  return (
    <Badge variant={rewardVariant[status]}>
      {status}
    </Badge>
  );
}
