import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start",
  className,
}: SectionHeaderProps) {
  return (
    <div
      data-reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className="eyebrow text-base">
        <span className="h-px w-6 bg-primary" aria-hidden />
        {eyebrow}
      </p>
      <h2 className="mt-4 font-heading text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
          {description}
        </p>
      )}
    </div>
  );
}
