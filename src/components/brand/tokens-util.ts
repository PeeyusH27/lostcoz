import tokens from "../../../tokens/lostcoz.tokens.json";

export type TokenNode = { $value?: unknown; $description?: string; $type?: string; [k: string]: unknown };
export type FlatToken = { name: string; path: string[]; value: string; description?: string; type?: string };

const isToken = (n: unknown): n is TokenNode => !!n && typeof n === "object" && "$value" in (n as object);

/** Flattens a token group into `--name` / value pairs (mirrors scripts/build-tokens.mjs). */
export function flatten(node: unknown, path: string[] = [], inherited?: string): FlatToken[] {
  if (!node || typeof node !== "object") return [];
  const n = node as TokenNode;
  const type = (n.$type as string | undefined) ?? inherited;
  const out: FlatToken[] = [];
  for (const [key, child] of Object.entries(n)) {
    if (key.startsWith("$")) continue;
    const p = key === "DEFAULT" ? path : [...path, key];
    if (isToken(child)) {
      const v = child.$value;
      const value = Array.isArray(v) ? v.join(", ") : typeof v === "object" ? JSON.stringify(v) : String(v);
      out.push({ name: "--" + p.join("-"), path: p, value, description: child.$description, type: child.$type ?? type });
    } else if (child && typeof child === "object") {
      out.push(...flatten(child, p, type));
    }
  }
  return out;
}

export const T = tokens as unknown as Record<string, TokenNode>;
export const group = (key: string) => (T[key] ?? {}) as TokenNode;
export const sub = (a: string, b: string) => ((group(a)[b] ?? {}) as TokenNode);
/** CSS var reference for a token path */
export const v = (...path: string[]) => `var(--${path.filter((s) => s !== "DEFAULT").join("-")})`;
