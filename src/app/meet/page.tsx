import type { Metadata } from "next";
import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import MeetForm from "@/components/meet/MeetForm";
import MeetPaymentPanel from "@/components/meet/MeetPaymentPanel";
import { contact, links } from "@/data/links";
import { MEET_EVENT, MEET_PRICE, meetCopy } from "@/data/meet";

export const metadata: Metadata = {
  title: MEET_EVENT.title,
  description: `${MEET_EVENT.dateLabel}, ${MEET_EVENT.timeLabel} at ${MEET_EVENT.venue}, ${MEET_EVENT.area}. Board games, chaos and one unreleased game, for ₹${MEET_PRICE}. Register here.`,
  openGraph: { images: ["/photos/lostcoz-gamenight.jpg"] },
  robots: { index: true, follow: true },
};

const facts = [
  { term: "Date", value: MEET_EVENT.dateLabel },
  { term: "Time", value: MEET_EVENT.timeLabel },
  { term: "Venue", value: `${MEET_EVENT.venue}, ${MEET_EVENT.area}`, href: links.meetVenueMap, cta: "Open in Maps" },
  { term: "Entry", value: `₹${MEET_PRICE} per person` },
];

export default function MeetPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-canvas-deep px-gutter pb-16 pt-32 grain sm:pb-24 sm:pt-40">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-[70vh] lamp-glow" />
          <div className="absolute -left-[14%] top-[10%] size-[52vw] rounded-full bg-brand-purple/30 blur-[130px]" />
          <div className="absolute -right-[12%] bottom-[-20%] size-[46vw] rounded-full bg-brand-orange/25 blur-[140px]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,var(--color-canvas)_100%)]" />
        </div>

        <div className="relative z-[2] mx-auto max-w-content">
          <Reveal as="p" y={16} className="eyebrow mb-8 text-brand-orange">
            {meetCopy.eyebrow}
          </Reveal>
          <h1 className="font-display text-display-lg uppercase text-balance sm:text-display-xl">
            <SplitReveal as="span" mode="lines" immediate className="block">
              Board games
            </SplitReveal>
            <span className="block pb-[0.12em] text-gradient-arc">community meet</span>
          </h1>

          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1.1fr_1fr] md:gap-12">
            <Reveal y={24} delay={0.2} stagger={0.1} className="min-w-0">
              <p className="max-w-prose text-body-xl text-fg text-pretty">{meetCopy.lead}</p>
              {meetCopy.about.map((para) => (
                <p key={para} className="mt-5 max-w-prose text-body-lg text-fg-muted text-pretty">
                  {para}
                </p>
              ))}
              <p className="mt-8 text-body-sm text-fg-subtle">
                Questions?{" "}
                <a href={links.whatsappDirect} target="_blank" rel="noreferrer" className="text-fg underline underline-offset-4 hover:text-brand-orange">
                  {contact.phoneDisplay}
                </a>{" "}
                or{" "}
                <a href={links.email} className="text-fg underline underline-offset-4 hover:text-brand-orange">
                  {contact.email}
                </a>
              </p>
            </Reveal>

            <Reveal y={32} delay={0.3}>
              {/* gap-px over a hairline-coloured fill draws the grid rules between cells */}
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-[0_24px_60px_-24px_rgb(0_0_0/0.85)]">
                {facts.map((f) => (
                  <div key={f.term} className="bg-canvas-deep/90 p-5 backdrop-blur-xl sm:p-6">
                    <dt className="eyebrow">{f.term}</dt>
                    <dd className="mt-2 font-display text-body-lg uppercase leading-tight text-fg sm:text-title">{f.value}</dd>
                    {f.href && (
                      <a
                        href={f.href} target="_blank" rel="noreferrer"
                        className="group/map mt-2 inline-flex min-h-11 items-center gap-2 whitespace-nowrap font-body text-caption font-bold uppercase tracking-widest text-brand-orange"
                      >
                        {f.cta}
                        <span aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover/map:translate-x-1">→</span>
                      </a>
                    )}
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative px-gutter pb-section">
        <div className="relative z-[2] mx-auto flex max-w-content flex-col gap-12 sm:gap-16">
          <Reveal y={40}>
            <MeetPaymentPanel />
          </Reveal>

          <Reveal y={40}>
            <div id="register" className="scroll-mt-24">
              <p className="eyebrow text-brand-orange">Step two · register</p>
              <h2 className="mt-4 font-display text-display-sm uppercase">{meetCopy.formTitle}</h2>
              <p className="mt-4 max-w-prose text-body-lg text-fg-muted text-pretty">{meetCopy.formLead}</p>
            </div>
          </Reveal>

          <MeetForm />
        </div>
      </section>
    </>
  );
}
