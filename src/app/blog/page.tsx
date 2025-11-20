import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog – OfferVerse",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="border-b border-slate-800/70 bg-slate-950/90 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-2xl font-semibold text-slate-50">OfferVerse Blog</h1>
          <p className="mt-3 text-sm text-slate-400">
            Tips, guides, and updates about finding the best loot deals online.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-800/80 bg-slate-950/80 px-4 py-8 text-center text-sm text-slate-400">
            <p className="font-medium text-slate-200">No blog posts found</p>
            <p className="mt-1 text-xs text-slate-500">
              We haven&apos;t published any articles yet. Check back soon for OfferVerse tips and buying guides.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
