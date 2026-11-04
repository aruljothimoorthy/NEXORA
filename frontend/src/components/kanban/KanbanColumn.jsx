import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import KanbanCard from './KanbanCard'

export default function KanbanColumn({
  column,
  tasks,
  onAdd,
  onEdit,
  onDelete,
  onOpen,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', status: column.id },
  })

  return (
    <div
      className={`flex min-h-[420px] w-[280px] shrink-0 flex-col rounded-2xl border bg-white/[0.02] ${
        isOver ? 'border-nexora-secondary/50' : 'border-white/8'
      }`}
    >
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
          <h3 className="text-sm font-semibold">{column.title}</h3>
          <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[11px] text-nexora-muted">
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAdd?.(column.id)}
          className="rounded-lg p-1.5 text-nexora-muted hover:bg-white/5 hover:text-nexora-text"
          aria-label={`Add task to ${column.title}`}
        >
          <Plus size={16} />
        </button>
      </div>

      <div ref={setNodeRef} className="flex flex-1 flex-col gap-2 px-2 pb-3">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onOpen={onOpen}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
