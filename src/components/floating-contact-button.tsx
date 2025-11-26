"use client";

import { useRouter } from "next/navigation";

export function FloatingContactButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/contact");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Contact OfferVerse"
      className="fixed bottom-4 right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-slate-50 shadow-sm ring-1 ring-sky-400/70 transition hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/80 dark:bg-cyan-400 dark:text-slate-950 dark:ring-cyan-400/70 dark:hover:bg-cyan-300 md:bottom-6 md:right-6"
    >
      <span className="text-lg">✉</span>
    </button>
  );
}
