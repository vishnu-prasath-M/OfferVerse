"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { DealCard } from "./deal-card"

type Filters = {
  source?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  minDiscount?: number
  sort?: string
}

type DealsExplorerProps = {
  categories: string[]
}

export default function DealsExplorer({ categories }: DealsExplorerProps) {
  const [filters, setFilters] = useState<Filters>({ sort: "latest" })
  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const observerRef = useRef<HTMLDivElement | null>(null)

  const query = useMemo(() => {
    const sp = new URLSearchParams()
    if (filters.source) sp.set("source", filters.source)
    if (filters.category) sp.set("category", filters.category)
    if (filters.minPrice) sp.set("minPrice", String(filters.minPrice))
    if (filters.maxPrice) sp.set("maxPrice", String(filters.maxPrice))
    if (filters.minDiscount) sp.set("minDiscount", String(filters.minDiscount))
    if (filters.sort) sp.set("sort", filters.sort)
    sp.set("page", String(page))
    sp.set("perPage", "24")
    return sp.toString()
  }, [filters, page])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/deals?${query}`)
        const json = await res.json()
        if (cancelled) return
        setItems((prev) => (page === 1 ? json.items : [...prev, ...json.items]))
        const totalPages = Math.ceil(json.total / json.perPage)
        setHasMore(page < totalPages)
      } catch (e) {
        // noop
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [query, page])

  useEffect(() => {
    if (!observerRef.current) return
    const el = observerRef.current
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry.isIntersecting && hasMore && !loading) {
        setPage((p) => p + 1)
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [observerRef.current, hasMore, loading])

  function resetAndApply(next: Partial<Filters>) {
    setFilters((prev) => ({ ...prev, ...next }))
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <select
          className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200"
          value={filters.source || ""}
          onChange={(e) => resetAndApply({ source: e.target.value || undefined })}
        >
          <option value="">All sources</option>
          <option value="amazon">Amazon</option>
          <option value="flipkart">Flipkart</option>
          <option value="cuelinks">Cuelinks</option>
        </select>

        <select
          className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200"
          value={filters.category || ""}
          onChange={(e) => resetAndApply({ category: e.target.value || undefined })}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min price"
          className="w-24 rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200"
          value={filters.minPrice ?? ""}
          onChange={(e) => resetAndApply({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
        />
        <input
          type="number"
          placeholder="Max price"
          className="w-24 rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200"
          value={filters.maxPrice ?? ""}
          onChange={(e) => resetAndApply({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
        />
        <input
          type="number"
          placeholder= "% discount min"
          className="w-28 rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200"
          value={filters.minDiscount ?? ""}
          onChange={(e) => resetAndApply({ minDiscount: e.target.value ? Number(e.target.value) : undefined })}
        />

        <select
          className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200"
          value={filters.sort || "latest"}
          onChange={(e) => resetAndApply({ sort: e.target.value || "latest" })}
        >
          <option value="latest">Latest</option>
          <option value="discount">Highest Discount</option>
          <option value="price-asc">Price: Low to High</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {items.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>

      <div ref={observerRef} className="h-10 w-full" />
      {loading && <div className="text-center text-xs text-slate-400">Loading…</div>}
      {!hasMore && !loading && items.length > 0 && (
        <div className="text-center text-xs text-slate-500">No more deals</div>
      )}
    </div>
  )
}