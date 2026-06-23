import { prisma } from "@/lib/prisma";

const DEFAULTS: Record<string, string> = {
  default_max_mentees: "5",
};

export async function getConfig(key: string): Promise<string> {
  const row = await prisma.platformConfig.findUnique({ where: { key } });
  return row?.value ?? DEFAULTS[key] ?? "";
}

export async function getAllConfig(): Promise<Record<string, string>> {
  const rows = await prisma.platformConfig.findMany();
  const map = { ...DEFAULTS };
  for (const row of rows) map[row.key] = row.value;
  return map;
}
