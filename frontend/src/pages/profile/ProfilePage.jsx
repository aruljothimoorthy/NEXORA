import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Camera, Loader2, UserRound } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import {
  clearAuthError,
  selectAuth,
  updateProfile,
} from '../../store/slices/authSlice'
import { getInitials, readImageAsDataUrl } from '../../utils/avatar'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { user, error, status } = useSelector(selectAuth)
  const [form, setForm] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
  })
  const [localError, setLocalError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  useEffect(() => {
    if (!user) return
    setForm({
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
    })
  }, [user])

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setSuccess('')
    setLocalError('')
  }

  const onAvatarChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await readImageAsDataUrl(file)
      setForm((prev) => ({ ...prev, avatar: dataUrl }))
      setLocalError('')
    } catch (err) {
      setLocalError(err.message)
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setSuccess('')
    setLocalError('')
    const result = await dispatch(updateProfile(form))
    setSaving(false)
    if (updateProfile.fulfilled.match(result)) {
      setSuccess('Profile updated successfully')
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.28em] text-nexora-secondary uppercase">
          Profile
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Your account
        </h1>
        <p className="mt-2 text-nexora-muted">
          Update your photo, bio, and contact details.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-3xl border border-white/8 bg-white/[0.03] p-6"
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            {form.avatar ? (
              <img
                src={form.avatar}
                alt={form.name || 'Avatar'}
                className="h-20 w-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl neon-gradient font-display text-xl font-bold text-white">
                {getInitials(form.name)}
              </div>
            )}
            <label className="absolute -right-2 -bottom-2 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-[#0B1020] text-nexora-muted hover:text-nexora-text">
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarChange}
              />
            </label>
          </div>
          <div>
            <p className="font-semibold">{form.name || 'Your name'}</p>
            <p className="text-sm text-nexora-muted">{form.email}</p>
            <p className="mt-1 text-xs text-nexora-muted">
              JPG/PNG under 350KB. Initials used when empty.
            </p>
          </div>
        </div>

        <Input
          id="name"
          name="name"
          label="Full name"
          value={form.name}
          onChange={onChange}
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={onChange}
        />
        <div>
          <label htmlFor="bio" className="mb-1.5 block text-sm font-medium">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            maxLength={300}
            value={form.bio}
            onChange={onChange}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm outline-none focus:border-nexora-secondary/50"
            placeholder="Product designer · shipping faster with NEXORA"
          />
          <p className="mt-1 text-xs text-nexora-muted">{form.bio.length}/300</p>
        </div>

        {(localError || error) && (
          <p className="text-sm text-nexora-accent">{localError || error}</p>
        )}
        {success && <p className="text-sm text-nexora-success">{success}</p>}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving || status === 'loading'}>
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <UserRound size={16} />
                Save profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
