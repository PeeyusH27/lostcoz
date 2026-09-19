"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";
import { links } from "@/data/links";
import { enjoymentScale, fulfilments, genders, prebookCopy } from "@/data/prebook";
import { submitPrebooking } from "@/app/prebook/actions";
import { initialPrebookState } from "@/app/prebook/state";

const FAVOURITE_MAX = 1000;

/* Shared input chrome: a parchment-on-emerald field that lights up gold on focus. */
const fieldBase =
  "w-full rounded-lg border bg-canvas-deep/40 px-4 py-3 font-body text-body text-fg " +
  "placeholder:text-fg-subtle outline-none transition-[border-color,background-color,box-shadow] duration-300 " +
  "focus:border-accent focus:bg-canvas-deep/70 focus:shadow-[0_0_0_3px_rgb(201_162_78/0.16)]";

type WrapperProps = {
  label: string;
  error?: string;
  /** Must match the control's aria-describedby, or the message is never announced. */
  errorId?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
};

/** Label + optional inline error, wrapping any control. */
function Field({ label, htmlFor, error, errorId, hint, children, className }: WrapperProps & { htmlFor?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={htmlFor} className="eyebrow mb-3 block text-dharma-gold-400">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-2 text-body-sm text-fg-subtle">{hint}</p>}
      {error && (
        <p id={errorId} className="mt-2 text-body-sm text-dharma-crimson-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Same as Field, but for radio groups — a legend is what a screen reader needs there. */
function Group({ label, error, errorId, hint, children, className }: WrapperProps) {
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="eyebrow mb-3 block text-dharma-gold-400">{label}</legend>
      {children}
      {hint && !error && <p className="mt-2 text-body-sm text-fg-subtle">{hint}</p>}
      {error && (
        <p id={errorId} className="mt-2 text-body-sm text-dharma-crimson-400" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "group/btn inline-flex h-14 w-full items-center justify-center gap-3 rounded-pill px-9",
        "bg-accent font-body text-sm font-bold uppercase tracking-[0.14em] text-fg-on-accent",
        "transition-[background-color,box-shadow,opacity] duration-300 ease-out-expo",
        "hover:bg-accent-hover hover:shadow-glow-gold active:scale-[0.97]",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none sm:w-auto",
      )}
    >
      <span>{pending ? "Reserving…" : "Pre Book"}</span>
      <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-1">
        →
      </span>
    </button>
  );
}

export default function PrebookForm() {
  const [state, formAction] = useActionState(submitPrebooking, initialPrebookState);
  const id = useId();

  // Controlled so a validation round-trip doesn't wipe what was typed:
  // React resets an uncontrolled form once the action settles.
  const [values, setValues] = useState({
    name: "", phone: "", age: "", gender: "", enjoyment: "",
    favourite: "", fulfilment: "", address: "", upi_reference: "",
  });
  const set = (key: keyof typeof values) => (value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const errors = state.errors ?? {};
  const err = (field: string) => errors[field];
  const describedBy = (field: string) => (err(field) ? `${id}-${field}-error` : undefined);

  if (state.status === "success" || state.status === "duplicate") {
    const done = state.status === "success";
    return (
      <div className="glass-raised glass-sheen rounded-2xl p-8 text-center sm:p-12">
        <p aria-hidden="true" className="text-display-sm text-dharma-gold-400">
          {done ? "✦" : "◆"}
        </p>
        <h3 className="mt-4 font-dharma-display text-display-sm text-gradient-gold">
          {done ? prebookCopy.successTitle : prebookCopy.duplicateTitle}
        </h3>
        <p className="mx-auto mt-4 max-w-prose text-body-lg text-fg-muted text-pretty">
          {done ? prebookCopy.successBody : prebookCopy.duplicateBody}
        </p>
        <a
          href={links.whatsappCommunity}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-pill border border-line-strong px-7 font-body text-xs font-bold uppercase tracking-[0.14em] text-fg transition-colors duration-300 hover:bg-fg hover:text-fg-inverse"
        >
          Join the WhatsApp community
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="glass-panel glass-sheen rounded-2xl p-6 sm:p-10">
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Two columns at every width: Age and Gender share a row even on a phone,
          which is why Gender is a select rather than the wider pill row. */}
      <div className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-8">
        <Field label="Name" htmlFor={`${id}-name`} error={err("name")} errorId={describedBy("name")} className="col-span-2 sm:col-span-1">
          <input
            id={`${id}-name`} name="name" type="text" autoComplete="name" required
            maxLength={80} placeholder="Your full name"
            value={values.name} onChange={(e) => set("name")(e.target.value)}
            aria-invalid={!!err("name")} aria-describedby={describedBy("name")}
            className={cn(fieldBase, err("name") ? "border-dharma-crimson-400" : "border-line")}
          />
        </Field>

        <Field
          label="Mobile number"
          htmlFor={`${id}-phone`}
          error={err("phone")} errorId={describedBy("phone")}
          hint="We message pre-booking updates here."
          className="col-span-2 sm:col-span-1"
        >
          <div className="flex items-stretch">
            <span className="inline-flex shrink-0 items-center rounded-l-lg border border-r-0 border-line bg-canvas-deep/60 px-4 font-mono text-body-sm text-fg-subtle">
              +91
            </span>
            <input
              id={`${id}-phone`} name="phone" type="tel" inputMode="numeric" autoComplete="tel-national"
              required maxLength={14} placeholder="98765 43210"
              value={values.phone} onChange={(e) => set("phone")(e.target.value)}
              aria-invalid={!!err("phone")} aria-describedby={describedBy("phone")}
              className={cn(fieldBase, "rounded-l-none", err("phone") ? "border-dharma-crimson-400" : "border-line")}
            />
          </div>
        </Field>

        <Field label="Age" htmlFor={`${id}-age`} error={err("age")} errorId={describedBy("age")}>
          <input
            id={`${id}-age`} name="age" type="number" inputMode="numeric" required min={12} max={120}
            placeholder="24"
            value={values.age} onChange={(e) => set("age")(e.target.value)}
            aria-invalid={!!err("age")} aria-describedby={describedBy("age")}
            className={cn(fieldBase, err("age") ? "border-dharma-crimson-400" : "border-line")}
          />
        </Field>

        <Field label="Gender" htmlFor={`${id}-gender`} error={err("gender")} errorId={describedBy("gender")}>
          <div className="relative">
            <select
              id={`${id}-gender`} name="gender" required
              value={values.gender} onChange={(e) => set("gender")(e.target.value)}
              aria-invalid={!!err("gender")} aria-describedby={describedBy("gender")}
              className={cn(
                fieldBase,
                // room for the chevron, and no native arrow doubling up with ours
                "cursor-pointer appearance-none pr-10",
                values.gender ? "text-fg" : "text-fg-subtle",
                err("gender") ? "border-dharma-crimson-400" : "border-line",
              )}
            >
              <option value="" disabled>
                Select
              </option>
              {genders.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-body-sm text-fg-subtle"
            >
              ▾
            </span>
          </div>
        </Field>

        <Group
          label="How much did you enjoy the game?"
          error={err("enjoyment")} errorId={describedBy("enjoyment")}
          className="col-span-2"
        >
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
            {Array.from({ length: enjoymentScale.max - enjoymentScale.min + 1 }, (_, i) => enjoymentScale.min + i).map((n) => (
              <label key={n} className="cursor-pointer">
                <input
                  type="radio" name="enjoyment" value={n} required className="peer sr-only"
                  checked={values.enjoyment === String(n)}
                  onChange={() => set("enjoyment")(String(n))}
                />
                <span
                  className={cn(
                    "grid aspect-square min-h-11 w-full place-items-center rounded-lg border border-line",
                    "font-dharma-display text-title text-fg-muted transition-colors duration-300",
                    "hover:border-line-strong hover:text-fg",
                    "peer-checked:border-accent peer-checked:bg-accent peer-checked:text-fg-on-accent",
                    "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
                  )}
                >
                  {n}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-body-sm text-fg-subtle">
            <span>{enjoymentScale.minLabel}</span>
            <span>{enjoymentScale.maxLabel}</span>
          </div>
        </Group>

        <Field
          label="Your favourite thing about the game?"
          htmlFor={`${id}-favourite`}
          error={err("favourite")} errorId={describedBy("favourite")}
          className="col-span-2"
        >
          <textarea
            id={`${id}-favourite`} name="favourite" required rows={4} maxLength={FAVOURITE_MAX}
            placeholder="The bluffing, the art, the moment someone got caught…"
            value={values.favourite} onChange={(e) => set("favourite")(e.target.value)}
            aria-invalid={!!err("favourite")} aria-describedby={describedBy("favourite")}
            className={cn(fieldBase, "resize-y", err("favourite") ? "border-dharma-crimson-400" : "border-line")}
          />
          <p className="mt-2 text-right font-mono text-caption text-fg-subtle" aria-hidden="true">
            {values.favourite.length}/{FAVOURITE_MAX}
          </p>
        </Field>

        <Group label="Pickup or delivery?" error={err("fulfilment")} errorId={describedBy("fulfilment")} className="col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {fulfilments.map((f) => (
              <label key={f.value} className="cursor-pointer">
                <input
                  type="radio" name="fulfilment" value={f.value} required className="peer sr-only"
                  checked={values.fulfilment === f.value}
                  onChange={() => set("fulfilment")(f.value)}
                />
                <span
                  className={cn(
                    "flex h-full flex-col justify-center rounded-xl border border-line bg-canvas-deep/30 p-5",
                    "transition-[border-color,background-color,box-shadow] duration-300",
                    "hover:border-line-strong",
                    "peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:shadow-[0_0_0_1px_var(--color-accent)]",
                    "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
                  )}
                >
                  <span className="font-dharma-display text-title text-fg">{f.label}</span>
                  <span className="mt-1 text-body-sm text-fg-muted">{f.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </Group>

        {values.fulfilment === "delivery" && (
          <Field
            label="Delivery address"
            htmlFor={`${id}-address`}
            error={err("address")} errorId={describedBy("address")}
            hint="Street, area, city, state and PIN code."
            className="col-span-2"
          >
            <textarea
              id={`${id}-address`} name="address" rows={3} maxLength={500} required
              autoComplete="street-address"
              placeholder="Flat / house, street, area, city, state, PIN"
              value={values.address} onChange={(e) => set("address")(e.target.value)}
              aria-invalid={!!err("address")} aria-describedby={describedBy("address")}
              className={cn(fieldBase, "resize-y", err("address") ? "border-dharma-crimson-400" : "border-line")}
            />
          </Field>
        )}

        <Field
          label="UPI reference number"
          htmlFor={`${id}-upi`}
          error={err("upi_reference")} errorId={describedBy("upi_reference")}
          hint="Optional, but it lets us match your ₹499 to this entry in seconds."
          className="col-span-2"
        >
          <input
            id={`${id}-upi`} name="upi_reference" type="text" inputMode="numeric" maxLength={40}
            placeholder="12-digit UTR from your UPI app"
            value={values.upi_reference} onChange={(e) => set("upi_reference")(e.target.value)}
            aria-invalid={!!err("upi_reference")} aria-describedby={describedBy("upi_reference")}
            className={cn(fieldBase, err("upi_reference") ? "border-dharma-crimson-400" : "border-line")}
          />
        </Field>
      </div>

      {state.message && (
        <p role="alert" className="mt-8 rounded-lg border border-dharma-crimson-400/50 bg-dharma-crimson-900/40 px-4 py-3 text-body-sm text-fg">
          {state.message}
        </p>
      )}

      <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <SubmitButton />
        <p className="text-body-sm text-fg-subtle">
          One entry per number. Pay the ₹499 before you submit.
        </p>
      </div>
    </form>
  );
}
