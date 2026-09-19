import Image from "next/image";
import { PREBOOK_AMOUNT, UPI_INTENT, UPI_PAYEE, UPI_QR_SVG, prebookCopy } from "@/data/prebook";

/**
 * ₹499 payment step. Two ways in, because a `upi://` intent only resolves on a
 * phone with a UPI app installed — on a laptop the QR is the only route.
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

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
            <a
              href={UPI_INTENT}
              className="group/btn inline-flex h-14 items-center justify-center gap-3 rounded-pill bg-accent px-9 font-body text-sm font-bold uppercase tracking-[0.14em] text-fg-on-accent transition-[background-color,box-shadow] duration-300 ease-out-expo hover:bg-accent-hover hover:shadow-glow-gold active:scale-[0.97]"
            >
              <span>Pay ₹{PREBOOK_AMOUNT} by UPI</span>
              <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-1">
                →
              </span>
            </a>
            <p className="text-body-sm text-fg-subtle">
              Opens GPay, PhonePe, Paytm or any UPI app on your phone.
            </p>
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
