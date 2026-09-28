"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { insertRow, uploadObject, SupabaseError, UNIQUE_VIOLATION } from "@/lib/supabase";
import { normalisePhone } from "@/lib/phone";
import {
  MEET_EVENT, MEET_MAX_PEOPLE, MEET_PRICE, SCREENSHOT_TYPES, SCREENSHOT_UPLOAD_MAX_MB, ageRanges,
} from "@/data/meet";
import type { MeetState } from "@/app/meet/state";

const ageValues = ageRanges.map((a) => a.value) as string[];
const screenshotTypes = SCREENSHOT_TYPES as readonly string[];
const extensions: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/heic": "heic", "image/heif": "heif",
};

const str = (data: FormData, name: string) => (data.get(name) ?? "").toString().trim();

/** Free-text answers: required, 2 characters minimum, capped at `max`. */
function text(data: FormData, name: string, max: number, errors: Record<string, string>, missing: string) {
  const value = str(data, name);
  if (value.length < 2) errors[name] = missing;
  else if (value.length > max) errors[name] = `Please keep it under ${max} characters.`;
  return value;
}

export async function submitMeetRegistration(_prev: MeetState, data: FormData): Promise<MeetState> {
  // Bots fill every field they can see; this one is hidden from people.
  if (str(data, "website")) return { status: "success" };

  const errors: Record<string, string> = {};

  const name = text(data, "name", 80, errors, "Please tell us your name.");

  const whatsapp = normalisePhone(str(data, "whatsapp"));
  if (!whatsapp) errors.whatsapp = "Enter a 10-digit Indian WhatsApp number.";

  const ageRange = str(data, "age_range");
  if (!ageValues.includes(ageRange)) errors.age_range = "Pick your age range.";

  const organisation = text(data, "organisation", 120, errors, "Tell us where you work or study.");
  const heardFrom = text(data, "heard_from", 200, errors, "Tell us how you found us.");
  const favouriteGame = text(data, "favourite_game", 120, errors, "Name one. Any one.");

  const partySize = Number(str(data, "party_size"));
  if (!Number.isInteger(partySize) || partySize < 1 || partySize > MEET_MAX_PEOPLE) {
    errors.party_size = `Choose between 1 and ${MEET_MAX_PEOPLE} people.`;
  }

  // Optional: an empty file input still posts a zero-byte File.
  const file = data.get("screenshot");
  const screenshot = file instanceof File && file.size > 0 ? file : null;
  if (screenshot) {
    if (!screenshotTypes.includes(screenshot.type)) {
      errors.screenshot = "Upload a JPG, PNG, WebP or HEIC image.";
    } else if (screenshot.size > SCREENSHOT_UPLOAD_MAX_MB * 1024 * 1024) {
      errors.screenshot = `That image is too large. Please upload one under ${SCREENSHOT_UPLOAD_MAX_MB} MB.`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, message: "Please fix the highlighted fields." };
  }

  // Kept for our own abuse handling only; never shown back to anyone.
  const forwardedFor = (await headers()).get("x-forwarded-for");

  try {
    // Uploaded first so the row can point at it. A duplicate registration leaves
    // an orphaned screenshot behind, which is harmless and rare.
    let screenshotPath: string | null = null;
    if (screenshot) {
      screenshotPath = `${MEET_EVENT.slug}/${randomUUID()}.${extensions[screenshot.type]}`;
      await uploadObject("meet-payments", screenshotPath, screenshot);
    }

    await insertRow("meet_registrations", {
      event: MEET_EVENT.slug,
      name,
      whatsapp,
      age_range: ageRange,
      organisation,
      heard_from: heardFrom,
      favourite_game: favouriteGame,
      party_size: partySize,
      amount_due: partySize * MEET_PRICE,
      screenshot_path: screenshotPath,
      source_ip: forwardedFor?.split(",")[0]?.trim() || null,
    });
  } catch (err) {
    if (err instanceof SupabaseError) {
      // The unique index on (event, whatsapp) is the dedup.
      if (err.code === UNIQUE_VIOLATION || err.status === 409) return { status: "duplicate" };
      console.error("meet registration failed", err.status, err.code, err.message);
    } else {
      console.error("meet registration failed", err);
    }
    return {
      status: "error",
      message: "Something broke on our side. Please try again, or message us on WhatsApp.",
    };
  }

  return { status: "success" };
}
