"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Deal } from "@prisma/client";
import { DealCard } from "@/components/deal-card";

type HeroSectionProps = {
  latest: Deal[];
  trending: Deal[];
  flash: Deal[];
};

export function HeroSection({ latest, trending, flash }: HeroSectionProps) {
  const now = new Date();

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 dark:border-slate-800/70 dark:bg-slate-950">
      <div className="container-xl flex flex-col items-center gap-10 py-16 md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6 text-center md:text-left max-w-xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Real-time offers from Amazon &amp; Flipkart</span>
          </div>

          <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-slate-50">
            Loot deals that actually
            <span className="block text-sky-500 dark:text-cyan-400">save you money.</span>
          </h1>

          <p className="mx-auto max-w-xl text-sm text-slate-600 md:text-base dark:text-slate-300">
            OfferVerse monitors trusted marketplaces and surfaces only genuine discounts.
            No fake MRPs, no spam—just curated offers you can trust.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-start sm:gap-4">
            <Link
              href="/deals"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-50 shadow-sm transition hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/70 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            >
              Explore Deals
            </Link>
            <a
              href="https://t.me/OfferZoneTamil"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
            >
              Join Telegram
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="w-full max-w-md rounded-3xl bg-white/70 p-4 shadow-lg ring-1 ring-slate-200 dark:bg-slate-900/80 dark:ring-slate-800"
        >
          <div className="mb-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live flash deals
            </span>
            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-500">LIVE</span>
          </div>

          <div className="space-y-2">
            {flash.slice(0, 3).map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-2xl bg-slate-100 px-3 py-2 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <div className="max-w-[65%]">
                  <p className="truncate font-medium">
                    {d.discount}% OFF  {d.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                    {d.expiry
                      ? `Expires in ${Math.max(0, Math.floor(((d.expiry as unknown as Date).getTime() - now.getTime()) / 60000))} min`
                      : "Limited time"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-semibold text-sky-600 dark:text-cyan-400">
                    {Math.round(d.offerPrice)}
                  </p>
                  <p className="text-[10px] text-slate-400 line-through">
                    {Math.round(d.originalPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            Auto-posted to @OfferZoneTamil throughout the day.
          </p>
        </motion.div>
      </div>

      <section className="border-t border-slate-100 bg-slate-50/90 py-10 dark:border-slate-800 dark:bg-slate-950/90">
        <div className="container-xl space-y-10">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-50">Trending now</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {trending.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-50">Best offers</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {latest.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
