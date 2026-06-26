import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MentorDashboardView } from "@/components/mentor/MentorDashboardView";

export default async function MentorDashboardPage() {
  const session = await getSession();
  if (!session || session.user.role !== "MENTOR") redirect("/login");

  return <MentorDashboardView userName={session.user.name ?? "Mentor"} />;
}
