import { rulebookPdf } from "@/data/dharma";
import { links } from "@/data/links";
import Button from "@/components/ui/Button";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";

export default function DharmaCTA() {
  return (
    <section className="relative overflow-hidden px-gutter py-section">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_100%,rgb(201_162_78/0.25),transparent_70%)]" />
      <div className="relative z-[2] mx-auto max-w-wide text-center">
        <SplitReveal as="h2" mode="lines" className="mx-auto max-w-[16ch] font-dharma-display text-display-2xl text-gradient-gold text-balance">Bring the Order to your table.</SplitReveal>
        <Reveal as="p" y={20} className="mx-auto mt-8 max-w-prose text-body-xl text-fg-muted">Get the deck, or play it first at a Lostcoz game night.</Reveal>
        <Reveal stagger={0.1} y={20} data-cta-stack className="group/stack mt-10 flex flex-col items-stretch justify-center gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Button href={links.prebook} size="lg">Buy the game</Button>
          <Button href={links.whatsappCommunity} variant="ghost" size="lg">Play at a game night</Button>
          <Button href={rulebookPdf} variant="ghost" size="lg" download>Rulebook PDF</Button>
        </Reveal>
      </div>
    </section>
  );
}
