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
    <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/75 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4"
        aria-label="Main navigation"
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 shadow-[0_0_18px_rgba(15,23,42,0.9)] ring-1 ring-cyan-400/40">
            <span className="text-lg font-black text-cyan-300">
              %
            </span>
            <span className="pointer-events-none absolute -right-1 -bottom-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-violet-500 text-[9px] font-bold text-slate-950 shadow-[0_0_16px_rgba(124,58,237,0.9)]">
              ⚡
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-wide text-slate-50 transition-[text-shadow,color] group-hover:text-cyan-300 group-hover:[text-shadow:0_0_18px_rgba(34,211,238,0.8)]">
              OfferVerse
            </span>
            <span className="text-[10px] text-slate-400">
              Verified deals. Updated live.
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 lg:flex">
          <div className="flex items-center gap-6">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative inline-flex items-center py-1 transition-colors hover:text-cyan-300 focus:outline-none focus-visible:text-cyan-300"
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
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800/80 bg-slate-950/95 p-2 text-sm shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-xl"
                  role="menu"
                >
                  {categoryItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-slate-200 hover:bg-slate-900/80 hover:text-cyan-300 focus:outline-none focus-visible:bg-slate-900/80"
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
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/70 text-xs text-slate-300 shadow-sm transition hover:border-cyan-400/70 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☾" : "☀"}
            </button>

            <a
              href="https://t.me/OfferZoneTamil"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-cyan-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.7)] transition hover:bg-cyan-300 hover:shadow-[0_0_32px_rgba(34,211,238,0.95)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70"
            >
              <span>Join Telegram</span>
            </a>

          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/70 text-xs text-slate-300 shadow-sm transition hover:border-cyan-400/70 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☾" : "☀"}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/70 text-slate-200 shadow-sm transition hover:border-cyan-400/70 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span className="sr-only">Open main menu</span>
            <span className="text-lg">☰</span>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate-800/70 bg-slate-950/95 px-4 pb-4 pt-2 shadow-[0_14px_40px_rgba(15,23,42,0.9)] backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1 text-sm text-slate-200" role="menu" aria-label="Mobile navigation">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-slate-900/80 hover:text-cyan-300"
                role="menuitem"
                onClick={() => setMobileOpen(false)}
              >
                <span>{item.label}</span>
              </Link>
            ))}

            <button
              type="button"
              className="mt-1 flex items-center justify-between rounded-xl px-3 py-2 text-left text-slate-200 hover:bg-slate-900/80 hover:text-cyan-300"
              aria-haspopup="true"
              aria-expanded={categoriesOpen}
              onClick={() => setCategoriesOpen((prev) => !prev)}
            >
              <span>Categories</span>
              <span className="text-[10px]">▾</span>
            </button>
            {categoriesOpen && (
              <div className="ml-2 mt-1 space-y-1 border-l border-slate-800/80 pl-3" role="group">
                {categoryItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-900/80 hover:text-cyan-300"
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
              className="mt-3 inline-flex items-center justify-center rounded-full bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_22px_rgba(34,211,238,0.8)] hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,1)]"
            >
              Join Telegram
            </a>

          </div>
        </div>
      )}
    </header>
  );
}
