export default function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-nexora-muted">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-nexora-secondary/30 border-t-nexora-secondary" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
