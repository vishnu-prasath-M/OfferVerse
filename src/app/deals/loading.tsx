export default function LoadingDeals() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 h-6 w-32 animate-pulse rounded bg-slate-800" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="h-40 w-full bg-slate-800" />
            <div className="space-y-3 p-3">
              <div className="h-3 w-3/4 rounded bg-slate-800" />
              <div className="h-3 w-1/2 rounded bg-slate-800" />
              <div className="h-3 w-1/3 rounded bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}