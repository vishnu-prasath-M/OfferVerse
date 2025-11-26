import Image from "next/image"
import { prisma } from "@/lib/prisma"
import GoToDealButton from "@/components/go-to-deal-button"

export const dynamic = "force-dynamic"

export default async function DealDetailPage({ params }: { params: { id: string } }) {
  const deal = await prisma.deal.findUnique({ where: { id: params.id } })
  if (!deal) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-slate-200">Deal not found.</div>
      </main>
    )
  }
  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative h-64 w-full overflow-hidden rounded-xl bg-slate-900">
          {(deal as any).imageUrl ? (
            <Image
              src={(deal as any).imageUrl}
              alt={deal.title}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzFhMjAyYyIvPjwvc3ZnPg=="
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">No image</div>
          )}
          <div className="pointer-events-none absolute left-2 top-2 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold text-slate-950 shadow-sm">
            {deal.discount}% OFF
          </div>
          <div className="pointer-events-none absolute right-2 top-2 rounded-full bg-slate-950/80 px-2 py-0.5 text-[10px] font-medium text-slate-200 ring-1 ring-slate-700/80">
            {deal.source}
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-lg font-semibold text-slate-50">{deal.title}</h1>
          {deal.description && <p className="line-clamp-3 text-sm text-slate-300">{deal.description}</p>}
          <div className="flex items-baseline gap-3 text-sm">
            <span className="font-semibold text-lime-300">₹{deal.offerPrice.toFixed(0)}</span>
            <span className="text-xs text-slate-500 line-through">₹{deal.originalPrice.toFixed(0)}</span>
          </div>
          <div className="text-xs text-slate-400">Category: <span className="capitalize text-slate-200">{deal.category}</span></div>
          <div className="pt-2">
            <GoToDealButton id={deal.id} affiliateLink={(deal as any).affiliateLink || (deal as any).url} />
          </div>
        </div>
      </div>
    </main>
  )
}
