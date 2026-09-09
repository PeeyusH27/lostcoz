import Marquee from "@/components/motion/Marquee";
import { site } from "@/data/site";

export default function MarqueeStrip() {
  const colors = ["text-brand-purple", "text-brand-orange", "text-brand-magenta", "text-brand-cyan"];
  return (
    <div className="relative z-[2] border-y border-line bg-canvas py-6" data-skew>
      <Marquee speed={80}>
        {site.marquee.map((w, i) => (
          <span key={w} className="flex items-center whitespace-nowrap px-6 font-display text-display-md uppercase leading-none text-fg">
            {w}<span aria-hidden="true" className={`ml-12 text-[0.55em] ${colors[i % 4]}`}>✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
