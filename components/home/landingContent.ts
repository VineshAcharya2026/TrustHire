import type { RolePlanId } from "@/components/home/rolePlans";

export const NAV_LINKS = [
  { href: "#plans", label: "Roles" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
] as const;

export const BENEFITS: { text: string; highlight?: string }[] = [
  {
    text: "Mentors set expertise, company, and capacity — mentees find the right guide.",
    highlight: "Expert mentors",
  },
  {
    text: "Mentees define goals and desired skills to match with relevant mentors.",
    highlight: "Goal-driven matching",
  },
  {
    text: "Request, accept, or reject mentorships with full status tracking.",
    highlight: "Structured mentorship flow",
  },
  {
    text: "Search mentors by company, skills, and keywords.",
    highlight: "Smart search",
  },
  {
    text: "Real-time notifications when mentorship requests are sent or answered.",
    highlight: "Real-time notifications",
  },
  {
    text: "Super admin oversees users, mentorships, logins, and platform config.",
    highlight: "Super admin oversight",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Register as mentor or mentee",
    description: "Create your free account and complete your profile with goals or expertise.",
  },
  {
    step: 2,
    title: "Connect through mentorship",
    description: "Mentees browse mentors and send requests. Mentors review and accept mentees.",
  },
  {
    step: 3,
    title: "Grow together",
    description: "Track active mentorships, update goals, and build lasting professional relationships.",
  },
] as const;

export const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "Who can join TrustHire?",
    answer: "Mentors share expertise and guide mentees. Mentees set goals and find mentors. Super admin manages the platform.",
  },
  {
    question: "How do mentorship requests work?",
    answer: "Mentees send a request to a mentor. The mentor can accept, reject, or later mark the mentorship as completed.",
  },
  {
    question: "Is there a limit on mentees per mentor?",
    answer: "Yes. Each mentor sets a maximum number of active mentees. The default is 5 unless changed in their profile.",
  },
  {
    question: "Can I change my goals as a mentee?",
    answer: "Yes. Update your current role, goals, and desired skills anytime from the Goals page in your dashboard.",
  },
  {
    question: "Is TrustHire free to join?",
    answer: "Yes. Registration is free for mentors and mentees.",
  },
  {
    question: "What does the super admin do?",
    answer: "Super admin manages all users, views mentorships and logins, maintains blacklist and platform configuration.",
  },
];

export const QUICK_START_ROLES: { value: RolePlanId; label: string }[] = [
  { value: "MENTOR", label: "Mentor — guide others" },
  { value: "MENTEE", label: "Mentee — find a mentor" },
];

export const FOOTER_LINKS = {
  quick: [
    { href: "#plans", label: "Choose a role" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#faq", label: "FAQ" },
    { href: "/login", label: "Sign in" },
    { href: "/register", label: "Register" },
  ],
  contact: {
    email: "superadmin@trusthire.com",
    tagline: "Where mentorship comes first.",
  },
};
