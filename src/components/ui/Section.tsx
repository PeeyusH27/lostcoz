import { cn } from "@/lib/cn";

/**
 * Page section. The inner wrapper sits at z-index 2 so content renders above the
 * travelling hero card (z-index 1) while the section background stays below it.
 */
export default function Section({
  id, className, inner = "max-w-content", children, as: Tag = "section", padded = true, dimCard = false,
}: { id?: string; className?: string; inner?: string; children: React.ReactNode; as?: "section" | "div" | "footer"; padded?: boolean; dimCard?: boolean }) {
  return (
    <Tag id={id} className={cn("relative", padded && "px-gutter py-section", className)} data-card-dim={dimCard ? "" : undefined}>
      <div className={cn("relative z-[2] mx-auto", inner)}>{children}</div>
    </Tag>
  );
}
