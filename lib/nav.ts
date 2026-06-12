import {
  LayoutDashboard,
  Users,
  FileText,
  Banknote,
  AlertTriangle,
  ShieldBan,
  Settings,
  ClipboardList,
  Briefcase,
  UserPlus,
  Award,
} from "lucide-react";
import type { NavItem } from "@/components/layout/Sidebar";

export const adminNav: NavItem[] = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/referrals", label: "Referrals", icon: FileText },
  { href: "/dashboard/admin/payouts", label: "Payouts", icon: Banknote },
  { href: "/dashboard/admin/disputes", label: "Disputes", icon: AlertTriangle },
  { href: "/dashboard/admin/blacklist", label: "Blacklist", icon: ShieldBan },
  { href: "/dashboard/admin/config", label: "Config", icon: Settings },
  { href: "/dashboard/admin/audit", label: "Audit Log", icon: ClipboardList },
];

export const employerNav: NavItem[] = [
  { href: "/dashboard/employer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/employer/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/employer/referrals", label: "Referrals", icon: FileText },
];

export const referrerNav: NavItem[] = [
  { href: "/dashboard/referrer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/referrer/referrals", label: "My Referrals", icon: FileText },
  { href: "/dashboard/referrer/referrals/new", label: "Submit Referral", icon: UserPlus },
  { href: "/dashboard/referrer/rewards", label: "Rewards", icon: Award },
];
