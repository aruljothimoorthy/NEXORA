import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays, GripVertical, MessageSquare, Pencil, Trash2, UserRound } from 'lucide-react'

const priorityTone = {
  low: 'text-nexora-muted',
  medium: 'text-nexora-secondary',
  high: 'text-nexora-primary',
  urgent: 'text-nexora-accent',
}

export default function KanbanCard({ task, onEdit, onDelete, onOpen }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'task', task } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border border-white/8 bg-[#0B1020] p-3 shadow-sm ${
        isDragging ? 'opacity-60 ring-2 ring-nexora-primary/40' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-0.5 cursor-grab text-nexora-muted active:cursor-grabbing"
          aria-label="Drag task"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-nexora-text">{task.title}</p>
          {task.description ? (
            <p className="mt-1 line-clamp-2 text-xs text-nexora-muted">
              {task.description}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            <span
              className={`font-semibold tracking-wide uppercase ${
                priorityTone[task.priority] || priorityTone.medium
              }`}
            >
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="inline-flex items-center gap-1 text-nexora-muted">
                <CalendarDays size={12} />
                {new Date(task.dueDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
            {task.assignee?.name && (
              <span className="inline-flex items-center gap-1 text-nexora-muted">
                <UserRound size={12} />
                {task.assignee.name.split(' ')[0]}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-1">
        <button
          type="button"
          onClick={() => onOpen?.(task)}
          className="rounded-lg p-1.5 text-nexora-muted hover:bg-white/5 hover:text-nexora-text"
          aria-label="Open comments"
        >
          <MessageSquare size={14} />
        </button>
        <button
          type="button"
          onClick={() => onEdit?.(task)}
          className="rounded-lg p-1.5 text-nexora-muted hover:bg-white/5 hover:text-nexora-text"
          aria-label="Edit task"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(task)}
          className="rounded-lg p-1.5 text-nexora-muted hover:bg-white/5 hover:text-nexora-accent"
          aria-label="Delete task"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
