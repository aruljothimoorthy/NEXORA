import { useEffect, useState } from 'react'
import { Loader2, UserPlus } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import {
  inviteMemberRequest,
  listTeamRequest,
  removeMemberRequest,
  updateMemberRoleRequest,
} from '../../services/teamService'
import { joinProjectRoom, leaveProjectRoom } from '../../hooks/useSocket'
import { getSocket } from '../../services/socket'

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
]

export default function TeamPanel({ projectId, onMembersChange }) {
  const [members, setMembers] = useState([])
  const [canManage, setCanManage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadTeam = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await listTeamRequest(projectId)
      setMembers(data.data.members || [])
      setCanManage(Boolean(data.data.canManage))
      onMembersChange?.(data.data.members || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load team')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeam()
    joinProjectRoom(projectId)

    const socket = getSocket()
    const onTeamUpdated = (payload) => {
      if (String(payload.projectId) === String(projectId)) {
        setMembers(payload.members || [])
        onMembersChange?.(payload.members || [])
      }
    }
    socket?.on('team:updated', onTeamUpdated)

    return () => {
      socket?.off('team:updated', onTeamUpdated)
      leaveProjectRoom(projectId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  const onInvite = async (event) => {
    event.preventDefault()
    setInviting(true)
    setError('')
    setMessage('')
    try {
      const { data } = await inviteMemberRequest(projectId, { email, role })
      setMembers(data.data.members || [])
      onMembersChange?.(data.data.members || [])
      setEmail('')
      setMessage('Member invited successfully')
    } catch (err) {
      setError(err.response?.data?.message || 'Invite failed')
    } finally {
      setInviting(false)
    }
  }

  const onRoleChange = async (userId, nextRole) => {
    try {
      const { data } = await updateMemberRoleRequest(projectId, userId, nextRole)
      setMembers(data.data.members || [])
      onMembersChange?.(data.data.members || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role')
    }
  }

  const onRemove = async (userId, name) => {
    const confirmed = window.confirm(`Remove ${name} from this project?`)
    if (!confirmed) return
    try {
      const { data } = await removeMemberRequest(projectId, userId)
      setMembers(data.data.members || [])
      onMembersChange?.(data.data.members || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member')
    }
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center gap-2">
        <UserPlus size={16} className="text-nexora-secondary" />
        <h2 className="font-display text-lg font-semibold">Team management</h2>
      </div>

      {loading ? (
        <p className="text-sm text-nexora-muted">Loading team…</p>
      ) : (
        <ul className="space-y-2">
          {members.map((member) => {
            const user = member.user || {}
            const isOwner = member.role === 'owner'
            return (
              <li
                key={user.id || member.role}
                className="flex flex-col gap-2 rounded-xl border border-white/5 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-nexora-muted">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {canManage && !isOwner ? (
                    <>
                      <select
                        value={member.role}
                        onChange={(e) => onRoleChange(user.id, e.target.value)}
                        className="rounded-lg border border-white/10 bg-transparent px-2 py-1 text-xs"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#0B1020]">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => onRemove(user.id, user.name)}
                        className="text-xs font-medium text-nexora-accent hover:underline"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-xs tracking-wide text-nexora-muted uppercase">
                      {member.role}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {canManage && (
        <form onSubmit={onInvite} className="mt-4 space-y-3 border-t border-white/5 pt-4">
          <p className="text-xs text-nexora-muted">
            Invite an existing NEXORA user by email.
          </p>
          <Input
            id="invite-email"
            type="email"
            placeholder="teammate@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Select
            id="invite-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={ROLE_OPTIONS}
          />
          <Button type="submit" className="w-full" disabled={inviting}>
            {inviting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Inviting…
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Invite member
              </>
            )}
          </Button>
        </form>
      )}

      {error && <p className="mt-3 text-sm text-nexora-accent">{error}</p>}
      {message && <p className="mt-3 text-sm text-nexora-success">{message}</p>}
    </div>
  )
}
