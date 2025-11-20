import Link from "next/link";
import Image from "next/image";
import type { Deal } from "@prisma/client";

type DealCardProps = {
  deal: Deal;
};

export function DealCard({ deal }: DealCardProps) {
  const discountLabel = `${deal.discount}% OFF`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/80 shadow-[0_20px_60px_rgba(15,23,42,0.85)] transition hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-[0_24px_70px_rgba(34,211,238,0.4)]">
      <div className="relative h-40 w-full overflow-hidden bg-slate-900">
        {deal.imageUrl ? (
          <Image
            src={deal.imageUrl}
            alt={deal.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
            No image
          </div>
        )}
        <div className="pointer-events-none absolute left-2 top-2 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold text-slate-950 shadow-sm">
          {discountLabel}
        </div>
        <div className="pointer-events-none absolute right-2 top-2 rounded-full bg-slate-950/80 px-2 py-0.5 text-[10px] font-medium text-slate-200 ring-1 ring-slate-700/80">
          {deal.source}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-3 pb-3 pt-3">
        <h2 className="line-clamp-2 text-sm font-semibold text-slate-50">
          {deal.title}
        </h2>
        {deal.description && (
          <p className="line-clamp-2 text-[11px] text-slate-400">{deal.description}</p>
        )}

        <div className="mt-1 flex items-baseline gap-2 text-sm">
          <span className="font-semibold text-lime-300">
            
            ₹{deal.offerPrice.toFixed(0)}
          </span>
          <span className="text-[11px] text-slate-500 line-through">
            ₹{deal.originalPrice.toFixed(0)}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <span className="rounded-full bg-slate-900/80 px-2 py-1 capitalize text-[10px] text-slate-300">
            {deal.category}
          </span>
          <Link
            href={`/deal/${deal.id}`}
            className="rounded-full bg-cyan-400 px-3 py-1 text-[11px] font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-300"
          >
            View Deal
          </Link>
        </div>
      </div>
    </article>
  );
}
