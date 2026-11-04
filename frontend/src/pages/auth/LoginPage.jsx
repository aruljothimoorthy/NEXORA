import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'
import AuthShell from '../../components/auth/AuthShell'
import Input from '../../components/ui/Input'
import PasswordInput from '../../components/ui/PasswordInput'
import Button from '../../components/ui/Button'
import {
  clearAuthError,
  loginUser,
  selectAuth,
} from '../../store/slices/authSlice'
import { validateLoginForm } from '../../utils/authValidation'

const initialForm = {
  email: '',
  password: '',
  rememberMe: true,
}

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error, user } = useSelector(selectAuth)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      navigate('/app/dashboard', { replace: true })
    }
  }, [user, navigate])

  const onChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateLoginForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const result = await dispatch(
      loginUser({
        email: form.email,
        password: form.password,
        rememberMe: form.rememberMe,
      }),
    )

    if (loginUser.fulfilled.match(result)) {
      navigate('/app/dashboard', { replace: true })
    }
  }

  const loading = status === 'loading'

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue managing your projects."
      footer={
        <>
          New to NEXORA?{' '}
          <Link
            to="/register"
            className="font-semibold text-nexora-secondary hover:text-nexora-text"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={onChange}
          error={errors.email}
        />
        <PasswordInput
          id="password"
          name="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Your password"
          value={form.password}
          onChange={onChange}
          error={errors.password}
        />

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-nexora-muted">
            <input
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={onChange}
              className="h-4 w-4 rounded border-white/20 bg-transparent text-nexora-primary focus:ring-nexora-secondary"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-nexora-secondary hover:text-nexora-text"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="rounded-xl border border-nexora-accent/30 bg-nexora-accent/10 px-3 py-2 text-sm text-nexora-accent">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in…
            </>
          ) : (
            'Log in'
          )}
        </Button>
      </form>
    </AuthShell>
  )
}
