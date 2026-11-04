import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Loader2, Send, Trash2, X } from 'lucide-react'
import Button from '../ui/Button'
import {
  createCommentRequest,
  deleteCommentRequest,
  listCommentsRequest,
} from '../../services/commentService'
import { selectAuth } from '../../store/slices/authSlice'
import { getSocket } from '../../services/socket'

export default function TaskDetailsDrawer({ open, task, onClose }) {
  const { user } = useSelector(selectAuth)
  const [comments, setComments] = useState([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !task?.id) return undefined

    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await listCommentsRequest(task.id)
        if (active) setComments(data.data.comments || [])
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Failed to load comments')
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()

    const socket = getSocket()
    const onNew = (payload) => {
      if (String(payload.taskId) === String(task.id)) {
        setComments((prev) => [...prev, payload.comment])
      }
    }
    const onDeleted = (payload) => {
      if (String(payload.taskId) === String(task.id)) {
        setComments((prev) => prev.filter((c) => c.id !== payload.commentId))
      }
    }
    socket?.on('comment:new', onNew)
    socket?.on('comment:deleted', onDeleted)

    return () => {
      active = false
      socket?.off('comment:new', onNew)
      socket?.off('comment:deleted', onDeleted)
    }
  }, [open, task?.id])

  if (!open || !task) return null

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!body.trim()) return
    setSending(true)
    setError('')
    try {
      const { data } = await createCommentRequest(task.id, body.trim())
      setComments((prev) => {
        if (prev.some((c) => c.id === data.data.comment.id)) return prev
        return [...prev, data.data.comment]
      })
      setBody('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment')
    } finally {
      setSending(false)
    }
  }

  const onDelete = async (commentId) => {
    try {
      await deleteCommentRequest(commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment')
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button
        type="button"
        aria-label="Close task details"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0B1020] shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-white/5 px-5 py-4">
          <div>
            <p className="text-xs tracking-wide text-nexora-muted uppercase">
              Task details
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold">{task.title}</h2>
            <p className="mt-2 text-sm text-nexora-muted">
              {task.description || 'No description'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-nexora-muted">
              <span className="rounded-md border border-white/10 px-2 py-1 uppercase">
                {task.status.replace('_', ' ')}
              </span>
              <span className="rounded-md border border-white/10 px-2 py-1 uppercase">
                {task.priority}
              </span>
              {task.assignee?.name && (
                <span className="rounded-md border border-white/10 px-2 py-1">
                  {task.assignee.name}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-nexora-muted hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <h3 className="font-display text-sm font-semibold">Comments</h3>
          {loading ? (
            <p className="mt-4 text-sm text-nexora-muted">Loading…</p>
          ) : !comments.length ? (
            <p className="mt-4 text-sm text-nexora-muted">
              No comments yet. Start the conversation.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">
                        {comment.author?.name || 'User'}
                      </p>
                      <p className="mt-1 text-sm text-nexora-muted">{comment.body}</p>
                      <p className="mt-2 text-[11px] text-nexora-muted">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {(comment.author?.id === user?.id ||
                      String(comment.author?.id) === String(user?.id)) && (
                      <button
                        type="button"
                        onClick={() => onDelete(comment.id)}
                        className="text-nexora-muted hover:text-nexora-accent"
                        aria-label="Delete comment"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {error && <p className="mt-3 text-sm text-nexora-accent">{error}</p>}
        </div>

        <form onSubmit={onSubmit} className="border-t border-white/5 p-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Write a comment…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm outline-none focus:border-nexora-secondary/50"
          />
          <Button type="submit" className="mt-3 w-full" disabled={sending || !body.trim()}>
            {sending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Posting…
              </>
            ) : (
              <>
                <Send size={16} />
                Post comment
              </>
            )}
          </Button>
        </form>
      </aside>
    </div>
  )
}
