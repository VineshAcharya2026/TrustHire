import {
  Award,
  Briefcase,
  GraduationCap,
  Target,
  type LucideIcon,
} from "lucide-react";

export type RolePlanId = "EMPLOYER" | "REFERRER" | "MENTOR" | "MENTEE";

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
    accentClass: "from-landing-orange to-landing-orangeDark",
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
    accentClass: "from-landing-orangeDark to-landing-orange",
  },
  {
    id: "MENTOR",
    title: "Mentor",
    headline: "Share expertise. Guide mentees. Grow your professional network.",
    summary:
      "Build a mentor profile with your company, title, and skills. Accept mentee requests, support career growth, and browse jobs to share opportunities.",
    highlights: ["Expert profile", "Accept mentees", "Browse jobs"],
    features: [
      "Profile with company, title, bio, and comma-separated expertise skills",
      "Receive and accept or reject mentorship requests from mentees",
      "Manage active mentees from your dashboard",
      "Browse open jobs with the same advanced filters as referrers",
      "Help mentees understand roles, skills in demand, and career paths",
      "Admin oversight of all mentorship relationships on the platform",
    ],
    steps: [
      "Register as a Mentor with your professional background",
      "Complete your profile with expertise and company details",
      "Review incoming mentee requests and accept matches",
      "Guide mentees toward their goals and relevant job opportunities",
    ],
    pricingNote: "Mentorship is free to join. Focus on impact — no referral bounty required to mentor.",
    icon: GraduationCap,
    accentClass: "from-landing-orange to-amber-500",
  },
  {
    id: "MENTEE",
    title: "Mentee",
    headline: "Find mentors. Set goals. Explore careers with guidance.",
    summary:
      "Connect with experienced mentors filtered by skills and company. Set career goals, request mentorship, and browse jobs with powerful search filters.",
    highlights: ["Find mentors", "Set goals", "Browse jobs"],
    features: [
      "Profile with current role, career goals, and desired skills",
      "Search mentors by company, expertise, and skills",
      "Send mentorship requests and track active relationships",
      "Goals page to document what you want to achieve",
      "Browse open jobs with filters for company, role, skills, and bounty",
      "Get guidance before applying or being referred to roles",
    ],
    steps: [
      "Register as a Mentee with your current role and goals",
      "Find mentors whose expertise matches your desired skills",
      "Request mentorship and start working toward your goals",
      "Browse jobs and explore opportunities with mentor support",
    ],
    pricingNote: "Free to join. Mentorship helps you navigate the referral hiring ecosystem.",
    icon: Target,
    accentClass: "from-amber-500 to-landing-orange",
  },
];

export function getRolePlan(id: RolePlanId): RolePlan | undefined {
  return ROLE_PLANS.find((p) => p.id === id);
}
