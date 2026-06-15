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
    headline: "Post roles. Receive vetted referrals. Hire with confidence.",
    summary:
      "List open positions with skill tags and INR referral bounties. Review candidate leads, move them through your pipeline, and pay rewards only when hires stick.",
    highlights: ["Post jobs", "Track leads", "INR bounties"],
    features: [
      "Create job postings with skills, requirements, and referral bounty amounts in ₹",
      "Receive candidate referrals from trusted, admin-approved referrers",
      "Review leads with full candidate details and referrer context",
      "Shortlist, schedule interviews, and mark hires — full pipeline visibility",
      "Milestone payouts managed by admin — rewards release at 30, 60, and 90 days",
      "Advanced filters to search and manage jobs and incoming referrals",
    ],
    steps: [
      "Register as an Employer and wait for admin approval",
      "Post your first job with title, description, skills, and bounty amount",
      "Review incoming referrals and update candidate status",
      "Hire great talent — referrers earn when your hire completes retention milestones",
    ],
    pricingNote:
      "You set the referral bounty per role. Platform admin handles milestone verification and payout release.",
    icon: Briefcase,
    accentClass: "from-landing-blue to-landing-blueDark",
  },
  {
    id: "REFERRER",
    title: "Referrer",
    headline: "Submit candidates. Track every stage. Earn milestone rewards.",
    summary:
      "Browse active jobs with advanced filters, submit qualified candidates, and earn INR rewards when your referrals get hired and stay.",
    highlights: ["Browse jobs", "Submit leads", "Earn rewards"],
    features: [
      "Browse open roles filtered by company, skills, role title, and bounty range",
      "Submit candidate referrals with contact details and resume links",
      "Track referral status from submission through hire or rejection",
      "View milestone rewards (30 / 60 / 90 days) on each successful hire",
      "Dashboard overview with recent leads and reward summaries",
      "Notifications when status changes or payouts are released",
    ],
    steps: [
      "Register as a Referrer and get approved by admin",
      "Browse jobs and pick roles that match your network",
      "Submit candidate details for roles you believe in",
      "Track progress and collect milestone rewards when hires stick",
    ],
    pricingNote:
      "Rewards are set per job by the employer. You earn in INR when admin confirms retention milestones.",
    icon: Award,
    accentClass: "from-landing-blueDark to-landing-blue",
  },
];

export function getRolePlan(id: RolePlanId): RolePlan | undefined {
  return ROLE_PLANS.find((p) => p.id === id);
}
