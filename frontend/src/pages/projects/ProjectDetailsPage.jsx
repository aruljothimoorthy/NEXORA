import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  ArrowLeft,
  CalendarRange,
  Pencil,
  Trash2,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import ProjectFormModal from '../../components/projects/ProjectFormModal'
import KanbanBoard from '../../components/kanban/KanbanBoard'
import TeamPanel from '../../components/team/TeamPanel'
import {
  clearCurrentProject,
  deleteProject,
  fetchProjectDetails,
  selectProjects,
} from '../../store/slices/projectsSlice'
import { clearTasks, fetchBoard } from '../../store/slices/tasksSlice'

export default function ProjectDetailsPage() {
  const { projectId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { current, taskStats, recentActivities, detailStatus, error } =
    useSelector(selectProjects)
  const [editOpen, setEditOpen] = useState(false)
  const [liveMembers, setLiveMembers] = useState([])

  useEffect(() => {
    dispatch(fetchProjectDetails(projectId))
    dispatch(fetchBoard(projectId))
    return () => {
      dispatch(clearCurrentProject())
      dispatch(clearTasks())
    }
  }, [dispatch, projectId])

  useEffect(() => {
    if (current?.members) {
      setLiveMembers(current.members)
    }
  }, [current?.members])

  const onDelete = async () => {
    if (!current) return
    const confirmed = window.confirm(
      `Delete project “${current.name}” and all of its tasks?`,
    )
    if (!confirmed) return
    const result = await dispatch(deleteProject(current.id))
    if (deleteProject.fulfilled.match(result)) {
      navigate('/app/projects')
    }
  }

  if (detailStatus === 'loading' || detailStatus === 'idle') {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-white/5" />
        <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-96 animate-pulse rounded-2xl bg-white/5" />
      </div>
    )
  }

  if (!current) {
    return (
      <div className="rounded-2xl border border-nexora-accent/30 bg-nexora-accent/10 p-6">
        <p className="font-semibold text-nexora-accent">
          {error || 'Project not found'}
        </p>
        <Button to="/app/projects" className="mt-4" variant="secondary">
          Back to projects
        </Button>
      </div>
    )
  }

  const members = liveMembers.length ? liveMembers : current.members || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            to="/app/projects"
            className="inline-flex items-center gap-2 text-sm text-nexora-muted hover:text-nexora-text"
          >
            <ArrowLeft size={16} />
            All projects
          </Link>
          <div className="mt-3 flex items-center gap-3">
            <span
              className="h-3.5 w-3.5 rounded-full"
              style={{ backgroundColor: current.color || '#8B5CF6' }}
            />
            <h1 className="font-display text-3xl font-bold tracking-tight">
              {current.name}
            </h1>
          </div>
          <p className="mt-2 max-w-3xl text-nexora-muted">
            {current.description || 'No description provided.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-nexora-muted">
            <span className="rounded-lg border border-white/10 px-2.5 py-1 uppercase">
              {current.status.replace('_', ' ')}
            </span>
            <span className="rounded-lg border border-white/10 px-2.5 py-1 uppercase">
              {current.priority}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarRange size={14} />
              {current.dueDate
                ? `Due ${new Date(current.dueDate).toLocaleDateString()}`
                : 'No due date'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil size={16} />
            Edit
          </Button>
          <Button type="button" variant="secondary" onClick={onDelete}>
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Progress', value: `${current.progress || 0}%` },
          { label: 'Total tasks', value: taskStats?.total || 0 },
          { label: 'In progress', value: taskStats?.in_progress || 0 },
          { label: 'Completed', value: taskStats?.completed || 0 },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
          >
            <p className="text-xs text-nexora-muted">{card.label}</p>
            <p className="mt-2 font-display text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TeamPanel projectId={projectId} onMembersChange={setLiveMembers} />

        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <h2 className="font-display text-lg font-semibold">Recent activity</h2>
          {!recentActivities?.length ? (
            <p className="mt-3 text-sm text-nexora-muted">No activity yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {recentActivities.map((item) => (
                <li key={item.id} className="text-sm">
                  <p className="text-nexora-text">{item.message}</p>
                  <p className="mt-1 text-xs text-nexora-muted">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Kanban board</h2>
          <span className="text-xs text-nexora-muted">
            Drag cards between To Do, In Progress, Review, and Completed
          </span>
        </div>
        <KanbanBoard projectId={projectId} members={members} />
      </div>

      <ProjectFormModal
        open={editOpen}
        project={current}
        onClose={() => setEditOpen(false)}
      />
    </div>
  )
}
