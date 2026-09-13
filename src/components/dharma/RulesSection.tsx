import { rules, rulebookPdf } from "@/data/dharma";
import { RuleBlocks } from "@/components/dharma/RuleText";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";

export default function RulesSection() {
  return (
    <section id="rules" className="relative scroll-mt-20 px-gutter py-section">
      <div className="relative z-[2] mx-auto max-w-content">
        <SectionHeading eyebrow="Rulebook · v1.7" title="How to play." lead="The full rules, as printed. Read them once, then let the table teach you the rest." />
        <div className="mt-10 grid gap-8 md:mt-16 lg:grid-cols-[14rem_1fr] lg:gap-24">
          {/* On mobile the contents become a swipeable chip rail pinned under the nav;
              from lg it returns to a sticky sidebar list. */}
          <aside className="glass-soft min-w-0 rounded-xl border border-line px-4 py-4 lg:sticky lg:top-28 lg:self-start lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
            <p className="eyebrow mb-3 lg:mb-5">Contents</p>
            <ol className="flex snap-x snap-mandatory gap-2 overflow-x-auto no-scrollbar lg:block lg:space-y-3 lg:overflow-visible">
              {rules.map((r, i) => (
                <li key={r.id} className="shrink-0 snap-start lg:shrink">
                  <a
                    href={`#${r.id}`}
                    className="group flex min-h-11 items-center gap-2 whitespace-nowrap rounded-pill border border-line px-4 font-body text-caption font-semibold uppercase tracking-widest text-fg-muted transition-colors hover:text-fg active:border-line-strong lg:min-h-0 lg:items-baseline lg:gap-3 lg:whitespace-normal lg:rounded-none lg:border-0 lg:px-0 lg:text-sm"
                  >
                    <span className="font-dharma-display text-dharma-gold-500">{String(i + 1).padStart(2, "0")}</span>
                    <span className="border-b border-transparent transition-colors group-hover:border-accent">{r.title}</span>
                  </a>
                </li>
              ))}
            </ol>
            <div className="mt-5 hidden lg:mt-10 lg:block"><Button href={rulebookPdf} variant="ghost" size="sm" magnetic={false} download>Download PDF</Button></div>
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
