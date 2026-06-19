import { Award, Briefcase, type LucideIcon } from "lucide-react";

export type RolePlanId = "EMPLOYER" | "REFERRER";

export type RolePlan = {
  id: RolePlanId;
  title: string;
  headline: string;
  summary: string;
  highlights: string[];
  features: string[];
  steps: string[];
  pricingNote?: string;
  icon: LucideIcon;
  accentClass: string;
};

export const ROLE_PLANS: RolePlan[] = [
  {
    id: "EMPLOYER",
    title: "Employer",
    headline: "Post roles. Review referrals. Monitor logins.",
    summary:
      "List open positions, review candidate referrals from referrers, and track all platform sign-in activity.",
    highlights: ["Post jobs", "Review referrals", "View logins"],
    features: [
      "Create job postings with skills, requirements, and referral bounty amounts",
      "Receive candidate referrals from referrers",
      "Review leads with full candidate details and referrer context",
      "Shortlist, schedule interviews, and mark hires — full pipeline visibility",
      "View all user login activity across the platform",
    ],
    steps: [
      "Register as an Employer",
      "Post your first job with title, description, skills, and bounty amount",
      "Review incoming referrals and update candidate status",
      "Monitor sign-in activity from the Logins dashboard",
    ],
    icon: Briefcase,
    accentClass: "from-landing-blue to-landing-blueDark",
  },
  {
    id: "REFERRER",
    title: "Referrer",
    headline: "Submit candidates. Track every stage.",
    summary:
      "Browse active jobs, submit qualified candidates, and track referral status through hire or rejection.",
    highlights: ["Browse jobs", "Submit referrals", "Track status"],
    features: [
      "Browse open roles filtered by company, skills, role title, and bounty range",
      "Submit candidate referrals with contact details and resume links",
      "Track referral status from submission through hire or rejection",
      "Dashboard overview with recent referrals",
      "Notifications when status changes",
    ],
    steps: [
      "Register as a Referrer",
      "Browse jobs and pick roles that match your network",
      "Submit candidate details for roles you believe in",
      "Track progress on your referrals dashboard",
    ],
    icon: Award,
    accentClass: "from-landing-blueDark to-landing-blue",
  },
];

export function getRolePlan(id: RolePlanId): RolePlan | undefined {
  return ROLE_PLANS.find((p) => p.id === id);
}
