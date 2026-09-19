"use server";

import { headers } from "next/headers";
import { insertRow, SupabaseError, UNIQUE_VIOLATION } from "@/lib/supabase";
import { enjoymentScale, fulfilments, genders } from "@/data/prebook";
import type { PrebookState } from "@/app/prebook/state";

const genderValues = genders.map((g) => g.value) as string[];
const fulfilmentValues = fulfilments.map((f) => f.value) as string[];

const str = (data: FormData, name: string) => (data.get(name) ?? "").toString().trim();

/**
 * Indian mobile numbers are ten digits starting 6–9. People type them with
 * +91, spaces, dashes and brackets, so strip everything down to digits first
 * and store one canonical form — the dedup depends on it.
 */
function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "").replace(/^0+/, "");
  const local = digits.length > 10 && digits.startsWith("91") ? digits.slice(-10) : digits;
  return /^[6-9]\d{9}$/.test(local) ? local : null;
}

export async function submitPrebooking(
  _prev: PrebookState,
  data: FormData,
): Promise<PrebookState> {
  // Bots fill every field they can see; this one is hidden from people.
  if (str(data, "website")) return { status: "success" };

  const errors: Record<string, string> = {};

  const name = str(data, "name");
  if (name.length < 2) errors.name = "Please tell us your name.";
  else if (name.length > 80) errors.name = "That is longer than we can store — please shorten it.";

  const phone = normalisePhone(str(data, "phone"));
  if (!phone) errors.phone = "Enter a 10-digit Indian mobile number.";

  const ageRaw = str(data, "age");
  const age = Number(ageRaw);
  if (!ageRaw) errors.age = "Please enter your age.";
  else if (!Number.isInteger(age) || age < 12 || age > 120) errors.age = "Enter an age between 12 and 120.";

  const gender = str(data, "gender");
  if (!genderValues.includes(gender)) errors.gender = "Pick one.";

  const enjoymentRaw = str(data, "enjoyment");
  const enjoyment = Number(enjoymentRaw);
  if (!enjoymentRaw) errors.enjoyment = "Give us a number.";
  else if (!Number.isInteger(enjoyment) || enjoyment < enjoymentScale.min || enjoyment > enjoymentScale.max) {
    errors.enjoyment = `Pick a number from ${enjoymentScale.min} to ${enjoymentScale.max}.`;
  }

  const favourite = str(data, "favourite");
  if (favourite.length < 3) errors.favourite = "A few words is plenty.";
  else if (favourite.length > 1000) errors.favourite = "Please keep it under 1000 characters.";

  const fulfilment = str(data, "fulfilment");
  if (!fulfilmentValues.includes(fulfilment)) errors.fulfilment = "Pick pickup or delivery.";

  // Only asked for, and only stored, when the deck is being shipped.
  const address = fulfilment === "delivery" ? str(data, "address") : "";
  if (fulfilment === "delivery") {
    if (address.length < 15) errors.address = "We need a full address, including the PIN code.";
    else if (address.length > 500) errors.address = "Please keep the address under 500 characters.";
  }

  const upiReference = str(data, "upi_reference");
  if (upiReference.length > 40) errors.upi_reference = "That does not look like a UPI reference.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, message: "Please fix the highlighted fields." };
  }

  // Kept for our own abuse handling only; never shown back to anyone.
  const forwardedFor = (await headers()).get("x-forwarded-for");

  try {
    await insertRow("prebookings", {
      name,
      phone,
      age,
      gender,
      enjoyment,
      favourite,
      fulfilment,
      address: address || null,
      upi_reference: upiReference || null,
      amount: 499,
      source_ip: forwardedFor?.split(",")[0]?.trim() || null,
    });
  } catch (err) {
    if (err instanceof SupabaseError) {
      // The unique index on `phone` is the dedup — a second attempt from the
      // same number never creates a row, here or in the Sheet.
      if (err.code === UNIQUE_VIOLATION || err.status === 409) return { status: "duplicate" };
      console.error("prebooking insert failed", err.status, err.code, err.message);
    } else {
      console.error("prebooking insert failed", err);
    }
    return {
      status: "error",
      message: "Something broke on our side. Please try again, or message us on WhatsApp.",
    };
  }

  return { status: "success" };
}
