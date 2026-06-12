import { prisma } from "@/lib/prisma";

export async function isBlacklisted(email: string, phone?: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  const domain = normalizedEmail.split("@")[1];
  const normalizedPhone = phone?.trim().replace(/[\s\-()]/g, "");

  const checks = [normalizedEmail];
  if (domain) checks.push(domain);
  if (normalizedPhone) checks.push(normalizedPhone);

  const hit = await prisma.blacklist.findFirst({
    where: { value: { in: checks } },
  });
  return !!hit;
}
