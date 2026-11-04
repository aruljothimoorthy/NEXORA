import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FolderKanban, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import ProjectFormModal from '../../components/projects/ProjectFormModal'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import {
  deleteProject,
  fetchProjects,
  selectProjects,
  setProjectFilters,
} from '../../store/slices/projectsSlice'
import {
  PRIORITIES,
  PROJECT_STATUSES,
} from '../../utils/projectConstants'

export default function ProjectsPage() {
  const dispatch = useDispatch()
  const { items, filters, status, error } = useSelector(selectProjects)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [searchInput, setSearchInput] = useState(filters.search || '')
  const debouncedSearch = useDebouncedValue(searchInput, 350)

  useEffect(() => {
    dispatch(setProjectFilters({ search: debouncedSearch }))
  }, [debouncedSearch, dispatch])

  useEffect(() => {
    dispatch(
      fetchProjects({
        search: filters.search,
        status: filters.status,
        priority: filters.priority,
      }),
    )
  }, [dispatch, filters.search, filters.status, filters.priority])

  const onDelete = async (project) => {
    const confirmed = window.confirm(
      `Delete project “${project.name}” and all of its tasks?`,
    )
    if (!confirmed) return
    await dispatch(deleteProject(project.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.28em] text-nexora-secondary uppercase">
            Projects
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            Your workspace
          </h1>
          <p className="mt-2 text-nexora-muted">
            Create, filter, and open projects to manage Kanban boards.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
        >
          <Plus size={16} />
          New project
        </Button>
      </div>

      <div className="grid gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-nexora-muted"
          />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or description…"
            className="w-full rounded-xl border border-white/10 bg-transparent py-2.5 pr-3 pl-9 text-sm outline-none focus:border-nexora-secondary/50"
          />
        </div>
        <Select
          id="filter-status"
          value={filters.status}
          onChange={(e) =>
            dispatch(setProjectFilters({ status: e.target.value }))
          }
          options={[{ value: 'all', label: 'All statuses' }, ...PROJECT_STATUSES]}
        />
        <Select
          id="filter-priority"
          value={filters.priority}
          onChange={(e) =>
            dispatch(setProjectFilters({ priority: e.target.value }))
          }
          options={[{ value: 'all', label: 'All priorities' }, ...PRIORITIES]}
        />
      </div>

      {error && (
        <div className="rounded-xl border border-nexora-accent/30 bg-nexora-accent/10 px-4 py-3 text-sm text-nexora-accent">
          {error}
        </div>
      )}

      {status === 'loading' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : !items.length ? (
        <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
          <FolderKanban className="mx-auto text-nexora-secondary" size={28} />
          <p className="mt-4 font-display text-lg font-semibold">No projects yet</p>
          <p className="mt-2 text-sm text-nexora-muted">
            Create your first project to unlock Kanban boards and analytics.
          </p>
          <Button
            className="mt-6"
            type="button"
            onClick={() => {
              setEditing(null)
              setModalOpen(true)
            }}
          >
            <Plus size={16} />
            Create project
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((project) => (
            <article
              key={project.id}
              className="group flex flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-white/15"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color || '#8B5CF6' }}
                  />
                  <div>
                    <Link
                      to={`/app/projects/${project.id}`}
                      className="font-display text-lg font-semibold hover:text-nexora-secondary"
                    >
                      {project.name}
                    </Link>
                    <p className="mt-1 text-xs tracking-wide text-nexora-muted uppercase">
                      {project.status.replace('_', ' ')} · {project.priority}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-3 line-clamp-2 flex-1 text-sm text-nexora-muted">
                {project.description || 'No description'}
              </p>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs text-nexora-muted">
                  <span>Progress</span>
                  <span>{project.progress || 0}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${project.progress || 0}%`,
                      backgroundColor: project.color || '#8B5CF6',
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/5 pt-4">
                <Link
                  to={`/app/projects/${project.id}`}
                  className="text-sm font-semibold text-nexora-secondary hover:text-nexora-text"
                >
                  Open board
                </Link>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(project)
                      setModalOpen(true)
                    }}
                    className="rounded-lg p-2 text-nexora-muted hover:bg-white/5 hover:text-nexora-text"
                    aria-label="Edit project"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(project)}
                    className="rounded-lg p-2 text-nexora-muted hover:bg-white/5 hover:text-nexora-accent"
                    aria-label="Delete project"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ProjectFormModal
        open={modalOpen}
        project={editing}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
      />
    </div>
  )
}
