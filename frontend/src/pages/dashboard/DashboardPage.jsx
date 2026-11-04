import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CheckCircle2,
  FolderKanban,
  Loader2,
  Sparkles,
  CircleDashed,
} from 'lucide-react'
import { selectAuth } from '../../store/slices/authSlice'
import {
  fetchDashboard,
  seedDemoDashboard,
  selectDashboard,
} from '../../store/slices/dashboardSlice'
import StatCard from '../../components/dashboard/StatCard'
import UpcomingDeadlines from '../../components/dashboard/UpcomingDeadlines'
import RecentActivities from '../../components/dashboard/RecentActivities'
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton'
import ProductivityChart from '../../components/charts/ProductivityChart'
import ProjectProgressChart from '../../components/charts/ProjectProgressChart'
import Button from '../../components/ui/Button'

export default function DashboardPage() {
  const dispatch = useDispatch()
  const { user } = useSelector(selectAuth)
  const {
    stats,
    productivityChart,
    projectProgress,
    upcomingDeadlines,
    recentActivities,
    status,
    seedStatus,
    error,
  } = useSelector(selectDashboard)

  const firstName = user?.name?.split(' ')[0] || 'there'
  const isEmpty =
    status === 'succeeded' &&
    stats.totalProjects === 0 &&
    stats.completedTasks === 0 &&
    stats.pendingTasks === 0

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [dispatch])

  if (status === 'loading' || status === 'idle') {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.28em] text-nexora-secondary uppercase">
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 max-w-2xl text-nexora-muted">
            Here’s your live snapshot across projects, tasks, and deadlines.
          </p>
        </div>

        {isEmpty && (
          <Button
            type="button"
            onClick={() => dispatch(seedDemoDashboard())}
            disabled={seedStatus === 'loading'}
          >
            {seedStatus === 'loading' ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Loading demo…
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Load demo data
              </>
            )}
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-nexora-accent/30 bg-nexora-accent/10 px-4 py-3 text-sm text-nexora-accent">
          {error}
        </div>
      )}

      {isEmpty && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-8 text-center">
          <p className="font-display text-lg font-semibold">Your workspace is empty</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-nexora-muted">
            Load demo analytics to explore the dashboard now, or wait for Phase 5
            project/task CRUD to build real data.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total projects"
          value={stats.totalProjects}
          icon={FolderKanban}
          tone="primary"
        />
        <StatCard
          label="Active projects"
          value={stats.activeProjects}
          icon={Sparkles}
          tone="secondary"
        />
        <StatCard
          label="Completed tasks"
          value={stats.completedTasks}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Pending tasks"
          value={stats.pendingTasks}
          icon={CircleDashed}
          tone="accent"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ProductivityChart data={productivityChart} />
        <ProjectProgressChart data={projectProgress} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <UpcomingDeadlines items={upcomingDeadlines} />
        <RecentActivities items={recentActivities} />
      </div>
    </div>
  )
}
