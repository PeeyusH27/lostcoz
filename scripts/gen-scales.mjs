// Generates OKLCH tonal scales (50–950) for the brand hues and writes them into tokens/lostcoz.tokens.json.
// Usage: node scripts/gen-scales.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "tokens/lostcoz.tokens.json");
const tokens = JSON.parse(readFileSync(file, "utf8"));

// --- sRGB <-> OKLCH (Björn Ottosson) ---
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function hexToOklch(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = lin(((n >> 16) & 255) / 255), g = lin(((n >> 8) & 255) / 255), b = lin((n & 255) / 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(a, bb), h: (Math.atan2(bb, a) * 180) / Math.PI };
}
function oklchToRgb({ L, C, h }) {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const inGamut = (rgb) => rgb.every((c) => c >= -0.0005 && c <= 1.0005);
function toHex(lch) {
  // shrink chroma until the colour fits sRGB
  let { L, C, h } = lch;
  let lo = 0, hi = C;
  if (!inGamut(oklchToRgb({ L, C, h }))) {
    for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (inGamut(oklchToRgb({ L, C: mid, h }))) lo = mid; else hi = mid; }
    C = lo;
  }
  const rgb = oklchToRgb({ L, C, h }).map((c) => Math.round(gam(Math.min(1, Math.max(0, c))) * 255));
  return "#" + rgb.map((c) => c.toString(16).padStart(2, "0").toUpperCase()).join("");
}

const STEPS = { 50: 0.975, 100: 0.94, 200: 0.885, 300: 0.81, 400: 0.725, 500: 0.635, 600: 0.545, 700: 0.455, 800: 0.365, 900: 0.275, 950: 0.195 };
const HUES = ["cream", "purple", "orange", "magenta", "cyan"];

for (const name of HUES) {
  const base = tokens.color.brand[name].$value;
  const { L: L0, C: C0, h } = hexToOklch(base);
  const group = tokens.color[name];
  const desc = group.$description;
  for (const k of Object.keys(group)) if (!k.startsWith("$")) delete group[k];
  let anchor = null, best = 1;
  for (const [step, L] of Object.entries(STEPS)) {
    const d = Math.abs(L - L0);
    if (d < best) { best = d; anchor = step; }
  }
  for (const [step, L] of Object.entries(STEPS)) {
    // chroma: bell around the base lightness, never below 18 % of base chroma
    const f = Math.max(0.18, 1 - ((L - L0) / 0.62) ** 2);
    const hex = step === anchor ? base : toHex({ L, C: C0 * f, h });
    group[step] = { $value: hex, ...(step === anchor ? { $description: "Brand anchor — exact logo colour." } : {}) };
  }
  group.$description = desc;
  console.log(`${name.padEnd(8)} anchor ${anchor}  ` + Object.keys(STEPS).map((s) => group[s].$value).join(" "));
}
writeFileSync(file, JSON.stringify(tokens, null, 2) + "\n");
console.log("wrote", file);
