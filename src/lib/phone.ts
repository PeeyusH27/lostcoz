/**
 * Indian mobile numbers are ten digits starting 6–9. People type them with
 * +91, spaces, dashes and brackets, so strip everything down to digits first
 * and store one canonical form — the dedup depends on it.
 */
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "").replace(/^0+/, "");
  const local = digits.length > 10 && digits.startsWith("91") ? digits.slice(-10) : digits;
  return /^[6-9]\d{9}$/.test(local) ? local : null;
}
