import type { RolePlanId } from "@/components/home/rolePlans";

export const EXAMPLE_BOUNTY = 50000;
export const MILESTONE_SPLITS = [
  { day: 30, pct: 30 },
  { day: 60, pct: 30 },
  { day: 90, pct: 40 },
] as const;

export const NAV_LINKS = [
  { href: "#rewards", label: "Rewards" },
  { href: "#plans", label: "Roles" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
] as const;

export const BENEFITS: { text: string; highlight?: string }[] = [
  {
    text: "Admin-approved referrers with duplicate detection and fraud prevention on every submission.",
    highlight: "Admin-approved referrers",
  },
  {
    text: "Employers post jobs with skill tags and set referral bounties in INR per role.",
    highlight: "referral bounties in INR",
  },
  {
    text: "Milestone rewards release at 30, 60, and 90 days — only when hires stick.",
    highlight: "Milestone rewards",
  },
  {
    text: "Full referral lifecycle tracking from submission through shortlist, interview, and hire.",
    highlight: "Full referral lifecycle",
  },
  {
    text: "Mentor and Mentee matching with skill-based search and career goal tracking.",
    highlight: "Mentor and Mentee matching",
  },
  {
    text: "Advanced filters across jobs and referrals — company, role, skills, and bounty range.",
    highlight: "Advanced filters",
  },
  {
    text: "Real-time in-app notifications when referral status changes or payouts are released.",
    highlight: "Real-time notifications",
  },
  {
    text: "Platform admin oversees payouts, disputes, mentorships, and audit logs.",
    highlight: "Platform admin",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Register & get approved",
    description:
      "Create your free account as a Referrer, Employer, Mentor, or Mentee. Admin reviews and activates your profile.",
  },
  {
    step: 2,
    title: "Browse jobs & submit referrals",
    description:
      "Find open roles with advanced filters. Submit qualified candidates with contact details and resume links.",
  },
  {
    step: 3,
    title: "Earn milestone rewards",
    description:
      "When your referral is hired and stays, admin confirms retention at 30, 60, and 90 days — you earn in INR.",
  },
] as const;

export const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "Who can join TrustHire?",
    answer:
      "Employers post jobs and review candidates. Referrers submit leads and earn bounties. Mentors guide mentees. Mentees find mentors and explore careers. Admin manages the platform.",
  },
  {
    question: "How does account approval work?",
    answer:
      "After registration, your account status is Pending until a platform admin approves it. You'll be notified and can sign in once active.",
  },
  {
    question: "When are INR rewards paid to referrers?",
    answer:
      "Rewards are released in three milestones — 30, 60, and 90 days after hire — when admin confirms the candidate is still employed. Payout percentages are 30%, 30%, and 40% of the job bounty.",
  },
  {
    question: "What is a referral bounty?",
    answer:
      "Each job has a bounty set by the employer (e.g. ₹50,000). Referrers earn a portion of that bounty at each retention milestone when their referred candidate is hired and stays.",
  },
  {
    question: "Can employers manage milestone payouts?",
    answer:
      "No. Milestone confirmation and payout release are managed by platform admin only. Employers focus on reviewing candidates and updating hire status.",
  },
  {
    question: "How does mentorship work?",
    answer:
      "Mentors build profiles with expertise skills. Mentees search by company and skills, send requests, and track goals. Mentors accept or reject requests; admin oversees all relationships.",
  },
  {
    question: "What filters are available for jobs?",
    answer:
      "Search by keyword, company, job title, skills, status, and bounty range (min/max in ₹). Filters work on job browse pages for referrers, mentors, and mentees.",
  },
  {
    question: "Is TrustHire free to join?",
    answer:
      "Yes. Registration is free for all roles. Referrers earn when placements succeed. Employers set bounties per role. Mentorship is free for mentors and mentees.",
  },
  {
    question: "What currency does TrustHire use?",
    answer:
      "All bounties, rewards, and payouts are displayed and processed in Indian Rupees (INR, ₹).",
  },
  {
    question: "How do I track my referrals?",
    answer:
      "Sign in to your dashboard. Referrers see all leads, statuses, and reward milestones. Use notifications for real-time updates on status changes.",
  },
];

export const QUICK_START_ROLES: { value: RolePlanId; label: string }[] = [
  { value: "REFERRER", label: "Referrer — earn on hires" },
  { value: "EMPLOYER", label: "Employer — post jobs" },
  { value: "MENTOR", label: "Mentor — guide talent" },
  { value: "MENTEE", label: "Mentee — find mentors" },
];

export const FOOTER_LINKS = {
  quick: [
    { href: "#plans", label: "Choose a role" },
    { href: "#rewards", label: "Rewards" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#faq", label: "FAQ" },
    { href: "/login", label: "Sign in" },
    { href: "/register", label: "Register" },
  ],
  contact: {
    email: "admin@trusthire.com",
    tagline: "Where trusted hiring comes first.",
  },
};
