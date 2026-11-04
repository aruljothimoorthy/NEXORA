import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2, Moon, Shield, Sun } from 'lucide-react'
import Button from '../../components/ui/Button'
import PasswordInput from '../../components/ui/PasswordInput'
import {
  changePassword,
  clearAuthError,
  deactivateAccount,
  selectAuth,
  updateSettings,
} from '../../store/slices/authSlice'
import { useTheme } from '../../context/ThemeContext'
import { disconnectSocket } from '../../services/socket'

export default function SettingsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, error } = useSelector(selectAuth)
  const { setThemeLocal } = useTheme()

  const [prefs, setPrefs] = useState({
    theme: 'dark',
    emailNotifications: true,
    pushNotifications: true,
    deadlineReminders: true,
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [deactivatePassword, setDeactivatePassword] = useState('')
  const [message, setMessage] = useState('')
  const [localError, setLocalError] = useState('')
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  useEffect(() => {
    if (!user?.settings) return
    setPrefs({
      theme: user.settings.theme || 'dark',
      emailNotifications: user.settings.emailNotifications !== false,
      pushNotifications: user.settings.pushNotifications !== false,
      deadlineReminders: user.settings.deadlineReminders !== false,
    })
  }, [user])

  const savePrefs = async (nextPrefs) => {
    setSavingPrefs(true)
    setMessage('')
    setLocalError('')
    setThemeLocal(nextPrefs.theme)
    const result = await dispatch(updateSettings(nextPrefs))
    setSavingPrefs(false)
    if (updateSettings.fulfilled.match(result)) {
      setMessage('Settings saved')
    }
  }

  const onToggle = (key) => {
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    savePrefs(next)
  }

  const onThemeChange = (theme) => {
    const next = { ...prefs, theme }
    setPrefs(next)
    savePrefs(next)
  }

  const onPasswordSubmit = async (event) => {
    event.preventDefault()
    setLocalError('')
    setMessage('')
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }
    setSavingPassword(true)
    const result = await dispatch(changePassword(passwordForm))
    setSavingPassword(false)
    if (changePassword.fulfilled.match(result)) {
      disconnectSocket()
      navigate('/login', { replace: true })
    }
  }

  const onDeactivate = async (event) => {
    event.preventDefault()
    const confirmed = window.confirm(
      'Deactivate your account? You will be signed out immediately.',
    )
    if (!confirmed) return
    const result = await dispatch(
      deactivateAccount({ password: deactivatePassword }),
    )
    if (deactivateAccount.fulfilled.match(result)) {
      disconnectSocket()
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.28em] text-nexora-secondary uppercase">
          Settings
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Preferences & security
        </h1>
        <p className="mt-2 text-nexora-muted">
          Theme, notification preferences, and account security controls.
        </p>
      </div>

      <section className="rounded-3xl border border-white/8 bg-white/[0.03] p-6">
        <h2 className="font-display text-lg font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-nexora-muted">Choose dark or light theme.</p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => onThemeChange('dark')}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
              prefs.theme === 'dark'
                ? 'border-nexora-primary/50 bg-nexora-primary/15'
                : 'border-white/10'
            }`}
          >
            <Moon size={16} />
            Dark
          </button>
          <button
            type="button"
            onClick={() => onThemeChange('light')}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
              prefs.theme === 'light'
                ? 'border-nexora-primary/50 bg-nexora-primary/15'
                : 'border-white/10'
            }`}
          >
            <Sun size={16} />
            Light
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-white/8 bg-white/[0.03] p-6">
        <h2 className="font-display text-lg font-semibold">Notifications</h2>
        <div className="mt-4 space-y-3">
          {[
            { key: 'emailNotifications', label: 'Email notifications' },
            { key: 'pushNotifications', label: 'In-app / realtime notifications' },
            { key: 'deadlineReminders', label: 'Deadline reminders' },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/5 px-4 py-3"
            >
              <span className="text-sm">{item.label}</span>
              <input
                type="checkbox"
                checked={Boolean(prefs[item.key])}
                onChange={() => onToggle(item.key)}
                className="h-4 w-4 rounded border-white/20"
              />
            </label>
          ))}
        </div>
        {savingPrefs && (
          <p className="mt-3 text-xs text-nexora-muted">Saving preferences…</p>
        )}
      </section>

      <section className="rounded-3xl border border-white/8 bg-white/[0.03] p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield size={16} className="text-nexora-secondary" />
          <h2 className="font-display text-lg font-semibold">Security</h2>
        </div>
        <form onSubmit={onPasswordSubmit} className="space-y-4">
          <PasswordInput
            id="currentPassword"
            name="currentPassword"
            label="Current password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
          />
          <PasswordInput
            id="newPassword"
            name="newPassword"
            label="New password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
          />
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm new password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
          />
          <Button type="submit" disabled={savingPassword}>
            {savingPassword ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Updating…
              </>
            ) : (
              'Change password'
            )}
          </Button>
        </form>
      </section>

      <section className="rounded-3xl border border-nexora-accent/30 bg-nexora-accent/5 p-6">
        <h2 className="font-display text-lg font-semibold text-nexora-accent">
          Danger zone
        </h2>
        <p className="mt-1 text-sm text-nexora-muted">
          Deactivating locks your account. Confirm with your password.
        </p>
        <form onSubmit={onDeactivate} className="mt-4 space-y-3">
          <PasswordInput
            id="deactivatePassword"
            name="deactivatePassword"
            label="Password"
            value={deactivatePassword}
            onChange={(e) => setDeactivatePassword(e.target.value)}
          />
          <Button type="submit" variant="secondary">
            Deactivate account
          </Button>
        </form>
      </section>

      {(localError || error) && (
        <p className="text-sm text-nexora-accent">{localError || error}</p>
      )}
      {message && <p className="text-sm text-nexora-success">{message}</p>}
    </div>
  )
}
