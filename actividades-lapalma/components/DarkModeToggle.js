"use client";

import { useEffect, useState } from "react";

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export default function DarkModeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("alp-theme");
    const preferred =
      stored ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(preferred);
    applyTheme(preferred);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("alp-theme", next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-md border border-ink/15 px-2.5 py-1.5 text-xs font-medium text-ink/80 transition hover:bg-ink/5 dark:border-sand/20 dark:text-sand/80 dark:hover:bg-sand/10"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? "Claro" : "Oscuro"}
    </button>
  );
}
