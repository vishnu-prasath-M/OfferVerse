import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { DealCard } from "@/components/deal-card";

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

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden border-b border-slate-800/70 bg-gradient-to-br from-navy via-navy to-slate-900">
        <div className="container-xl py-16">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h1 className="font-heading text-5xl font-semibold tracking-tight text-textPrimary">
                Discover The Best <span className="text-gradient">Loot Deals</span>
              </h1>
              <p className="mt-4 max-w-xl text-textSecondary">
                Amazon &amp; Flipkart offers curated &amp; verified. Only real discounts, no fake MRP. Join our Telegram for instant alerts.
              </p>
              <div className="mt-6 flex gap-3">
                <Link href="/deals" className="rounded-full bg-cyan px-6 py-2 font-medium text-navy shadow-glow">
                  Explore Deals
                </Link>
                <a
                  href="https://t.me/OfferZoneTamil"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-cyan/70 px-6 py-2 font-medium text-textPrimary"
                >
                  Join Telegram
                </a>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-4">
              <div className="mb-3 flex items-center justify-between text-xs text-textSecondary">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon" /> Live Flash Deals
                </span>
                <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">LIVE</span>
              </div>

              <div className="grid gap-2">
                {flash.slice(0, 3).map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-2">
                    <div className="max-w-[65%]">
                      <p className="truncate text-textPrimary">{d.discount}% OFF – {d.title}</p>
                      <p className="text-[10px] text-textSecondary">
                        {d.expiry ? `Expires in ${Math.max(0, Math.floor((d.expiry.getTime() - now.getTime()) / 60000))} min` : 'Limited time'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-semibold text-neon">₹{Math.round(d.offerPrice)}</p>
                      <p className="text-[10px] text-textSecondary line-through">₹{Math.round(d.originalPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-[11px] text-textSecondary">Auto-posted to @OfferZoneTamil all day in slots.</p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-heading text-xl text-textPrimary">Trending Now</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {trending.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-heading text-xl text-textPrimary">Best Offers</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {latest.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
