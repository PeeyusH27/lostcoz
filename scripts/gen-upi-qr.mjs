/**
 * Renders the pre-booking UPI intent link to a static SVG in /public.
 *
 * The payee, amount and note never change, so the QR is generated once and
 * committed rather than built on every request. Re-run only if UPI_INTENT in
 * src/data/prebook.ts changes:
 *
 *   npx qrcode@1 --version >/dev/null   # any 1.x works
 *   node scripts/gen-upi-qr.mjs
 *
 * `qrcode` is intentionally NOT a package.json dependency — install it ad hoc
 * (`npm i --no-save qrcode`) for the one-off regeneration.
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import QRCode from "qrcode";

// keep in sync with UPI_INTENT in src/data/prebook.ts
const UPI_INTENT = "upi://pay?pa=8178311050%40ybl&pn=Bhavya%20Das&am=499&cu=INR";

const out = resolve(dirname(fileURLToPath(import.meta.url)), "../public/qr/upi-prebook-499.svg");

const svg = await QRCode.toString(UPI_INTENT, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 1,
  color: { dark: "#0A1512", light: "#EAD9B8" }, // dharma emerald on parchment
});

await writeFile(out, svg, "utf8");
console.log(`wrote ${out}`);
