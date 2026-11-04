import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Search } from 'lucide-react'
import KanbanColumn from './KanbanColumn'
import TaskFormModal from '../tasks/TaskFormModal'
import TaskDetailsDrawer from '../tasks/TaskDetailsDrawer'
import {
  deleteTask,
  moveTask,
  optimisticMove,
  selectTasks,
} from '../../store/slices/tasksSlice'
import { PRIORITIES, TASK_COLUMNS } from '../../utils/projectConstants'
import Select from '../ui/Select'

function findContainer(board, id) {
  if (TASK_COLUMNS.some((c) => c.id === id)) return id
  return TASK_COLUMNS.map((c) => c.id).find((columnId) =>
    board[columnId]?.some((task) => task.id === id),
  )
}

export default function KanbanBoard({ projectId, members = [] }) {
  const dispatch = useDispatch()
  const { board } = useSelector(selectTasks)
  const [activeTask, setActiveTask] = useState(null)
  const [modal, setModal] = useState({
    open: false,
    task: null,
    defaultStatus: 'todo',
  })
  const [detailsTask, setDetailsTask] = useState(null)
  const [taskSearch, setTaskSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  )

  const filteredBoard = useMemo(() => {
    const query = taskSearch.trim().toLowerCase()
    const next = {}
    TASK_COLUMNS.forEach((column) => {
      next[column.id] = (board[column.id] || []).filter((task) => {
        const matchesQuery =
          !query ||
          task.title.toLowerCase().includes(query) ||
          (task.description || '').toLowerCase().includes(query)
        const matchesPriority =
          priorityFilter === 'all' || task.priority === priorityFilter
        return matchesQuery && matchesPriority
      })
    })
    return next
  }, [board, taskSearch, priorityFilter])

  const flatTasks = useMemo(
    () => TASK_COLUMNS.flatMap((column) => board[column.id] || []),
    [board],
  )

  const onDragStart = (event) => {
    const task = flatTasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const onDragEnd = async (event) => {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const activeId = active.id
    const overId = over.id
    const from = findContainer(board, activeId)
    const to = findContainer(board, overId)
    if (!from || !to) return

    const fromTasks = [...(board[from] || [])]
    const toTasks = from === to ? fromTasks : [...(board[to] || [])]
    const activeIndex = fromTasks.findIndex((t) => t.id === activeId)
    if (activeIndex < 0) return

    let overIndex =
      overId === to
        ? toTasks.length
        : toTasks.findIndex((t) => t.id === overId)
    if (overIndex < 0) overIndex = toTasks.length

    let nextOrder = overIndex

    if (from === to) {
      const moved = arrayMove(fromTasks, activeIndex, overIndex)
      nextOrder = moved.findIndex((t) => t.id === activeId)
    } else if (overId === to) {
      nextOrder = toTasks.length
    }

    dispatch(
      optimisticMove({
        id: activeId,
        status: to,
        order: nextOrder,
      }),
    )

    await dispatch(
      moveTask({
        id: activeId,
        status: to,
        order: nextOrder,
      }),
    )
  }

  const onDelete = async (task) => {
    const confirmed = window.confirm(`Delete task “${task.title}”?`)
    if (!confirmed) return
    await dispatch(deleteTask(task.id))
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-nexora-muted"
          />
          <input
            value={taskSearch}
            onChange={(e) => setTaskSearch(e.target.value)}
            placeholder="Filter tasks on this board…"
            className="w-full rounded-xl border border-white/10 bg-transparent py-2.5 pr-3 pl-9 text-sm outline-none focus:border-nexora-secondary/50"
          />
        </div>
        <Select
          id="board-priority-filter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          options={[{ value: 'all', label: 'All priorities' }, ...PRIORITIES]}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-2">
          {TASK_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={filteredBoard[column.id] || []}
              onAdd={(status) =>
                setModal({ open: true, task: null, defaultStatus: status })
              }
              onEdit={(task) =>
                setModal({ open: true, task, defaultStatus: task.status })
              }
              onDelete={onDelete}
              onOpen={setDetailsTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-[256px] rounded-xl border border-nexora-primary/40 bg-[#0B1020] p-3 shadow-xl">
              <p className="text-sm font-semibold">{activeTask.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskFormModal
        open={modal.open}
        onClose={() => setModal({ open: false, task: null, defaultStatus: 'todo' })}
        projectId={projectId}
        task={modal.task}
        defaultStatus={modal.defaultStatus}
        members={members}
      />

      <TaskDetailsDrawer
        open={Boolean(detailsTask)}
        task={detailsTask}
        onClose={() => setDetailsTask(null)}
      />
    </div>
  )
}
