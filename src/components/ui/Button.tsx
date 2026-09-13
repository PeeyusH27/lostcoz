import Link from "next/link";
import { cn } from "@/lib/cn";
import Magnetic from "@/components/motion/Magnetic";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Props = {
  href?: string;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  download?: boolean;
};

const variants: Record<Variant, string> = {
  primary: "bg-accent text-fg-on-accent hover:bg-accent-hover shadow-[0_0_0_0_transparent] hover:shadow-glow-orange",
  secondary: "bg-accent-secondary text-fg-on-magenta hover:bg-magenta-400 hover:shadow-glow-magenta",
  ghost: "border border-line-strong text-fg hover:bg-fg hover:text-fg-inverse hover:border-transparent",
  inverse: "bg-fg text-fg-inverse hover:bg-brand-orange",
};
const sizes = { sm: "h-11 px-5 text-[0.7rem]", md: "h-12 px-7 text-xs", lg: "h-14 px-9 text-sm" };

/** Pill button. `magnetic` wraps it so it leans toward the pointer. */
export default function Button({ href, variant = "primary", size = "md", magnetic = true, arrow = true, className, children, type = "button", onClick, download }: Props) {
  const cls = cn(
    "group/btn inline-flex items-center justify-center gap-3 rounded-pill font-body font-bold uppercase tracking-[0.14em] whitespace-nowrap select-none",
    // inside a [data-cta-stack] parent the button fills the row on phones
    "group-data-[cta-stack]/stack:w-full sm:group-data-[cta-stack]/stack:w-auto",
    "transition-[background-color,color,box-shadow,border-color] duration-300 ease-out-expo active:scale-[0.97]",
    variants[variant], sizes[size], className,
  );
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-1">→</span>
      )}
    </>
  );
  const external = href?.startsWith("http") || href?.startsWith("mailto:");
  const el = href ? (
    external ? <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" download={download}>{content}</a>
    : <Link href={href} className={cls} download={download}>{content}</Link>
  ) : (
    <button type={type} onClick={onClick} className={cls}>{content}</button>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
