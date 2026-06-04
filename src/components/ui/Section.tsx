import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("py-20 px-6", className)}>
      <div className="max-w-6xl mx-auto">
        {(eyebrow || title || subtitle) && (
          <header className="mb-10">
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3">{eyebrow}</p>
            )}
            {title && (
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted mt-3 max-w-2xl">{subtitle}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
