import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators/auth";
import { isBlacklisted } from "@/lib/blacklist";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/utils";
import { sendAdminAlert } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const email = data.email.toLowerCase();

    if (await isBlacklisted(email, data.phone)) {
      return NextResponse.json(
        { error: "Your account cannot be created. Contact support." },
        { status: 403 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    if (data.role === "EMPLOYER" && !data.companyName) {
      return NextResponse.json({ error: "Company name is required for employers" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const ip = getClientIp(request);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email,
          phone: data.phone,
          passwordHash,
          role: data.role,
          status: "PENDING",
          profile: {
            create: { firstName: data.firstName, lastName: data.lastName },
          },
          ...(data.role === "EMPLOYER"
            ? {
                employer: {
                  create: {
                    companyName: data.companyName!,
                    website: data.website || undefined,
                  },
                },
              }
            : {}),
        },
        include: { profile: true },
      });
      return created;
    });

    await logAudit({
      userId: user.id,
      action: "USER_REGISTERED",
      entity: "User",
      entityId: user.id,
      ipAddress: ip,
      metadata: { role: data.role },
    });

    await sendAdminAlert(
      "New registration pending approval",
      `${data.firstName} ${data.lastName} (${data.role}) registered as ${email}`
    );

    return NextResponse.json({ id: user.id, status: user.status }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
