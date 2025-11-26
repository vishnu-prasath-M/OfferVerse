import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DealCard } from "@/components/deal-card";
import { HeroSection } from "@/components/hero-section";

export const dynamic = "force-dynamic";

function score(d: { discount: number; recentClicks: number }) {
  return d.discount * 0.6 + d.recentClicks * 0.4;
}

export default async function Home() {
  const latest = await prisma.deal.findMany({ orderBy: { createdAt: "desc" }, take: 12 });
  const trending = [...latest].sort((a, b) => score(b) - score(a)).slice(0, 8);
  const now = new Date();
  const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const flash = await prisma.deal.findMany({
    where: { OR: [{ expiry: { gt: now, lt: soon } }, { expiry: null }], discount: { gte: 40 } },
    orderBy: { discount: "desc" },
    take: 8,
  });

  const categories = Array.from(new Set(latest.map((d) => d.category).filter(Boolean))) as string[];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <HeroSection latest={latest} trending={trending} flash={flash} />

      <section className="border-t border-slate-100 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="container-xl grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] items-start">
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-50">Flash deals</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              High-discount offers that are about to expire soon.
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {flash.slice(0, 6).map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">Why shoppers use OfferVerse</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="mt-0.5 text-sky-500 dark:text-cyan-400">&#x2022;</span>
                <span>Hand-picked deals from Amazon &amp; Flipkart with real discounts, not inflated MRPs.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-sky-500 dark:text-cyan-400">&#x2022;</span>
                <span>Smart filtering by category, discount and price to find exactly what you need.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-sky-500 dark:text-cyan-400">&#x2022;</span>
                <span>Telegram alerts so you never miss time-sensitive lightning deals.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="container-xl space-y-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-50">Browse by category</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Quickly jump into popular deal categories.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link
                key={c}
                href={`/deals?category=${encodeURIComponent(c!)}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 dark:bg-cyan-400" />
                <span className="capitalize">{c}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="container-xl grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-50">Recently updated deals</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Fresh offers that were just added or updated in the last few hours.
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {latest.slice(0, 6).map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-slate-50 to-slate-100 p-6 text-slate-800 shadow-sm dark:border-cyan-500/20 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50">
            <h3 className="font-heading text-lg font-semibold">Get alerts before deals expire</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Join our Telegram channel to receive instant notifications when we post new loot deals and flash offers.
            </p>
            <a
              href="https://t.me/OfferZoneTamil"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-slate-50 shadow-sm transition hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/70 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            >
              Join Telegram for free alerts
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
