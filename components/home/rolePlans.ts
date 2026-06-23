import { GraduationCap, Target, type LucideIcon } from "lucide-react";

export type RolePlanId = "MENTOR" | "MENTEE";

export type RolePlan = {
  id: RolePlanId;
  title: string;
  headline: string;
  summary: string;
  highlights: string[];
  features: string[];
  steps: string[];
  icon: LucideIcon;
  accentClass: string;
};

export const ROLE_PLANS: RolePlan[] = [
  {
    id: "MENTOR",
    title: "Mentor",
    headline: "Share expertise. Guide the next generation.",
    summary:
      "Create a mentor profile, accept mentee requests, and help others grow through structured mentorship.",
    highlights: ["Build profile", "Accept requests", "Guide mentees"],
    features: [
      "Set your company, title, and areas of expertise",
      "Control how many mentees you take on",
      "Review and accept or reject mentorship requests",
      "Track active mentees from your dashboard",
      "Notifications when mentees reach out",
    ],
    steps: [
      "Register as a Mentor",
      "Complete your profile with expertise and experience",
      "Review incoming mentorship requests",
      "Guide mentees toward their career goals",
    ],
    icon: GraduationCap,
    accentClass: "from-landing-blue to-landing-blueDark",
  },
  {
    id: "MENTEE",
    title: "Mentee",
    headline: "Find mentors. Set goals. Grow your career.",
    summary:
      "Browse mentors by skills and company, send mentorship requests, and track your learning goals.",
    highlights: ["Find mentors", "Set goals", "Get guidance"],
    features: [
      "Search mentors by expertise and company",
      "Send personalized mentorship requests",
      "Define your current role, goals, and desired skills",
      "Track active and pending mentorships",
      "Notifications when mentors respond",
    ],
    steps: [
      "Register as a Mentee",
      "Set your career goals and desired skills",
      "Browse mentors and send requests",
      "Work with your mentor on your growth plan",
    ],
    icon: Target,
    accentClass: "from-landing-blueDark to-landing-blue",
  },
];

export function getRolePlan(id: RolePlanId): RolePlan | undefined {
  return ROLE_PLANS.find((p) => p.id === id);
}
