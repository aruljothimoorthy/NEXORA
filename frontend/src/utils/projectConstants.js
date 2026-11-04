export const PROJECT_STATUSES = [
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On hold' },
  { value: 'completed', label: 'Completed' },
]

export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

export const TASK_COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-nexora-muted' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-nexora-secondary' },
  { id: 'review', title: 'Review', color: 'bg-nexora-accent' },
  { id: 'completed', title: 'Completed', color: 'bg-nexora-success' },
]

export const PROJECT_COLORS = [
  '#8B5CF6',
  '#06B6D4',
  '#EC4899',
  '#22C55E',
  '#F59E0B',
  '#3B82F6',
]

export function toDateInputValue(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}
