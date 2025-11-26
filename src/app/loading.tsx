import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container-xl py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-72 w-full rounded-3xl" />
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}