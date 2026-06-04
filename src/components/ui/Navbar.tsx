"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/profile", label: "Profile" },
  { href: "/cv", label: "CV" },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[min(96%,820px)]">
      <nav className="glass rounded-full px-3 py-2 flex items-center gap-1 justify-between">
        <Link
          href="/"
          className="px-3 py-1 rounded-full font-display font-bold tracking-tight"
        >
          <span className="gradient-text">{"<ismail/>"}</span>
        </Link>
        <ul className="hidden sm:flex items-center gap-1">
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full transition-colors",
                    active
                      ? "bg-accent/20 text-fg"
                      : "text-muted hover:text-fg hover:bg-card/60"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
