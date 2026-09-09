import { cn } from "@/lib/cn";

export function Swatch({ name, value, description, large = false, className }: { name: string; value: string; description?: string; large?: boolean; className?: string }) {
  const cssVar = `var(${name})`;
  return (
    <div className={cn("group min-w-0", className)} data-cursor="link">
      <div className={cn("rounded-lg hairline transition-transform duration-500 ease-out-expo group-hover:-translate-y-1", large ? "h-36" : "h-16")} style={{ background: cssVar }} />
      <p className="mt-2 truncate font-mono text-[0.7rem] text-fg">{name}</p>
      <p className="truncate font-mono text-[0.68rem] text-fg-subtle">{value}</p>
      {description && large && <p className="mt-1 text-caption text-fg-muted">{description}</p>}
    </div>
  );
}
