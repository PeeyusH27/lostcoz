"use client";

import { useActionState, useId, useState } from "react";
import { cn } from "@/lib/cn";
import { links } from "@/data/links";
import {
  MEET_MAX_PEOPLE, MEET_PRICE, SCREENSHOT_PICK_MAX_MB, SCREENSHOT_TYPES, SCREENSHOT_UPLOAD_MAX_MB,
  ageRanges, heardFromSuggestions, meetCopy,
} from "@/data/meet";
import { submitMeetRegistration } from "@/app/meet/actions";
import { initialMeetState } from "@/app/meet/state";

/* Shared input chrome: cream-on-ink field that lights up orange on focus. */
const fieldBase =
  "w-full rounded-lg border bg-canvas-deep/40 px-4 py-3 font-body text-body text-fg " +
  "placeholder:text-fg-subtle outline-none transition-[border-color,background-color,box-shadow] duration-300 " +
  "focus:border-accent focus:bg-canvas-deep/70 focus:shadow-[0_0_0_3px_rgb(249_154_14/0.18)]";

const borderFor = (error?: string) => (error ? "border-state-danger" : "border-line");

/* Selectable pill/tile: a hidden radio or a button, lit orange when chosen. */
const choice =
  "cursor-pointer select-none rounded-lg border border-line bg-canvas-deep/30 text-fg-muted " +
  "transition-[border-color,background-color,color,box-shadow] duration-300 hover:border-line-strong hover:text-fg";
const chosen = "border-accent bg-accent/12 text-fg shadow-[0_0_0_1px_var(--color-accent)]";

type WrapperProps = {
  label: string;
  error?: string;
  /** Must match the control's aria-describedby, or the message is never announced. */
  errorId?: string;
  hint?: React.ReactNode;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
};

function Label({ label, optional }: { label: string; optional?: boolean }) {
  return (
    <>
      {label}
      {optional ? (
        <span className="ml-2 normal-case tracking-normal text-fg-subtle">(optional)</span>
      ) : (
        <span aria-hidden="true" className="ml-1 text-brand-orange">*</span>
      )}
    </>
  );
}

function Messages({ error, errorId, hint }: Pick<WrapperProps, "error" | "errorId" | "hint">) {
  return (
    <>
      {hint && !error && <p className="mt-2 text-body-sm text-fg-subtle">{hint}</p>}
      {error && (
        <p id={errorId} className="mt-2 text-body-sm text-magenta-300" role="alert">
          {error}
        </p>
      )}
    </>
  );
}

/** Label + optional inline error, wrapping any control. */
function Field({ label, htmlFor, optional, error, errorId, hint, children, className }: WrapperProps & { htmlFor?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={htmlFor} className="eyebrow mb-3 block">
        <Label label={label} optional={optional} />
      </label>
      {children}
      <Messages error={error} errorId={errorId} hint={hint} />
    </div>
  );
}

/** Same as Field, but for grouped controls — a legend is what a screen reader needs there. */
function Group({ label, optional, error, errorId, hint, children, className }: WrapperProps) {
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="eyebrow mb-3 block">
        <Label label={label} optional={optional} />
      </legend>
      {children}
      <Messages error={error} errorId={errorId} hint={hint} />
    </fieldset>
  );
}

function SubmitButton({ pending, total }: { pending: boolean; total: number }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "group/btn inline-flex h-14 w-full items-center justify-center gap-3 rounded-pill px-9",
        "bg-accent font-body text-sm font-bold uppercase tracking-[0.14em] text-fg-on-accent",
        "transition-[background-color,box-shadow,opacity] duration-300 ease-out-expo",
        "hover:bg-accent-hover hover:shadow-glow-orange active:scale-[0.97]",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none sm:w-auto",
      )}
    >
      <span>{pending ? "Registering…" : `Register · ₹${total}`}</span>
      <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-1">
        →
      </span>
    </button>
  );
}

const MB = 1024 * 1024;
const LONG_EDGE = 2000;

/**
 * Re-encodes a screenshot as a JPEG no longer than LONG_EDGE px, which takes a
 * 3–8 MB phone PNG down to a few hundred KB — small enough to post through a
 * Server Action. Returns the original when the browser can't decode it (HEIC
 * outside Safari) or when re-encoding wouldn't make it smaller.
 */
async function shrink(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, LONG_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff"; // transparent PNG areas would otherwise turn black
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export default function MeetForm() {
  const [state, formAction, pending] = useActionState(submitMeetRegistration, initialMeetState);
  const id = useId();

  // Controlled so a validation round-trip doesn't wipe what was typed:
  // React resets an uncontrolled form once the action settles.
  const [values, setValues] = useState({
    name: "", whatsapp: "", age_range: "", organisation: "", heard_from: "", favourite_game: "",
  });
  const set = (key: keyof typeof values) => (value: string) => setValues((v) => ({ ...v, [key]: value }));

  const [people, setPeople] = useState(1);
  const clampPeople = (n: number) => Math.min(MEET_MAX_PEOPLE, Math.max(1, Math.round(n) || 1));
  const total = people * MEET_PRICE;

  // The screenshot lives in state, not in the file input, for the same reason as
  // `values`: the input would be emptied after a failed submit. It is appended
  // to the FormData in `submit` below.
  const [shot, setShot] = useState<{ file: File; preview: string } | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const screenshot = shot?.file ?? null;

  function replaceShot(file: File | null) {
    if (shot) URL.revokeObjectURL(shot.preview);
    setShot(file ? { file, preview: URL.createObjectURL(file) } : null);
    setPreviewFailed(false);
  }

  async function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    e.target.value = ""; // let the same file be picked again after removing it
    if (!picked) return;
    setFileError(null);
    if (!(SCREENSHOT_TYPES as readonly string[]).includes(picked.type)) {
      return setFileError("Upload a JPG, PNG, WebP or HEIC image.");
    }
    if (picked.size > SCREENSHOT_PICK_MAX_MB * MB) {
      return setFileError(`That file is over ${SCREENSHOT_PICK_MAX_MB} MB. Try a cropped screenshot.`);
    }
    setProcessing(true);
    const file = await shrink(picked);
    setProcessing(false);
    if (file.size > SCREENSHOT_UPLOAD_MAX_MB * MB) {
      return setFileError(`We couldn’t shrink that image below ${SCREENSHOT_UPLOAD_MAX_MB} MB. Try a JPG or PNG screenshot.`);
    }
    replaceShot(file);
  }

  function submit(data: FormData) {
    if (screenshot) data.set("screenshot", screenshot);
    formAction(data);
  }

  const errors = state.errors ?? {};
  const err = (field: string) => (field === "screenshot" && fileError) || errors[field];
  const describedBy = (field: string) => (err(field) ? `${id}-${field}-error` : undefined);

  if (state.status === "success" || state.status === "duplicate") {
    const done = state.status === "success";
    return (
      <div className="glass-raised glass-sheen rounded-2xl p-8 text-center sm:p-12">
        <p aria-hidden="true" className="text-display-sm text-brand-orange">{done ? "✦" : "◆"}</p>
        <h3 className="mt-4 font-display text-display-sm uppercase text-gradient-warm">
          {done ? meetCopy.successTitle : meetCopy.duplicateTitle}
        </h3>
        <p className="mx-auto mt-4 max-w-prose text-body-lg text-fg-muted text-pretty">
          {done ? meetCopy.successBody : meetCopy.duplicateBody}
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
    <form action={submit} noValidate className="glass-panel glass-sheen rounded-2xl p-6 sm:p-10">
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="relative mb-10 flex gap-3 rounded-xl border border-brand-orange/30 bg-brand-orange/8 px-4 py-3.5 text-body-sm text-fg-muted text-pretty sm:px-5">
        <span aria-hidden="true" className="text-brand-orange">●</span>
        {meetCopy.privacy}
      </p>

      <div className="relative grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
        <Field label="Name" htmlFor={`${id}-name`} error={err("name")} errorId={describedBy("name")}>
          <input
            id={`${id}-name`} name="name" type="text" autoComplete="name" required maxLength={80}
            placeholder="Your full name"
            value={values.name} onChange={(e) => set("name")(e.target.value)}
            aria-invalid={!!err("name")} aria-describedby={describedBy("name")}
            className={cn(fieldBase, borderFor(err("name")))}
          />
        </Field>

        <Field
          label="WhatsApp number" htmlFor={`${id}-whatsapp`}
          error={err("whatsapp")} errorId={describedBy("whatsapp")}
          hint="We add you to the event group on this number."
        >
          <div className="flex items-stretch">
            <span className="inline-flex shrink-0 items-center rounded-l-lg border border-r-0 border-line bg-canvas-deep/60 px-4 font-mono text-body-sm text-fg-subtle">
              +91
            </span>
            <input
              id={`${id}-whatsapp`} name="whatsapp" type="tel" inputMode="numeric" autoComplete="tel-national"
              required maxLength={14} placeholder="98765 43210"
              value={values.whatsapp} onChange={(e) => set("whatsapp")(e.target.value)}
              aria-invalid={!!err("whatsapp")} aria-describedby={describedBy("whatsapp")}
              className={cn(fieldBase, "rounded-l-none", borderFor(err("whatsapp")))}
            />
          </div>
        </Field>

        <Group label="Age" error={err("age_range")} errorId={describedBy("age_range")} className="sm:col-span-2">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {ageRanges.map((a) => (
              <label key={a.value} className="relative">
                <input
                  type="radio" name="age_range" value={a.value} required className="peer sr-only"
                  checked={values.age_range === a.value}
                  onChange={() => set("age_range")(a.value)}
                  aria-describedby={describedBy("age_range")}
                />
                <span
                  className={cn(
                    choice,
                    "flex min-h-12 items-center justify-center px-2 text-center font-body text-body-sm font-semibold",
                    "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
                    values.age_range === a.value && chosen,
                  )}
                >
                  {a.label}
                </span>
              </label>
            ))}
          </div>
        </Group>

        <Field
          label="Your company / college / school" htmlFor={`${id}-organisation`}
          error={err("organisation")} errorId={describedBy("organisation")}
        >
          <input
            id={`${id}-organisation`} name="organisation" type="text" autoComplete="organization" required
            maxLength={120} placeholder="Where you work or study"
            value={values.organisation} onChange={(e) => set("organisation")(e.target.value)}
            aria-invalid={!!err("organisation")} aria-describedby={describedBy("organisation")}
            className={cn(fieldBase, borderFor(err("organisation")))}
          />
        </Field>

        <Field
          label="Your favourite board game" htmlFor={`${id}-favourite`}
          error={err("favourite_game")} errorId={describedBy("favourite_game")}
        >
          <input
            id={`${id}-favourite`} name="favourite_game" type="text" required maxLength={120}
            placeholder="Catan, Codenames, UNO…"
            value={values.favourite_game} onChange={(e) => set("favourite_game")(e.target.value)}
            aria-invalid={!!err("favourite_game")} aria-describedby={describedBy("favourite_game")}
            className={cn(fieldBase, borderFor(err("favourite_game")))}
          />
        </Field>

        <Field
          label="How did you hear about us?" htmlFor={`${id}-heard`}
          error={err("heard_from")} errorId={describedBy("heard_from")}
          className="sm:col-span-2"
        >
          <input
            id={`${id}-heard`} name="heard_from" type="text" required maxLength={200}
            placeholder="Pick one below or type your own"
            value={values.heard_from} onChange={(e) => set("heard_from")(e.target.value)}
            aria-invalid={!!err("heard_from")} aria-describedby={describedBy("heard_from")}
            className={cn(fieldBase, borderFor(err("heard_from")))}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {heardFromSuggestions.map((s) => (
              <button
                key={s} type="button" aria-pressed={values.heard_from === s}
                onClick={() => set("heard_from")(s)}
                className={cn(
                  choice,
                  "min-h-11 rounded-pill px-4 font-body text-caption font-bold uppercase tracking-widest",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  values.heard_from === s && chosen,
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </Field>

        <Field
          label="Number of people you’re registering for" htmlFor={`${id}-people`}
          error={err("party_size")} errorId={describedBy("party_size")}
          hint={people > 1 ? "Including you. Everyone else just needs to turn up." : undefined}
          className="sm:col-span-2"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex items-stretch">
              <button
                type="button" onClick={() => setPeople((n) => clampPeople(n - 1))} disabled={people <= 1}
                aria-label="One fewer person" aria-controls={`${id}-people`}
                className="grid size-12 place-items-center rounded-l-lg border border-line bg-canvas-deep/60 text-title text-fg transition-colors hover:bg-fg/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>
              <input
                id={`${id}-people`} name="party_size" type="number" inputMode="numeric" required
                min={1} max={MEET_MAX_PEOPLE}
                value={people} onChange={(e) => setPeople(clampPeople(Number(e.target.value)))}
                aria-invalid={!!err("party_size")} aria-describedby={describedBy("party_size")}
                className={cn(
                  // not fieldBase: its w-full would override the fixed width
                  "h-12 w-16 border-y bg-canvas-deep/40 text-center font-display text-title text-fg outline-none",
                  "transition-colors duration-300 focus:bg-canvas-deep/70",
                  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                  err("party_size") ? "border-state-danger" : "border-line focus:border-accent",
                )}
              />
              <button
                type="button" onClick={() => setPeople((n) => clampPeople(n + 1))} disabled={people >= MEET_MAX_PEOPLE}
                aria-label="One more person" aria-controls={`${id}-people`}
                className="grid size-12 place-items-center rounded-r-lg border border-line bg-canvas-deep/60 text-title text-fg transition-colors hover:bg-fg/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>
            <p className="text-body-lg text-fg-muted" aria-live="polite">
              ₹{MEET_PRICE} × {people} ={" "}
              <span className="font-display text-title text-brand-orange">₹{total}</span>
            </p>
          </div>
        </Field>

        <Group
          label="Payment screenshot" optional
          error={err("screenshot") || undefined} errorId={describedBy("screenshot")}
          hint={`JPG, PNG or HEIC, up to ${SCREENSHOT_PICK_MAX_MB} MB. It helps us match your ₹${total} to this registration.`}
          className="sm:col-span-2"
        >
          {shot ? (
            <div className="flex items-center gap-4 rounded-xl border border-accent/60 bg-accent/8 p-3 sm:p-4">
              <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-canvas-deep/60">
                {!previewFailed ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local blob: URL, nothing to optimise
                  <img src={shot.preview} alt="" className="size-full object-cover" onError={() => setPreviewFailed(true)} />
                ) : (
                  <span aria-hidden="true" className="text-title text-fg-subtle">▣</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-body-sm font-semibold text-fg">{shot.file.name}</p>
                <p className="mt-0.5 font-mono text-caption text-fg-subtle">
                  {(shot.file.size / 1024).toFixed(0)} KB · ready to upload
                </p>
              </div>
              <button
                type="button" onClick={() => replaceShot(null)}
                className="min-h-11 shrink-0 rounded-pill px-4 font-body text-caption font-bold uppercase tracking-widest text-fg-muted transition-colors hover:bg-fg/10 hover:text-fg"
              >
                Remove
              </button>
            </div>
          ) : (
            <label
              htmlFor={`${id}-screenshot`}
              className={cn(
                "group/drop flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center",
                "transition-[border-color,background-color] duration-300 hover:border-accent hover:bg-accent/5",
                "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
                err("screenshot") ? "border-state-danger" : "border-line-strong",
              )}
            >
              <span aria-hidden="true" className="grid size-11 place-items-center rounded-full border border-line-strong text-title text-brand-orange transition-transform duration-500 ease-out-expo group-hover/drop:-translate-y-0.5">
                ↑
              </span>
              <span className="font-body text-body font-semibold text-fg">
                {processing ? "Preparing image…" : "Choose a screenshot"}
              </span>
              <span className="text-body-sm text-fg-subtle">From your UPI app’s payment confirmation</span>
              {/* No `name`: the chosen file is sent from state — see `submit`. */}
              <input
                id={`${id}-screenshot`} type="file" accept={SCREENSHOT_TYPES.join(",")} className="sr-only"
                onChange={pickFile} disabled={processing}
                aria-invalid={!!err("screenshot")} aria-describedby={describedBy("screenshot")}
              />
            </label>
          )}
        </Group>
      </div>

      {state.message && (
        <p role="alert" className="mt-8 rounded-lg border border-state-danger/50 bg-state-danger/10 px-4 py-3 text-body-sm text-fg">
          {state.message}
        </p>
      )}

      <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <SubmitButton pending={pending || processing} total={total} />
        <p className="text-body-sm text-fg-subtle">One registration per WhatsApp number. Pay before you submit.</p>
      </div>
    </form>
  );
}
