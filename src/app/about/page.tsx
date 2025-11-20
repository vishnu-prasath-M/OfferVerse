import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About – OfferVerse",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="border-b border-slate-800/70 bg-slate-950/90 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-2xl font-semibold text-slate-50">About OfferVerse</h1>
          <p className="mt-3 text-sm text-slate-400">
            OfferVerse curates the best Amazon and Flipkart deals for the @OfferZoneTamil community, focusing on
            high real discounts, trusted sellers, and fast loot alerts.
          </p>
          <p className="mt-3 text-sm text-slate-400">
            Behind the scenes, OfferVerse uses scheduled posting, Telegram integration, and automated price
            tracking to surface only the hottest offers so you don&apos;t miss limited-time flash sales.
          </p>
        </div>
      </section>
    </main>
  );
}
