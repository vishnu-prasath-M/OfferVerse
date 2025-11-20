import { prisma } from "@/lib/prisma"
import DealsExplorer from "@/components/deals-explorer"

export const dynamic = "force-dynamic"

export default async function DealsPage() {
  const catsRaw = await prisma.deal.findMany({ select: { category: true }, distinct: ["category"] })
  const categories = catsRaw.map((c) => c.category).filter(Boolean)

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold text-slate-50">All Deals</h1>
      <DealsExplorer categories={categories as string[]} />
    </main>
  )
}
