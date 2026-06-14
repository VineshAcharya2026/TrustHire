import type { Prisma, ReferralStatus } from "@prisma/client";

export type JobFilterParams = {
  q?: string;
  company?: string[];
  skills?: string[];
  role?: string[];
  minBounty?: number;
  maxBounty?: number;
  activeOnly?: boolean;
  isActive?: boolean;
};

export type ReferralFilterParams = {
  q?: string;
  company?: string[];
  skills?: string[];
  role?: string[];
  status?: ReferralStatus;
  minBounty?: number;
  maxBounty?: number;
};

export type MentorFilterParams = {
  q?: string;
  company?: string[];
  skills?: string[];
};

export function parseListParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseJobFilters(searchParams: URLSearchParams): JobFilterParams {
  const minBounty = searchParams.get("minBounty");
  const maxBounty = searchParams.get("maxBounty");
  const jobStatus = searchParams.get("jobStatus");
  return {
    q: searchParams.get("q")?.trim() || undefined,
    company: parseListParam(searchParams.get("company")),
    skills: parseListParam(searchParams.get("skills")),
    role: parseListParam(searchParams.get("role")),
    minBounty: minBounty ? Number(minBounty) : undefined,
    maxBounty: maxBounty ? Number(maxBounty) : undefined,
    activeOnly: searchParams.get("activeOnly") !== "false",
    isActive:
      jobStatus === "active" ? true : jobStatus === "closed" ? false : undefined,
  };
}

export function parseReferralFilters(searchParams: URLSearchParams): ReferralFilterParams {
  const minBounty = searchParams.get("minBounty");
  const maxBounty = searchParams.get("maxBounty");
  const status = searchParams.get("status");
  return {
    q: searchParams.get("q")?.trim() || undefined,
    company: parseListParam(searchParams.get("company")),
    skills: parseListParam(searchParams.get("skills")),
    role: parseListParam(searchParams.get("role")),
    status: status ? (status as ReferralStatus) : undefined,
    minBounty: minBounty ? Number(minBounty) : undefined,
    maxBounty: maxBounty ? Number(maxBounty) : undefined,
  };
}

export function parseMentorFilters(searchParams: URLSearchParams): MentorFilterParams {
  return {
    q: searchParams.get("q")?.trim() || undefined,
    company: parseListParam(searchParams.get("company")),
    skills: parseListParam(searchParams.get("skills")),
  };
}

export function buildJobWhere(filters: JobFilterParams): Prisma.JobWhereInput {
  const and: Prisma.JobWhereInput[] = [];

  if (filters.isActive !== undefined) {
    and.push({ isActive: filters.isActive });
  } else if (filters.activeOnly !== false) {
    and.push({ isActive: true });
  }

  if (filters.q) {
    and.push({
      OR: [
        { title: { contains: filters.q, mode: "insensitive" } },
        { description: { contains: filters.q, mode: "insensitive" } },
        { requirements: { contains: filters.q, mode: "insensitive" } },
        { employer: { companyName: { contains: filters.q, mode: "insensitive" } } },
        { skills: { some: { skill: { name: { contains: filters.q, mode: "insensitive" } } } } },
      ],
    });
  }

  if (filters.company?.length) {
    and.push({
      OR: filters.company.map((c) => ({
        employer: { companyName: { equals: c, mode: "insensitive" } },
      })),
    });
  }

  if (filters.role?.length) {
    and.push({
      OR: filters.role.map((r) => ({
        title: { contains: r, mode: "insensitive" as const },
      })),
    });
  }

  if (filters.skills?.length) {
    and.push({
      AND: filters.skills.map((skill) => ({
        skills: {
          some: {
            skill: { name: { equals: skill, mode: "insensitive" } },
          },
        },
      })),
    });
  }

  if (filters.minBounty != null && !Number.isNaN(filters.minBounty)) {
    and.push({ rewardAmount: { gte: filters.minBounty } });
  }

  if (filters.maxBounty != null && !Number.isNaN(filters.maxBounty)) {
    and.push({ rewardAmount: { lte: filters.maxBounty } });
  }

  return and.length ? { AND: and } : {};
}

export function buildReferralWhere(filters: ReferralFilterParams): Prisma.ReferralWhereInput {
  const and: Prisma.ReferralWhereInput[] = [];

  if (filters.status) {
    and.push({ status: filters.status });
  }

  if (filters.q) {
    and.push({
      OR: [
        { candidateName: { contains: filters.q, mode: "insensitive" } },
        { candidateEmail: { contains: filters.q, mode: "insensitive" } },
        { job: { title: { contains: filters.q, mode: "insensitive" } } },
        { job: { employer: { companyName: { contains: filters.q, mode: "insensitive" } } } },
        { job: { skills: { some: { skill: { name: { contains: filters.q, mode: "insensitive" } } } } } },
      ],
    });
  }

  if (filters.company?.length) {
    and.push({
      OR: filters.company.map((c) => ({
        job: { employer: { companyName: { equals: c, mode: "insensitive" } } },
      })),
    });
  }

  if (filters.role?.length) {
    and.push({
      OR: filters.role.map((r) => ({
        job: { title: { contains: r, mode: "insensitive" as const } },
      })),
    });
  }

  if (filters.skills?.length) {
    and.push({
      AND: filters.skills.map((skill) => ({
        job: {
          skills: {
            some: { skill: { name: { equals: skill, mode: "insensitive" } } },
          },
        },
      })),
    });
  }

  if (filters.minBounty != null && !Number.isNaN(filters.minBounty)) {
    and.push({ job: { rewardAmount: { gte: filters.minBounty } } });
  }

  if (filters.maxBounty != null && !Number.isNaN(filters.maxBounty)) {
    and.push({ job: { rewardAmount: { lte: filters.maxBounty } } });
  }

  return and.length ? { AND: and } : {};
}

export function buildMentorWhere(filters: MentorFilterParams): Prisma.UserWhereInput {
  const and: Prisma.UserWhereInput[] = [{ role: "MENTOR", status: "ACTIVE" }];

  if (filters.q) {
    and.push({
      OR: [
        { email: { contains: filters.q, mode: "insensitive" } },
        { profile: { firstName: { contains: filters.q, mode: "insensitive" } } },
        { profile: { lastName: { contains: filters.q, mode: "insensitive" } } },
        { mentorProfile: { company: { contains: filters.q, mode: "insensitive" } } },
        { mentorProfile: { title: { contains: filters.q, mode: "insensitive" } } },
      ],
    });
  }

  if (filters.company?.length) {
    and.push({
      OR: filters.company.map((c) => ({
        mentorProfile: { company: { equals: c, mode: "insensitive" } },
      })),
    });
  }

  if (filters.skills?.length) {
    and.push({
      mentorProfile: {
        expertise: { hasSome: filters.skills },
      },
    });
  }

  return { AND: and };
}

export function filtersToQueryString(filters: Record<string, string | string[] | number | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) continue;
    if (Array.isArray(value)) params.set(key, value.join(","));
    else params.set(key, String(value));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}
