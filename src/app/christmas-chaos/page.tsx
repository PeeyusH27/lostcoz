import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import MeetForm from "@/components/meet/MeetForm";
import ChristmasPay from "@/components/christmas/ChristmasPay";
import SeatsLeft from "@/components/christmas/SeatsLeft";
import { getSeats } from "@/lib/seats";
import StickyReserve from "@/components/christmas/StickyReserve";
import { Confetti, SantaHat } from "@/components/christmas/ChristmasArt";
import { contact, links } from "@/data/links";
import ChristmasActivities from "@/components/christmas/ChristmasActivities";
import { CHRISTMAS, dressCode, registerCopy, touches } from "@/data/christmas";

export const metadata: Metadata = {
  title: CHRISTMAS.title,
  description: `${CHRISTMAS.tagline} ${CHRISTMAS.windowLabel}, ₹${CHRISTMAS.price.toLocaleString("en-IN")} per person. Games, Christmas Mafia, secret missions, karaoke and awards.`,
  openGraph: { images: ["/photos/christmas-santa.jpg"] },
  robots: { index: true, follow: true },
};

const price = `₹${CHRISTMAS.price.toLocaleString("en-IN")}`;

const facts = [
  { term: "Date", value: CHRISTMAS.dateLabel ?? "Soon" },
  { term: "Venue", value: CHRISTMAS.venue ?? "To be announced" },
  { term: "Time", value: CHRISTMAS.windowLabel },
  { term: "Entry", value: `${price} / person` },
];

export const revalidate = 30;

export default async function ChristmasChaosPage() {
  const seats = await getSeats(CHRISTMAS.slug);
  const soldOut = seats?.left === 0;
  return (
    <>
      <StickyReserve />

      {/* Hero */}
      <section className="xmas-promo relative overflow-hidden px-gutter pb-12 pt-24 sm:pb-20 sm:pt-36" style={{ animation: "none" }}>
        <Confetti />
        <div className="relative z-[2] mx-auto grid max-w-wide items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="xmas-glass inline-flex rounded-full px-4 py-2 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#ffe7a8]">
              Lostcoz presents · hosted house party
            </p>
            <h1 className="mt-9 font-display sm:mt-10 text-[clamp(2.8rem,1.2rem+7vw,6.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.035em] text-[#fff6e6]">
              <span className="relative inline-block">
                <SantaHat className="absolute -left-[0.14em] -top-[0.4em] w-[0.58em] -rotate-[16deg]" />
                Christmas
              </span>
              <span className="xmas-gold-text block pb-[0.06em]">Chaos</span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-body-lg sm:mt-6 sm:text-body-xl text-pretty text-[#f6e9d4] lg:mx-0">
              Games, music, food and friendly competition, with secret missions, Christmas Mafia and karaoke till late.
            </p>

            <dl className="xmas-glass mx-auto mt-8 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#f6e9d4]/20 sm:grid-cols-4 lg:mx-0">
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
            <SeatsLeft seats={seats} total={CHRISTMAS.seats} className="mt-6 items-center lg:items-start" />
          </div>

          <div className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
            <div className="xmas-ticket xmas-float">
              <div className="xmas-zig">
                <div className="xmas-punch relative aspect-[5/4] bg-[#3d0c16] sm:aspect-[4/5]">
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

      {/* Activities */}
      <section id="plan" className="relative scroll-mt-20 overflow-hidden bg-[#0d0a14] px-gutter py-section-sm">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-72 w-[48rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(249_168_37/0.22),transparent)]" />
        <div className="relative mx-auto max-w-wide">
          <Reveal y={28} className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[#f6c96b]">This Christmas</p>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,1rem+4vw,3.75rem)] font-bold uppercase leading-[1.02] text-[#fff6e6]">
              One of your friends is <span className="text-[#f2427d]">lying.</span>
            </h2>
            <p className="mt-4 text-body-md text-pretty text-[#f6e9d4]/75 sm:text-body-lg">Six things happening on the night. Swipe through the deck, or hover a card to flip it.</p>
          </Reveal>

          <ChristmasActivities />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {touches.map((t) => (
              <span key={t.name} className="rounded-full border border-[#f6e9d4]/20 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#f6e9d4]/80">{t.name}</span>
            ))}
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-center text-body-sm text-pretty text-[#f6e9d4]/60">
            <strong className="text-[#f6e9d4]/80">Dress code:</strong> {dressCode}
          </p>
        </div>
      </section>

      {/* Register */}
      <section id="register" className="scroll-mt-16 bg-[#0b2a20] px-gutter py-section-sm">
        <div className="mx-auto max-w-wide">
          <Reveal y={28} className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[#f6c96b]">Reserve your spot</p>
            <h2 className="mt-3 font-display text-display-md uppercase text-[#fff6e6]">Pay, then register</h2>
            <SeatsLeft seats={seats} total={CHRISTMAS.seats} className="mt-4 items-center" />
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
              {soldOut ? (
                <div className="rounded-3xl border border-[#f6e9d4]/20 bg-[#f6e9d4]/[0.05] p-8 text-center">
                  <p className="font-display text-display-sm uppercase text-[#fff6e6]">Sold out</p>
                  <p className="mx-auto mt-3 max-w-md text-body-lg text-pretty text-[#f6e9d4]/75">All {CHRISTMAS.seats} seats are taken. Message us on WhatsApp to join the waitlist.</p>
                  <div className="mt-6 flex justify-center"><Button href={links.whatsappDirect} variant="inverse" magnetic={false}>Join the waitlist</Button></div>
                </div>
              ) : (
                <MeetForm event={CHRISTMAS.slug} price={CHRISTMAS.price} />
              )}
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
