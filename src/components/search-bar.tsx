"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get("q") ?? "";
    setValue(q);
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) {
      params.set("q", value.trim());
    }
    router.push(`/deals${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex w-full max-w-xl items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/70 px-3 py-1.5 text-sm text-slate-100 shadow-[0_0_32px_rgba(15,23,42,0.85)] backdrop-blur-xl"
      role="search"
      aria-label="Search deals, brands, products"
    >
      <span className="text-slate-500 text-xs ml-1">🔍</span>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search deals, brands, products..."
        className="flex-1 bg-transparent px-2 py-1 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
        aria-label="Search deals"
      />
      <button
        type="submit"
        className="inline-flex items-center rounded-full bg-cyan-400 px-3 py-1 text-[11px] font-semibold text-slate-950 shadow-[0_0_22px_rgba(34,211,238,0.8)] hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70"
      >
        Search
      </button>
    </form>
  );
}
