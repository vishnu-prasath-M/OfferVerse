"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

const primaryNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/deals", label: "Deals" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

const categoryItems: NavItem[] = [
  { href: "/deals?source=amazon", label: "Amazon Deals" },
  { href: "/deals?source=flipkart", label: "Flipkart Deals" },
  { href: "/deals?category=electronics", label: "Electronics" },
  { href: "/deals?category=fashion", label: "Fashion" },
  { href: "/deals?category=home", label: "Home & Kitchen" },
  { href: "/deals?category=beauty", label: "Beauty" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("offerverse-theme");
    const initial = stored === "light" || stored === "dark" ? stored : "dark";
    setTheme(initial);
    if (initial === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("offerverse-theme", next);
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    if (base === "/") return pathname === "/";
    // Only treat as active when the current pathname matches the base path exactly
    // so that /deals and /deals?flash=true don&apos;t both appear active.
    return pathname === base;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/80">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4"
        aria-label="Main navigation"
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-sky-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-cyan-300 dark:ring-cyan-500/40">
            <span className="text-lg font-extrabold">%</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-sky-600 dark:text-slate-50 dark:group-hover:text-cyan-300">
              OfferVerse
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Verified deals, updated live
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 lg:flex">
          <div className="flex items-center gap-6">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative inline-flex items-center py-1 transition-colors hover:text-sky-600 focus:outline-none focus-visible:text-sky-600 dark:hover:text-cyan-300 dark:focus-visible:text-cyan-300"
              >
                <span>{item.label}</span>
                {isActive(item.href) && (
                  <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500" />
                )}
              </Link>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button
                type="button"
                className="relative inline-flex items-center gap-1 py-1 text-slate-300 transition-colors hover:text-cyan-300 focus:outline-none focus-visible:text-cyan-300"
                aria-haspopup="true"
                aria-expanded={categoriesOpen}
              >
                <span>Categories</span>
                <span className="text-[10px]">▾</span>
              </button>
              {categoriesOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 text-sm shadow-lg ring-1 ring-slate-200 dark:border-slate-800/80 dark:bg-slate-950/95 dark:ring-slate-800/80"
                  role="menu"
                >
                  {categoryItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-slate-700 hover:bg-slate-100 hover:text-sky-600 focus:outline-none focus-visible:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/80 dark:hover:text-cyan-300 dark:focus-visible:bg-slate-900/80"
                      role="menuitem"
                    >
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-xs text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-cyan-400/70 dark:hover:text-cyan-300 dark:focus-visible:ring-cyan-500/60"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☾" : "☀"}
            </button>

            <a
              href="https://t.me/OfferZoneTamil"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-4 py-1.5 text-xs font-semibold text-slate-50 shadow-sm transition hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/70 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            >
              <span>Join Telegram</span>
            </a>

          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-xs text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-cyan-400/70 dark:hover:text-cyan-300 dark:focus-visible:ring-cyan-500/60"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☾" : "☀"}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-cyan-400/70 dark:hover:text-cyan-300 dark:focus-visible:ring-cyan-500/60"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span className="sr-only">Open main menu</span>
            <span className="text-lg">☰</span>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white/95 px-4 pb-4 pt-2 shadow-lg backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/95 lg:hidden transition-transform">
          <div className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-200" role="menu" aria-label="Mobile navigation">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-slate-100 hover:text-sky-600 dark:hover:bg-slate-900/80 dark:hover:text-cyan-300"
                role="menuitem"
                onClick={() => setMobileOpen(false)}
              >
                <span>{item.label}</span>
              </Link>
            ))}

            <button
              type="button"
              className="mt-1 flex items-center justify-between rounded-xl px-3 py-2 text-left text-slate-700 hover:bg-slate-100 hover:text-sky-600 dark:text-slate-200 dark:hover:bg-slate-900/80 dark:hover:text-cyan-300"
              aria-haspopup="true"
              aria-expanded={categoriesOpen}
              onClick={() => setCategoriesOpen((prev) => !prev)}
            >
              <span>Categories</span>
              <span className="text-[10px]">▾</span>
            </button>
            {categoriesOpen && (
              <div className="ml-2 mt-1 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-800/80" role="group">
                {categoryItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-cyan-300"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <a
              href="https://t.me/OfferZoneTamil"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-50 shadow-sm hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/70 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            >
              Join Telegram
            </a>

          </div>
        </div>
      )}
    </header>
  );
}
