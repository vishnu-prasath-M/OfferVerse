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
      className="fixed bottom-4 right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.9)] ring-1 ring-cyan-300/70 transition hover:bg-cyan-300 hover:shadow-[0_0_40px_rgba(34,211,238,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/80 md:bottom-6 md:right-6"
    >
      <span className="text-lg">✉</span>
    </button>
  );
}
