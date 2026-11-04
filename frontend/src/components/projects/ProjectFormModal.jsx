import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import {
  createProject,
  selectProjects,
  updateProject,
} from '../../store/slices/projectsSlice'
import {
  PRIORITIES,
  PROJECT_COLORS,
  PROJECT_STATUSES,
  toDateInputValue,
} from '../../utils/projectConstants'

const emptyForm = {
  name: '',
  description: '',
  status: 'planning',
  priority: 'medium',
  startDate: toDateInputValue(new Date()),
  dueDate: '',
  color: PROJECT_COLORS[0],
}

export default function ProjectFormModal({ open, onClose, project = null }) {
  const dispatch = useDispatch()
  const { mutationStatus, error } = useSelector(selectProjects)
  const [form, setForm] = useState(emptyForm)
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    if (!open) return
    if (project) {
      setForm({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'planning',
        priority: project.priority || 'medium',
        startDate: toDateInputValue(project.startDate),
        dueDate: toDateInputValue(project.dueDate),
        color: project.color || PROJECT_COLORS[0],
      })
    } else {
      setForm(emptyForm)
    }
    setLocalError('')
  }, [open, project])

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setLocalError('Project name is required')
      return
    }

    const payload = {
      ...form,
      startDate: form.startDate || null,
      dueDate: form.dueDate || null,
    }

    const action = project
      ? await dispatch(updateProject({ id: project.id, payload }))
      : await dispatch(createProject(payload))

    if (action.meta.requestStatus === 'fulfilled') {
      onClose?.()
    }
  }

  const loading = mutationStatus === 'loading'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={project ? 'Edit project' : 'Create project'}
      wide
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          id="name"
          name="name"
          label="Name"
          value={form.name}
          onChange={onChange}
          placeholder="Website redesign"
        />
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            onChange={onChange}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm outline-none focus:border-nexora-secondary/50"
            placeholder="What is this project about?"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            id="status"
            name="status"
            label="Status"
            value={form.status}
            onChange={onChange}
            options={PROJECT_STATUSES}
          />
          <Select
            id="priority"
            name="priority"
            label="Priority"
            value={form.priority}
            onChange={onChange}
            options={PRIORITIES}
          />
          <Input
            id="startDate"
            name="startDate"
            type="date"
            label="Start date"
            value={form.startDate}
            onChange={onChange}
          />
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            label="Due date"
            value={form.dueDate}
            onChange={onChange}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Color</p>
          <div className="flex flex-wrap gap-2">
            {PROJECT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, color }))}
                className={`h-8 w-8 rounded-full border-2 ${
                  form.color === color ? 'border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        {(localError || error) && (
          <p className="text-sm text-nexora-accent">{localError || error}</p>
        )}

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
            ) : project ? (
              'Save changes'
            ) : (
              'Create project'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
