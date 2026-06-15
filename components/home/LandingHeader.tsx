"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { NAV_LINKS } from "@/components/home/landingContent";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-landing-blue/10 bg-white/95 shadow-subtle backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-landing-blue shadow-subtle">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-landing-navy">TrustHire</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-landing-navy/70 transition-colors hover:text-landing-blue"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/register"
            className="hidden rounded-md border-2 border-landing-blue px-4 py-2 text-sm font-semibold text-landing-blue transition-all hover:bg-landing-blueLight sm:inline-block"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-landing-blue px-4 py-2 text-sm font-semibold text-white shadow-subtle transition-all hover:bg-landing-blueDark"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
