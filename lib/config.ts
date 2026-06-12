import { prisma } from "@/lib/prisma";

const DEFAULTS: Record<string, string> = {
  day_30_pct: "30",
  day_60_pct: "30",
  day_90_pct: "40",
  milestone_day_30: "30",
  milestone_day_60: "60",
  milestone_day_90: "90",
  max_referrals_per_day: "5",
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

export async function getMilestoneConfig() {
  const config = await getAllConfig();
  return [
    { dayMark: parseInt(config.milestone_day_30, 10), percentage: parseFloat(config.day_30_pct) },
    { dayMark: parseInt(config.milestone_day_60, 10), percentage: parseFloat(config.day_60_pct) },
    { dayMark: parseInt(config.milestone_day_90, 10), percentage: parseFloat(config.day_90_pct) },
  ];
}
