import { Link } from 'react-router-dom'
import AuthShell from '../../components/auth/AuthShell'
import Button from '../../components/ui/Button'

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset password"
      subtitle="Password reset email flow lands in a later phase. Contact support or create a new account for now."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-nexora-secondary hover:text-nexora-text">
            Back to login
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-nexora-muted">
          Secure email reset tokens will be added after core collaboration features.
          Your JWT session and hashed passwords are already production-ready.
        </p>
        <Button to="/login" className="w-full">
          Return to login
        </Button>
      </div>
    </AuthShell>
  )
}
