import Image from "next/image";
import CopyUpiId from "@/components/prebook/CopyUpiId";
import { MEET_PRICE, MEET_UPI_INTENT, MEET_UPI_PAYEE, MEET_UPI_QR_SVG, meetCopy } from "@/data/meet";

/**
 * Payment step for the meet. Same flow as the pre-booking panel, but the QR
 * carries no amount: the payer enters ₹99 × the number of people themselves.
 */
export default function MeetPaymentPanel() {
  return (
    <div className="glass-raised glass-sheen overflow-hidden rounded-2xl">
      <div aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full bg-brand-orange/25 blur-3xl" />
      <div className="relative grid gap-10 p-6 sm:p-10 md:grid-cols-[auto_1fr] md:items-center md:gap-12">
        <div className="mx-auto w-full max-w-[16rem] md:mx-0">
          <div className="rounded-xl bg-brand-cream p-4 shadow-card">
            <Image
              src={MEET_UPI_QR_SVG}
              alt={`UPI QR code to pay ${MEET_UPI_PAYEE.name}`}
              width={256}
              height={256}
              unoptimized
              className="size-full"
            />
          </div>
          <p className="mt-4 text-center font-mono text-caption text-fg-subtle md:text-left">
            {MEET_UPI_PAYEE.vpa} · {MEET_UPI_PAYEE.name}
          </p>
        </div>

        <div className="min-w-0">
          <p className="eyebrow text-brand-orange">Step one · pay</p>
          <h2 className="mt-4 font-display text-display-sm uppercase">{meetCopy.payTitle}</h2>
          <p className="mt-4 max-w-prose text-body-lg text-fg-muted text-pretty">{meetCopy.payLead}</p>

          <ol className="mt-8 space-y-3 text-body-lg text-fg-muted">
            {[
              "Scan the code, or copy the UPI ID below.",
              `Send ₹${MEET_PRICE} for each person you’re registering.`,
              "Screenshot the confirmation, then register below.",
            ].map((step, i) => (
              <li key={step} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-1 grid size-7 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-caption text-brand-orange"
                >
                  {i + 1}
                </span>
                <span className="text-pretty">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <CopyUpiId vpa={MEET_UPI_PAYEE.vpa} intent={MEET_UPI_INTENT} amount={null} tone="brand" />
          </div>
        </div>
      </div>
    </div>
  );
}
