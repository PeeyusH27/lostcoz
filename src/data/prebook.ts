/**
 * Order of Dharma pre-booking — copy, options and payment details.
 *
 * The option `value`s are the strings that land in Supabase and, from there, in
 * the Google Sheet. Changing one changes historical reporting, so add rather
 * than rename.
 */

/** Pre-booking price, in rupees. Must match `am=` in UPI_INTENT below. */
export const PREBOOK_AMOUNT = 499;

/**
 * UPI deep link. Only opens an app on a phone with a UPI app installed —
 * on desktop the QR beside it is the way in.
 * Keep in sync with scripts/gen-upi-qr.mjs, which renders the QR from this string.
 */
export const UPI_INTENT = "upi://pay?pa=8178311050%40ybl&pn=Bhavya%20Das&am=499&cu=INR";

export const UPI_QR_SVG = "/qr/upi-prebook-499.svg";

/** Shown under the QR so a payer can check they're paying the right person. */
export const UPI_PAYEE = { vpa: "8178311050@ybl", name: "Bhavya Das" } as const;

export const genders = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non-binary", label: "Non-binary" },
  { value: "undisclosed", label: "Prefer not to say" },
] as const;

export const fulfilments = [
  {
    value: "pickup",
    label: "Pick up from Dwarka",
    hint: "Collect your deck in person. We will share the address and slot.",
  },
  {
    value: "delivery",
    label: "Deliver it to me",
    hint: "We ship it to the address you give below.",
  },
] as const;

/** 1–10 scale; the ends are labelled, the middle is left to the player. */
export const enjoymentScale = {
  min: 1,
  max: 10,
  minLabel: "Not my thing",
  maxLabel: "Obsessed",
} as const;

export type Gender = (typeof genders)[number]["value"];
export type Fulfilment = (typeof fulfilments)[number]["value"];

export const prebookCopy = {
  eyebrow: "Pre-booking · limited first print",
  title: "Pre-book Order of Dharma",
  lead:
    "The first print run is small and it is going to people who have already played. Tell us how the game went, pay ₹499, and a deck is held in your name.",
  formTitle: "Your details",
  formLead: "One entry per phone number. If you have already pre-booked, we will spot it and tell you.",
  payTitle: "₹499 pre-booking payment",
  payLead:
    "Pay first, then submit the form — the reference number ties the two together. Scan the code, or copy the UPI ID into GPay, PhonePe, Paytm or your bank app.",
  successTitle: "You're on the list.",
  successBody:
    "Your deck is held. We will message you on WhatsApp with the print-run date and, if you chose delivery, a tracking link.",
  duplicateTitle: "You've already pre-booked.",
  duplicateBody:
    "This number is on the list, so there is nothing more to do — and please do not pay twice. Message us on WhatsApp if you need to change your details.",
} as const;
