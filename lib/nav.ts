import {
  LayoutDashboard,
  Users,
  ShieldBan,
  Settings,
  ClipboardList,
  LogIn,
  UserCircle,
  GraduationCap,
  Target,
  HeartHandshake,
} from "lucide-react";
import type { NavItem } from "@/components/layout/Sidebar";

export const superAdminNav: NavItem[] = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/mentorships", label: "Mentorships", icon: GraduationCap },
  { href: "/dashboard/admin/logins", label: "Logins", icon: LogIn },
  { href: "/dashboard/admin/blacklist", label: "Blacklist", icon: ShieldBan },
  { href: "/dashboard/admin/config", label: "Config", icon: Settings },
  { href: "/dashboard/admin/audit", label: "Audit Log", icon: ClipboardList },
];

export const mentorNav: NavItem[] = [
  { href: "/dashboard/mentor", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/mentor/mentees", label: "Mentees", icon: Users },
  { href: "/dashboard/mentor/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/mentor/reflection", label: "Reflection", icon: HeartHandshake },
];

export const menteeNav: NavItem[] = [
  { href: "/dashboard/mentee", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/mentee/mentors", label: "Find Mentors", icon: GraduationCap },
  { href: "/dashboard/mentee/goals", label: "Goals", icon: Target },
  { href: "/dashboard/mentee/reflection", label: "Reflection", icon: HeartHandshake },
];

export const adminNav = superAdminNav;
