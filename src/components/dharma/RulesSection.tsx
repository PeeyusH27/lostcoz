import { rules, rulebookPdf } from "@/data/dharma";
import { RuleBlocks } from "@/components/dharma/RuleText";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";

export default function RulesSection() {
  return (
    <section id="rules" className="relative scroll-mt-20 px-gutter py-section">
      <div className="relative z-[2] mx-auto max-w-content">
        <SectionHeading eyebrow="Rulebook · v1.7" title="How to play." lead="The full rules, as printed. Read them once — then let the table teach you the rest." />
        <div className="mt-16 grid gap-14 lg:grid-cols-[14rem_1fr] lg:gap-24">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow mb-5">Contents</p>
            <ol className="space-y-3">
              {rules.map((r, i) => (
                <li key={r.id}>
                  <a href={`#${r.id}`} className="group flex items-baseline gap-3 font-body text-sm font-semibold uppercase tracking-widest text-fg-muted transition-colors hover:text-fg">
                    <span className="font-dharma-display text-dharma-gold-500">{String(i + 1).padStart(2, "0")}</span>
                    <span className="border-b border-transparent transition-colors group-hover:border-accent">{r.title}</span>
                  </a>
                </li>
              ))}
            </ol>
            <div className="mt-10"><Button href={rulebookPdf} variant="ghost" size="sm" magnetic={false} download>Download PDF</Button></div>
          </aside>

          <div className="rules max-w-prose text-rule">
            {rules.map((r, i) => (
              <Reveal key={r.id} y={30} className="scroll-mt-28 border-t border-line py-12 first:border-t-0 first:pt-0" as="article">
                <div id={r.id}>
                  <h3 className="mb-6 flex items-baseline gap-4 font-dharma-display text-display-sm text-gradient-gold">
                    <span className="text-base text-dharma-gold-600">{String(i + 1).padStart(2, "0")}</span>{r.title}
                  </h3>
                  <RuleBlocks blocks={r.blocks} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
