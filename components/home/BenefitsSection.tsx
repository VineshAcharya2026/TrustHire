import { Check } from "lucide-react";
import { BENEFITS } from "@/components/home/landingContent";

function BenefitText({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight || !text.includes(highlight)) {
    return <span>{text}</span>;
  }
  const [before, after] = text.split(highlight);
  return (
    <span>
      {before}
      <strong className="font-semibold text-landing-orange">{highlight}</strong>
      {after}
    </span>
  );
}

export function BenefitsSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-start">
        <div>
          <h2 className="text-2xl font-bold text-landing-navy md:text-3xl">
            Benefits of partnering with{" "}
            <span className="text-landing-orange">TrustHire</span>
          </h2>
          <p className="mt-4 text-muted">
            A complete referral hiring platform built for Indian businesses — with
            mentorship, milestone payouts, and admin-backed trust.
          </p>
        </div>

        <ul className="space-y-4">
          {BENEFITS.map((item) => (
            <li key={item.text} className="flex gap-3 text-sm leading-relaxed text-landing-navy/90">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-landing-orange text-white">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <BenefitText text={item.text} highlight={item.highlight} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
