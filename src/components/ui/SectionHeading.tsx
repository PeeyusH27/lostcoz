import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export default function SectionHeading({
  eyebrow, title, lead, className, align = "left", size = "xl", titleClassName,
}: { eyebrow?: string; title: string; lead?: string; className?: string; align?: "left" | "center"; size?: "xl" | "lg" | "2xl"; titleClassName?: string }) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Reveal as="p" y={16} className="eyebrow mb-6">{eyebrow}</Reveal>}
      <SplitReveal as="h2" mode="lines" className={cn("max-w-[18ch] font-display uppercase text-balance", align === "center" && "mx-auto", size === "2xl" ? "text-display-2xl" : size === "lg" ? "text-display-lg" : "text-display-xl", titleClassName)}>
        {title}
      </SplitReveal>
      {lead && <Reveal as="p" y={24} delay={0.2} className={cn("mt-8 max-w-prose text-body-xl text-fg-muted text-pretty", align === "center" && "mx-auto")}>{lead}</Reveal>}
    </div>
  );
}
