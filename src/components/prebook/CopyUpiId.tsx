"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { PREBOOK_AMOUNT, UPI_INTENT, UPI_PAYEE } from "@/data/prebook";

/**
 * Copy-the-VPA is the primary payment action on a phone.
 *
 * NPCI blocks `upi://pay` intents that a browser hands to a UPI app when the
 * payee is a personal (P2P) VPA — the app answers "declined for security
 * reasons". Only a verified merchant (P2M) VPA may be paid that way. So the
 * button that reliably works is "copy the UPI ID, paste it in your app"; the
 * intent link stays as a quiet secondary for the apps that do accept it.
 */
export default function CopyUpiId() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2400);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(UPI_PAYEE.vpa);
      setFailed(false);
      setCopied(true);
    } catch {
      // Clipboard is blocked on insecure origins and in some in-app browsers.
      // The VPA is printed right below, so the fallback is "select it yourself".
      setFailed(true);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={copy}
        className={cn(
          "group/btn inline-flex h-14 w-full items-center justify-center gap-3 rounded-pill px-9",
          "font-body text-sm font-bold uppercase tracking-[0.14em]",
          "transition-[background-color,box-shadow] duration-300 ease-out-expo active:scale-[0.97]",
          copied
            ? "bg-dharma-emerald-300 text-fg-on-accent"
            : "bg-accent text-fg-on-accent hover:bg-accent-hover hover:shadow-glow-gold",
          "sm:w-auto",
        )}
      >
        <span>{copied ? "Copied ✓" : "Copy UPI ID"}</span>
        {!copied && (
          <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-1">
            →
          </span>
        )}
      </button>

      <p aria-live="polite" className="sr-only">
        {copied ? `${UPI_PAYEE.vpa} copied to clipboard` : ""}
      </p>

      <p className="mt-4 font-mono text-body-lg text-fg select-all">{UPI_PAYEE.vpa}</p>
      {failed && (
        <p className="mt-2 text-body-sm text-fg-subtle">
          Copying is blocked in this browser — press and hold the ID above to copy it.
        </p>
      )}

      <p className="mt-6 text-body-sm text-fg-subtle">
        Prefer to try your UPI app directly?{" "}
        <a href={UPI_INTENT} className="text-dharma-gold-400 underline underline-offset-4 hover:text-dharma-gold-300">
          Open it with ₹{PREBOOK_AMOUNT} pre-filled
        </a>
        . Some apps decline payment links to a personal UPI ID — if yours does, use the ID above.
      </p>
    </div>
  );
}
