import type { RuleBlock } from "@/data/dharma";

/** Renders rulebook text, styling the rulebook's ALL-CAPS keywords (CLAN, ABILITY, NIRNAY…) as small caps. */
export function RuleText({ text }: { text: string }) {
  const parts = text.split(/(\b[A-Z][A-Z-]{2,}(?:\s+[A-Z][A-Z-]{2,})*\b)/);
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <span key={i} className="kw">{p.toLowerCase()}</span> : <span key={i}>{p}</span>))}
    </>
  );
}

export function RuleBlocks({ blocks }: { blocks: RuleBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "p") return <p key={i}><RuleText text={b.text} /></p>;
        if (b.type === "note") return <p key={i} className="mt-6 border-l-2 border-accent pl-5 italic text-fg-muted"><RuleText text={b.text} /></p>;
        const Tag = b.type;
        return <Tag key={i}>{b.items.map((it, j) => <li key={j}><RuleText text={it} /></li>)}</Tag>;
      })}
    </>
  );
}
