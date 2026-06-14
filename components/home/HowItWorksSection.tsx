import { HOW_IT_WORKS_STEPS } from "@/components/home/landingContent";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-bold text-landing-navy md:text-3xl">
          How to <span className="text-landing-orange">refer on TrustHire?</span>
        </h2>

        <div className="relative mx-auto mt-14 max-w-4xl">
          <div
            className="absolute left-0 right-0 top-8 hidden h-0.5 border-t-2 border-dashed border-landing-orange/40 md:block"
            aria-hidden
          />

          <div className="grid gap-10 md:grid-cols-3 md:gap-6">
            {HOW_IT_WORKS_STEPS.map((item) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-landing-orange text-2xl font-bold text-white shadow-lg ring-4 ring-landing-orangeLight">
                  {item.step}
                </div>
                <h3 className="mt-5 text-base font-bold text-landing-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
