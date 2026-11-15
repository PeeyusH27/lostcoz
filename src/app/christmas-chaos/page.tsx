import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import MeetForm from "@/components/meet/MeetForm";
import ChristmasPay from "@/components/christmas/ChristmasPay";
import StickyReserve from "@/components/christmas/StickyReserve";
import { Confetti, SantaHat } from "@/components/christmas/ChristmasArt";
import { contact, links } from "@/data/links";
import { CHRISTMAS, dressCode, itinerary, itineraryIntro, pillars, registerCopy, touches } from "@/data/christmas";

export const metadata: Metadata = {
  title: CHRISTMAS.title,
  description: `${CHRISTMAS.tagline} ${CHRISTMAS.windowLabel}, ₹${CHRISTMAS.price.toLocaleString("en-IN")} per person. Games, Christmas Mafia, secret missions, karaoke and awards.`,
  openGraph: { images: ["/photos/christmas-santa.jpg"] },
  robots: { index: true, follow: true },
};

const price = `₹${CHRISTMAS.price.toLocaleString("en-IN")}`;

const facts = [
  { term: "Time", value: CHRISTMAS.windowLabel.replace(" – ", "–") },
  { term: "Entry", value: `${price} / person` },
  ...(CHRISTMAS.dateLabel ? [{ term: "Date", value: CHRISTMAS.dateLabel }] : []),
  ...(CHRISTMAS.venue ? [{ term: "Venue", value: CHRISTMAS.venue }] : []),
  { term: "Dress", value: "Festive & fun" },
];

export default function ChristmasChaosPage() {
  return (
    <>
      <StickyReserve />

      {/* Hero */}
      <section className="xmas-promo relative overflow-hidden px-gutter pb-14 pt-28 sm:pb-20 sm:pt-36" style={{ animation: "none" }}>
        <Confetti />
        <div className="relative z-[2] mx-auto grid max-w-wide items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="xmas-glass inline-flex rounded-full px-4 py-2 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#ffe7a8]">
              Lostcoz presents · hosted house party
            </p>
            <h1 className="mt-10 font-display text-[clamp(2.8rem,1.2rem+7vw,6.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.035em] text-[#fff6e6]">
              <span className="relative inline-block">
                <SantaHat className="absolute -left-[0.14em] -top-[0.4em] w-[0.58em] -rotate-[16deg]" />
                Christmas
              </span>
              <span className="xmas-gold-text block pb-[0.06em]">Chaos</span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-body-xl text-pretty text-[#f6e9d4] lg:mx-0">
              Games, music, food and friendly competition, with secret missions, Christmas Mafia and karaoke till late.
            </p>

            <dl className="xmas-glass mx-auto mt-8 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#f6e9d4]/20 sm:grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] lg:mx-0">
              {facts.map((f) => (
                <div key={f.term} className="bg-[#3d0c16]/70 p-4 text-left">
                  <dt className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-[#f6c96b]">{f.term}</dt>
                  <dd className="mt-1 font-display text-sm uppercase leading-tight text-[#fff6e6]">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button href="#register" variant="inverse" size="lg" magnetic={false}>Reserve · {price}</Button>
              <a href="#plan" className="px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#f6e9d4]/80 underline-offset-4 hover:text-[#fff6e6] hover:underline">
                See the plan
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm lg:max-w-none">
            <div className="xmas-ticket xmas-float">
              <div className="xmas-zig">
                <div className="xmas-punch relative aspect-[4/5] bg-[#3d0c16]">
                  <Image src="/photos/christmas-santa.jpg" alt="Santa in a mask holding a staff, lit by red fairy lights" fill priority sizes="(min-width: 1024px) 32rem, 90vw" className="object-cover object-[50%_20%]" />
                  <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(61_12_22/0.75)_100%)]" />
                  <p className="absolute inset-x-6 bottom-9 flex items-end justify-between text-[#fff6e6]">
                    <span className="font-display text-sm uppercase tracking-wider">Admit one</span>
                    <span className="font-display text-3xl font-extrabold text-[#f6c96b]">{price}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section id="plan" className="scroll-mt-20 bg-[#0b2a20] px-gutter py-section-sm">
        <div className="mx-auto max-w-wide">
          <Reveal y={28} className="grid gap-4 lg:grid-cols-[1fr_1.3fr] lg:items-end lg:gap-16">
            <div>
              <p className="eyebrow text-[#f6c96b]">The night</p>
              <h2 className="mt-3 font-display text-display-sm uppercase text-[#fff6e6]">Five acts, zero over-scheduling</h2>
            </div>
            <p className="text-body-lg text-pretty text-[#f6e9d4]/80">
              Hosts guide the room, but you always have space to mingle, play casually or take a break. Tabletop games stay open all night.
            </p>
          </Reveal>

          <Reveal y={28} className="mt-10">
            <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {pillars.map((p, i) => (
                <li key={p.name} className="rounded-2xl border border-[#f6e9d4]/15 bg-[#f6e9d4]/[0.04] p-5 last:col-span-2 sm:last:col-span-1">
                  <span className="font-display text-sm text-[#f6c96b]">0{i + 1}</span>
                  <p className="mt-2 font-display text-body-lg uppercase text-[#fff6e6]">{p.name}</p>
                  <p className="mt-1.5 text-body-sm text-[#f6e9d4]/70">{p.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal y={28} className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {touches.map((t) => (
              <div key={t.name} className="rounded-2xl bg-[#3d0c16]/60 p-5 ring-1 ring-[#f6c96b]/20">
                <p className="font-display text-sm uppercase text-[#f6c96b]">{t.name}</p>
                <p className="mt-2 text-body-sm text-pretty text-[#f6e9d4]/80">{t.text}</p>
              </div>
            ))}
          </Reveal>
          <p className="mt-6 max-w-3xl text-body-sm text-pretty text-[#f6e9d4]/65">
            <strong className="text-[#f6e9d4]">Dress code:</strong> {dressCode}
          </p>
        </div>
      </section>

      {/* Itinerary */}
      <section className="bg-[#3d0c16] px-gutter py-section-sm">
        <div className="mx-auto max-w-wide">
          <Reveal y={28} className="grid gap-4 lg:grid-cols-[1fr_1.3fr] lg:items-end lg:gap-16">
            <div>
              <p className="eyebrow text-[#f6c96b]">Itinerary</p>
              <h2 className="mt-3 font-display text-display-sm uppercase text-[#fff6e6]">7:30 PM to 1:00 AM</h2>
            </div>
            <p className="text-body-lg text-pretty text-[#f6e9d4]/80">{itineraryIntro}</p>
          </Reveal>
          <ol className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {itinerary.map((s, i) => (
              <li key={s.time} className="flex flex-col rounded-2xl border border-[#f6e9d4]/15 bg-[#f6e9d4]/[0.04] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-sm uppercase text-[#f6c96b]">{s.time}</p>
                  <span className="font-mono text-caption text-[#f6e9d4]/40">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-3 font-display text-body-lg uppercase text-[#fff6e6]">{s.title}</h3>
                <p className="mt-2 text-body-sm text-pretty text-[#f6e9d4]/70">{s.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Register */}
      <section id="register" className="scroll-mt-16 bg-[#0b2a20] px-gutter py-section-sm">
        <div className="mx-auto max-w-wide">
          <Reveal y={28} className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[#f6c96b]">Reserve your spot</p>
            <h2 className="mt-3 font-display text-display-md uppercase text-[#fff6e6]">Pay, then register</h2>
            <p className="mt-4 text-body-lg text-pretty text-[#f6e9d4]/80">{registerCopy.formLead}</p>
          </Reveal>

          <div className="mt-10 grid items-start gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
            <div className="lg:sticky lg:top-24">
              <ChristmasPay />
            </div>
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-full bg-[#f6c96b] font-display text-sm text-[#5b1220]">2</span>
                <p className="eyebrow text-[#f6c96b]">Your details</p>
              </div>
              <MeetForm event={CHRISTMAS.slug} price={CHRISTMAS.price} />
            </div>
          </div>

          <p className="mt-10 text-center text-body-sm text-fg-subtle">
            Questions?{" "}
            <a href={links.whatsappDirect} target="_blank" rel="noreferrer" className="text-fg underline underline-offset-4 hover:text-brand-orange">{contact.phoneDisplay}</a>{" "}
            or{" "}
            <a href={links.email} className="text-fg underline underline-offset-4 hover:text-brand-orange">{contact.email}</a>
          </p>
        </div>
      </section>
    </>
  );
}
