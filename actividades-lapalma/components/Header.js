"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import DarkModeToggle from "./DarkModeToggle";

const links = [
  { href: "/rutas", label: "Rutas" },
  { href: "/mapa", label: "Mapa" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-sand/90 backdrop-blur dark:border-sand/10 dark:bg-ink/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-forest dark:text-foam"
        >
          ActividadesLaPalma
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                pathname?.startsWith(link.href)
                  ? "text-ocean"
                  : "text-ink/70 hover:text-ink dark:text-sand/70 dark:hover:text-sand"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <DarkModeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <DarkModeToggle />
          <button
            type="button"
            aria-label="Menú"
            className="rounded-md border border-ink/15 px-3 py-1.5 text-sm dark:border-sand/20"
            onClick={() => setOpen((v) => !v)}
          >
            Menú
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-ink/10 px-4 py-3 md:hidden dark:border-sand/10">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink dark:text-sand"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
