import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Loader2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { createTask, updateTask } from '../../store/slices/tasksSlice'
import {
  PRIORITIES,
  TASK_COLUMNS,
  toDateInputValue,
} from '../../utils/projectConstants'

const emptyForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assignee: '',
  dueDate: '',
}

export default function TaskFormModal({
  open,
  onClose,
  projectId,
  task = null,
  defaultStatus = 'todo',
  members = [],
}) {
  const dispatch = useDispatch()
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const memberOptions = useMemo(
    () => [
      { value: '', label: 'Unassigned' },
      ...members.map((m) => ({
        value: m.user?.id || m.user?._id || m.user,
        label: m.user?.name || m.name || 'Member',
      })),
    ],
    [members],
  )

  useEffect(() => {
    if (!open) return
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        assignee: task.assignee?.id || '',
        dueDate: toDateInputValue(task.dueDate),
      })
    } else {
      setForm({ ...emptyForm, status: defaultStatus })
    }
    setError('')
  }, [open, task, defaultStatus])

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      setError('Task title is required')
      return
    }

    setLoading(true)
    const payload = {
      title: form.title.trim(),
      description: form.description,
      status: form.status,
      priority: form.priority,
      assignee: form.assignee || null,
      dueDate: form.dueDate || null,
    }

    const action = task
      ? await dispatch(updateTask({ id: task.id, payload }))
      : await dispatch(createTask({ projectId, payload }))

    setLoading(false)
    if (action.meta.requestStatus === 'fulfilled') {
      onClose?.()
    } else {
      setError(action.payload || 'Something went wrong')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit task' : 'Add task'} wide>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          id="title"
          name="title"
          label="Title"
          value={form.title}
          onChange={onChange}
          placeholder="Write API docs"
        />
        <div>
          <label htmlFor="task-description" className="mb-1.5 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="task-description"
            name="description"
            rows={3}
            value={form.description}
            onChange={onChange}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm outline-none focus:border-nexora-secondary/50"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            id="status"
            name="status"
            label="Status"
            value={form.status}
            onChange={onChange}
            options={TASK_COLUMNS.map((c) => ({ value: c.id, label: c.title }))}
          />
          <Select
            id="priority"
            name="priority"
            label="Priority"
            value={form.priority}
            onChange={onChange}
            options={PRIORITIES}
          />
          <Select
            id="assignee"
            name="assignee"
            label="Assignee"
            value={form.assignee}
            onChange={onChange}
            options={memberOptions}
          />
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            label="Deadline"
            value={form.dueDate}
            onChange={onChange}
          />
        </div>

        {error && <p className="text-sm text-nexora-accent">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving…
              </>
            ) : task ? (
              'Save changes'
            ) : (
              'Add task'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
