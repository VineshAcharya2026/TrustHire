import Link from "next/link";
import { Briefcase, Linkedin, Mail, Twitter } from "lucide-react";
import { FOOTER_LINKS } from "@/components/home/landingContent";

export function LandingFooter() {
  return (
    <footer>
      <div className="border-t border-landing-blue/10 bg-white py-12">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-landing-blue">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-landing-navy">TrustHire</span>
            </div>
            <p className="mt-3 text-sm text-muted">{FOOTER_LINKS.contact.tagline}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-landing-navy">
              Quick links
            </h3>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.quick.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-landing-blue"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-landing-navy">
              Get in touch
            </h3>
            <a
              href={`mailto:${FOOTER_LINKS.contact.email}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-landing-blue"
            >
              <Mail className="h-4 w-4" />
              {FOOTER_LINKS.contact.email}
            </a>
            <div className="mt-4 flex gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-landing-blueLight text-landing-blue">
                <Linkedin className="h-4 w-4" />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-landing-blueLight text-landing-blue">
                <Twitter className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-landing-navy px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-xs leading-relaxed text-white/70">
            TrustHire is a mentorship platform connecting mentors and mentees.
            Mentorship requests and platform access are subject to super admin oversight and platform terms.
            Demo accounts available for evaluation.
          </p>
          <p className="mt-4 text-center text-xs text-white/50">
            © {new Date().getFullYear()} TrustHire. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
