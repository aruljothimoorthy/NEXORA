import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-semibold tracking-[0.28em] text-nexora-secondary uppercase">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold">Page not found</h1>
      <p className="mt-3 max-w-md text-nexora-muted">
        That route doesn’t exist. Head back home or open your workspace.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/">Go home</Button>
        <Button to="/app/dashboard" variant="secondary">
          Open dashboard
        </Button>
      </div>
    </section>
  )
}
