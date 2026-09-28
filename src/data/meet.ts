/**
 * LostCoz Board Games Community Meet — event details, form options and copy.
 *
 * `MEET_EVENT.slug` is stored on every registration, so the same table serves
 * the next meet too: change the slug and the details below, and the one-entry-
 * per-number rule starts fresh for the new event. Option `value`s land in
 * Supabase as-is — add rather than rename.
 */
import { contact } from "@/data/links";

export const MEET_EVENT = {
  slug: "community-meet-2026-10-04",
  title: "LostCoz Board Games Community Meet",
  dateLabel: "Sun, 4 Oct 2026",
  timeLabel: "1 PM to 4 PM",
  venue: "Chai Leela",
  area: "Sector 17, Dwarka",
} as const;

/** Per-person entry, in rupees. */
export const MEET_PRICE = 99;

/** Upper bound for one registration; larger groups should message us. */
export const MEET_MAX_PEOPLE = 10;

/**
 * UPI details. The QR carries no amount because the total depends on the
 * party size. Keep in sync with scripts/gen-upi-qr.mjs, which renders the QR.
 */
export const MEET_UPI_INTENT = "upi://pay?pa=8178311050%40ybl&pn=Bhavya%20Das&cu=INR";
export const MEET_UPI_QR_SVG = "/qr/upi-meet.svg";
export const MEET_UPI_PAYEE = { vpa: "8178311050@ybl", name: "Bhavya Das" } as const;

/** Payment screenshot types. Must match `allowed_mime_types` on the bucket in supabase/schema.sql. */
export const SCREENSHOT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"] as const;

/** Largest file a person may pick. */
export const SCREENSHOT_PICK_MAX_MB = 10;

/**
 * Largest file actually sent to the server. The browser shrinks the screenshot
 * to a JPEG well under this first; it only matters when that fails (e.g. HEIC
 * outside Safari). Vercel functions reject bodies over ~4.5 MB, and
 * `serverActions.bodySizeLimit` in next.config.ts sits just above this.
 */
export const SCREENSHOT_UPLOAD_MAX_MB = 4;

export const ageRanges = [
  { value: "under-16", label: "Below 16" },
  { value: "16-18", label: "16–18" },
  { value: "19-22", label: "19–22" },
  { value: "23-27", label: "23–27" },
  { value: "28-30", label: "28–30" },
  { value: "over-30", label: "Above 30" },
] as const;

/** One-tap answers for "How did you hear about us?" — the field stays free text. */
export const heardFromSuggestions = ["Instagram", "WhatsApp", "A friend", "At a game night"] as const;

export const meetCopy = {
  eyebrow: "Community meet · first edition",
  lead: "Come hang out with LostCoz and fellow members of our community for an afternoon of games, chaos and fun.",
  about: [
    "You’ll get to play a variety of board and fun games, including one unreleased game that you won’t find anywhere else.",
    `For just ₹${MEET_PRICE}, be part of the very first LostCoz Game Meet and the beginning of an entertainment community.`,
  ],
  contactLine: `${contact.phoneDisplay} · ${contact.email}`,
  privacy:
    "Your details stay with the LostCoz team. We only use them to register you for the event and add you to the event’s WhatsApp group.",
  payTitle: `₹${MEET_PRICE} per person`,
  payLead: "Pay first, then register below. Scan the code, or copy the UPI ID into GPay, PhonePe, Paytm or your bank app.",
  formTitle: "Register now",
  formLead: "One registration per WhatsApp number. Registering friends too? Set the number of people and pay for everyone.",
  successTitle: "You’re in.",
  successBody:
    "We have your registration. We’ll check the payment and add you to the event’s WhatsApp group before the meet.",
  duplicateTitle: "You’re already registered.",
  duplicateBody:
    "This WhatsApp number is already on the list, so there’s nothing more to do. Please don’t pay twice. Message us if you need to change your details.",
} as const;
