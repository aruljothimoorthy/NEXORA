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
  registerUser,
  selectAuth,
} from '../../store/slices/authSlice'
import { validateRegisterForm } from '../../utils/authValidation'

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default function RegisterPage() {
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
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateRegisterForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const result = await dispatch(registerUser(form))
    if (registerUser.fulfilled.match(result)) {
      navigate('/app/dashboard', { replace: true })
    }
  }

  const loading = status === 'loading'

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start managing projects with NEXORA in under a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-nexora-secondary hover:text-nexora-text">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          id="name"
          name="name"
          label="Full name"
          autoComplete="name"
          placeholder="Ada Lovelace"
          value={form.name}
          onChange={onChange}
          error={errors.name}
        />
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
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={onChange}
          error={errors.password}
        />
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Repeat password"
          value={form.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword}
        />

        {error && (
          <div className="rounded-xl border border-nexora-accent/30 bg-nexora-accent/10 px-3 py-2 text-sm text-nexora-accent">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating account…
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>
    </AuthShell>
  )
}
