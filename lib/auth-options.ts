import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
            include: { profile: true },
          });
          if (!user) return null;

          const valid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!valid) return null;

          if (user.status === "PENDING") {
            throw new Error("PENDING_APPROVAL");
          }
          if (user.status === "SUSPENDED") {
            throw new Error("ACCOUNT_SUSPENDED");
          }
          if (user.status === "FROZEN") {
            throw new Error("ACCOUNT_FROZEN");
          }
          if (user.status === "DELETED") {
            throw new Error("ACCOUNT_DELETED");
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
            name: user.profile
              ? `${user.profile.firstName} ${user.profile.lastName}`
              : user.email,
          };
        } catch (error) {
          if (
            error instanceof Error &&
            (error.message.startsWith("ACCOUNT_") || error.message === "PENDING_APPROVAL")
          ) {
            throw error;
          }
          console.error("[auth] authorize failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
      }
      return session;
    },
  },
};
