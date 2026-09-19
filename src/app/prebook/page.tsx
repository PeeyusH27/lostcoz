import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import PaymentPanel from "@/components/prebook/PaymentPanel";
import PrebookForm from "@/components/prebook/PrebookForm";
import { PREBOOK_AMOUNT, prebookCopy } from "@/data/prebook";

export const metadata: Metadata = {
  title: "Pre-book Order of Dharma",
  description: `Reserve a deck from the first print run of Order of Dharma for ₹${PREBOOK_AMOUNT}. Tell us how the game played, pay by UPI, and we hold one in your name.`,
  openGraph: { images: ["/cards/backs/clan-back.jpg"] },
  robots: { index: true, follow: true },
};

export default function PrebookPage() {
  return (
    <div className="theme-dharma">
      <section className="relative overflow-hidden px-gutter pb-16 pt-32 grain sm:pt-40">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src="/textures/velvet-emerald.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgb(201_162_78/0.22),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,var(--color-canvas)_100%)]" />
        </div>

        <div className="relative z-[2] mx-auto max-w-content">
          <Reveal as="p" y={16} className="eyebrow mb-8 text-dharma-gold-400">
            {prebookCopy.eyebrow}
          </Reveal>
          <SplitReveal
            as="h1"
            mode="lines"
            immediate
            className="max-w-[14ch] font-dharma-display text-display-xl text-gradient-gold text-balance"
          >
            {prebookCopy.title}
          </SplitReveal>
          <Reveal as="p" y={24} delay={0.2} className="mt-8 max-w-prose text-body-xl text-fg-muted text-pretty">
            {prebookCopy.lead}
          </Reveal>
        </div>
      </section>

      <section className="relative px-gutter pb-section">
        <div className="relative z-[2] mx-auto flex max-w-content flex-col gap-12 sm:gap-16">
          <Reveal y={40}>
            <PaymentPanel />
          </Reveal>

          <Reveal y={40}>
            <div>
              <p className="eyebrow text-dharma-gold-400">Step two</p>
              <h2 className="mt-4 font-dharma-display text-display-sm text-gradient-gold">
                {prebookCopy.formTitle}
              </h2>
              <p className="mt-4 max-w-prose text-body-lg text-fg-muted text-pretty">
                {prebookCopy.formLead}
              </p>
            </div>
          </Reveal>

          <PrebookForm />
        </div>
      </section>
    </div>
  );
}
