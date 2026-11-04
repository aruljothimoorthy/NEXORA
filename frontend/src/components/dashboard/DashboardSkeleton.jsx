export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-72 rounded-xl bg-white/5" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="h-80 rounded-2xl bg-white/5" />
        <div className="h-80 rounded-2xl bg-white/5" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 rounded-2xl bg-white/5" />
        <div className="h-72 rounded-2xl bg-white/5" />
      </div>
    </div>
  )
}
