import {
  LayoutDashboard,
  FileText,
  Briefcase,
  UserPlus,
  LogIn,
} from "lucide-react";
import type { NavItem } from "@/components/layout/Sidebar";

export const employerNav: NavItem[] = [
  { href: "/dashboard/employer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/employer/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/employer/referrals", label: "Referrals", icon: FileText },
  { href: "/dashboard/employer/logins", label: "Logins", icon: LogIn },
];

export const referrerNav: NavItem[] = [
  { href: "/dashboard/referrer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/referrer/referrals", label: "My Referrals", icon: FileText },
  { href: "/dashboard/referrer/referrals/new", label: "Submit Referral", icon: UserPlus },
];
