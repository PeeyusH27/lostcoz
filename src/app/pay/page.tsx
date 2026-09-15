"use client";
import { useEffect } from "react";

/** upi://pay deep link only opens a UPI app on Android; elsewhere it just does nothing. */
const UPI_LINK = "upi://pay?pa=8178311050%40ybl&pn=Bhavya%20Das&cu=INR";

export default function PayPage() {
  useEffect(() => {
    window.location.href = UPI_LINK;
  }, []);

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-6 px-gutter py-section text-center">
      <p className="eyebrow text-fg-muted">Redirecting to your UPI app…</p>
      <a
        href={UPI_LINK}
        className="inline-flex min-h-11 items-center justify-center rounded-pill bg-accent px-7 font-body text-xs font-bold uppercase tracking-[0.14em] text-fg-on-accent"
      >
        Open UPI app
      </a>
      <p className="max-w-prose text-body-sm text-fg-subtle">
        Nothing happened? Tap the button above. This only works on a phone with a UPI app installed.
      </p>
    </main>
  );
}
