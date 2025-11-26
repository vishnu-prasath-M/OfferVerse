import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us – OfferVerse",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="border-b border-slate-800/70 bg-slate-950/90 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-2xl font-semibold text-slate-50">Contact OfferVerse</h1>
          <p className="mt-2 text-sm text-slate-400">
            Have a question, found a crazy loot deal, or want to partner? Send us a message and we&apos;ll
            get back to you.
          </p>

          <form className="mt-8 space-y-4 max-w-xl">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-slate-300">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/40 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-300">
                Email
                <span className="ml-1 text-red-400">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/40 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-medium text-slate-300">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/40 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1"
                placeholder="What is this about?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-medium text-slate-300">
                Message
                <span className="ml-1 text-red-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="mt-1 w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/40 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1"
                placeholder="Tell us how we can help..."
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_26px_rgba(34,211,238,0.8)] hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/80"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
