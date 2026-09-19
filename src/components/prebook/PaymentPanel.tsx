import Image from "next/image";
import CopyUpiId from "@/components/prebook/CopyUpiId";
import { PREBOOK_AMOUNT, UPI_PAYEE, UPI_QR_SVG, prebookCopy } from "@/data/prebook";

/**
 * ₹499 payment step. Scan the QR, or copy the VPA and pay from inside a UPI app.
 *
 * Deliberately not led by a `upi://pay` button: NPCI blocks browser-initiated
 * intents to a personal (P2P) VPA, so that button fails for most payers. See
 * CopyUpiId.tsx, which keeps it as a secondary link.
 */
export default function PaymentPanel() {
  return (
    <div className="glass-raised glass-sheen overflow-hidden rounded-2xl">
      <div className="relative grid gap-10 p-6 sm:p-10 md:grid-cols-[auto_1fr] md:items-center md:gap-12">
        <div className="mx-auto w-full max-w-[16rem] md:mx-0">
          <div className="rounded-xl bg-dharma-parchment-light p-4 shadow-card">
            <Image
              src={UPI_QR_SVG}
              alt={`UPI QR code to pay ₹${PREBOOK_AMOUNT} to ${UPI_PAYEE.name}`}
              width={256}
              height={256}
              unoptimized
              className="size-full"
            />
          </div>
          <p className="mt-4 text-center font-mono text-caption text-fg-subtle md:text-left">
            {UPI_PAYEE.vpa} · {UPI_PAYEE.name}
          </p>
        </div>

        <div className="min-w-0">
          <p className="eyebrow text-dharma-gold-400">Step one</p>
          <h2 className="mt-4 font-dharma-display text-display-sm text-gradient-gold">
            {prebookCopy.payTitle}
          </h2>
          <p className="mt-4 max-w-prose text-body-lg text-fg-muted text-pretty">
            {prebookCopy.payLead}
          </p>

          <ol className="mt-8 space-y-3 text-body-lg text-fg-muted">
            {[
              "Scan the code, or copy the UPI ID below.",
              `Send exactly ₹${PREBOOK_AMOUNT} from any UPI app.`,
              "Note the reference number, then fill in the form.",
            ].map((step, i) => (
              <li key={step} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-1 grid size-7 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-caption text-dharma-gold-400"
                >
                  {i + 1}
                </span>
                <span className="text-pretty">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <CopyUpiId />
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 border-t border-line pt-8 sm:grid-cols-3">
            <div>
              <dt className="eyebrow">Amount</dt>
              <dd className="mt-2 font-dharma-display text-display-sm text-dharma-gold-300">₹{PREBOOK_AMOUNT}</dd>
            </div>
            <div>
              <dt className="eyebrow">Covers</dt>
              <dd className="mt-2 text-body-lg text-fg">One deck, held</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="eyebrow">Pay to</dt>
              <dd className="mt-2 text-body-lg text-fg">{UPI_PAYEE.name}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
