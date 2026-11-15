import Image from "next/image";
import CopyUpiId from "@/components/prebook/CopyUpiId";
import { CHRISTMAS } from "@/data/christmas";
import { MEET_UPI_INTENT, MEET_UPI_PAYEE, MEET_UPI_QR_SVG } from "@/data/meet";

/** Step one: the UPI card. Sticks beside the form on desktop. */
export default function ChristmasPay() {
  const price = CHRISTMAS.price.toLocaleString("en-IN");
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#f6c96b]/40 bg-gradient-to-b from-[#12503a] to-[#0b2a20] p-6 shadow-[0_30px_70px_-30px_rgb(0_0_0/0.8)] sm:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-[#f6c96b]/20 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-full bg-[#f6c96b] font-display text-sm text-[#5b1220]">1</span>
          <p className="eyebrow text-[#f6c96b]">Pay via UPI</p>
        </div>
        <p className="mt-5 font-display text-[clamp(2.4rem,1.6rem+3vw,3.5rem)] font-extrabold uppercase leading-none text-[#fff6e6]">
          ₹{price}
          <span className="ml-2 text-base font-bold tracking-wide text-[#f6e9d4]/70">/ person</span>
        </p>

        <div className="mx-auto mt-6 w-full max-w-[15rem] rounded-2xl bg-[#fff6e6] p-3 shadow-card">
          <Image src={MEET_UPI_QR_SVG} alt={`UPI QR code to pay ${MEET_UPI_PAYEE.name}`} width={256} height={256} unoptimized className="size-full" />
        </div>
        <p className="mt-3 text-center font-mono text-caption text-[#f6e9d4]/60">
          {MEET_UPI_PAYEE.vpa} · {MEET_UPI_PAYEE.name}
        </p>

        <ol className="mt-6 space-y-2.5 text-body-sm text-[#f6e9d4]/80">
          {[
            "Scan the QR, or copy the UPI ID below.",
            `Send ₹${price} × the number of people.`,
            "Screenshot the confirmation for the form.",
          ].map((t, i) => (
            <li key={t} className="flex gap-3">
              <span aria-hidden="true" className="mt-0.5 font-mono text-caption text-[#f6c96b]">0{i + 1}</span>
              <span className="text-pretty">{t}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6">
          <CopyUpiId vpa={MEET_UPI_PAYEE.vpa} intent={MEET_UPI_INTENT} amount={null} tone="brand" />
        </div>
      </div>
    </div>
  );
}
