import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";

const roleRoutes: Record<string, Role> = {
  "/dashboard/admin": "ADMIN",
  "/dashboard/employer": "EMPLOYER",
  "/dashboard/referrer": "REFERRER",
};

function dashboardForRole(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "EMPLOYER":
      return "/dashboard/employer";
    case "REFERRER":
      return "/dashboard/referrer";
    default:
      return "/";
  }
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/dashboard/mentor") || path.startsWith("/dashboard/mentee")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token.status === "PENDING" && path !== "/pending-approval") {
      return NextResponse.redirect(new URL("/pending-approval", req.url));
    }

    for (const [prefix, requiredRole] of Object.entries(roleRoutes)) {
      if (path.startsWith(prefix) && token.role !== requiredRole) {
        return NextResponse.redirect(new URL(dashboardForRole(token.role as Role), req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const publicPaths = ["/login", "/register", "/pending-approval", "/"];
        if (publicPaths.some((p) => req.nextUrl.pathname === p || req.nextUrl.pathname.startsWith("/api/auth"))) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/pending-approval"],
};
