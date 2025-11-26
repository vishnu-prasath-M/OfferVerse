import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog – OfferVerse",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <section className="border-b border-slate-200 bg-white py-12 dark:border-slate-800/70 dark:bg-slate-950/90">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">OfferVerse Blog</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Tips, guides, and updates about finding the best loot deals online.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/80 dark:text-slate-300">
            <p className="font-medium text-slate-800 dark:text-slate-100">No blog posts found</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              We haven&apos;t published any articles yet. Check back soon for OfferVerse tips and buying guides.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
