import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About – OfferVerse",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <section className="border-b border-slate-200 bg-white py-12 dark:border-slate-800/70 dark:bg-slate-950/90">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">About OfferVerse</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            OfferVerse curates the best Amazon and Flipkart deals for the @OfferZoneTamil community, focusing on
            high real discounts, trusted sellers, and fast loot alerts.
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Behind the scenes, OfferVerse uses scheduled posting, Telegram integration, and automated price
            tracking to surface only the hottest offers so you don&apos;t miss limited-time flash sales.
          </p>
        </div>
      </section>
    </main>
  );
}
