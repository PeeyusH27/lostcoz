// Compiles tokens/lostcoz.tokens.json (DTCG) -> src/styles/tokens.css (Tailwind v4 `@theme static`)
// and copies the JSON to public/tokens/ for download from the /brand page.
// Usage: node scripts/build-tokens.mjs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "tokens/lostcoz.tokens.json");
const tokens = JSON.parse(readFileSync(src, "utf8"));

const isToken = (n) => n && typeof n === "object" && "$value" in n;
const lines = [];
const seen = new Map();

function alias(v) {
  // {color.purple.500} -> var(--color-purple-500)
  return v.replace(/\{([^}]+)\}/g, (_, p) => `var(--${p.split(".").filter((s) => s !== "DEFAULT").join("-")})`);
}
function cssValue(type, v) {
  if (Array.isArray(v)) {
    if (type === "cubicBezier") return v.join() === "0,0,1,1" ? "linear" : `cubic-bezier(${v.join(", ")})`;
    if (type === "fontFamily") return v.map((f) => (/[\s]/.test(f) && !f.startsWith("var(") ? `"${f}"` : f)).join(", ");
    return v.join(", ");
  }
  if (typeof v === "number") return String(v);
  return alias(String(v));
}
function emit(name, value) {
  if (seen.has(name)) throw new Error(`duplicate token ${name}`);
  seen.set(name, value);
  lines.push(`  --${name}: ${value};`);
}
function walk(node, path, inheritedType) {
  const type = node.$type ?? inheritedType;
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    const p = key === "DEFAULT" ? path : [...path, key];
    if (isToken(child)) {
      const t = child.$type ?? type;
      const name = p.join("-");
      if (t === "typography") {
        const v = child.$value;
        emit(name, alias(v.fontSize));
        if (v.lineHeight != null) emit(`${name}--line-height`, String(v.lineHeight));
        if (v.letterSpacing != null) emit(`${name}--letter-spacing`, String(v.letterSpacing));
        if (v.fontWeight != null) emit(`${name}--font-weight`, String(v.fontWeight));
      } else {
        emit(name, cssValue(t, child.$value));
      }
    } else if (child && typeof child === "object") {
      walk(child, p, type);
    }
  }
}
walk(tokens, [], undefined);

const css = `/* ------------------------------------------------------------------
   Lostcoz design tokens - AUTO-GENERATED from tokens/lostcoz.tokens.json
   Do not edit by hand. Edit the JSON, then run: npm run tokens
   Namespaces follow Tailwind v4 (@theme) so every token is also a utility:
     --color-…      bg-, text-, border- utilities
     --text-…       fluid type scale (size, line-height, letter-spacing, weight)
     --font-…       font- utilities        --radius-…   rounded- utilities
     --shadow-…     shadow- utilities      --ease-…     ease- utilities
     --spacing-…, --container-…, --breakpoint-…   p-, max-w-, sm: …
   Everything else (--gradient-…, --duration-…, --z-…, --size-…) is a plain CSS variable.
------------------------------------------------------------------- */
@theme static {
${lines.join("\n")}
}
`;
const out = join(root, "src/styles/tokens.css");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, css);
mkdirSync(join(root, "public/tokens"), { recursive: true });
copyFileSync(src, join(root, "public/tokens/lostcoz.tokens.json"));
console.log(`tokens.css: ${lines.length} variables -> ${out}`);
