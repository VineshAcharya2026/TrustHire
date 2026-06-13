import type { ReferralStatus } from "@prisma/client";

export const REFERRAL_PIPELINE: ReferralStatus[] = [
  "SUBMITTED",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "INTERVIEW_DONE",
  "OFFER_MADE",
  "HIRED",
  "REJECTED",
];

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getStatusIndex(status: ReferralStatus) {
  const idx = REFERRAL_PIPELINE.indexOf(status);
  return idx === -1 ? 0 : idx;
}

export function getStatusProgress(status: ReferralStatus) {
  if (status === "REJECTED") return 0;
  const idx = getStatusIndex(status);
  return Math.round((idx / (REFERRAL_PIPELINE.length - 2)) * 100);
}

export function isTerminalStatus(status: ReferralStatus) {
  return status === "HIRED" || status === "REJECTED";
}

export const STATUS_LABELS: Record<ReferralStatus, string> = {
  SUBMITTED: "Submitted",
  SHORTLISTED: "Shortlisted",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  INTERVIEW_DONE: "Interview Done",
  OFFER_MADE: "Offer Made",
  HIRED: "Hired",
  REJECTED: "Rejected",
};
