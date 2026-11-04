export function validateRegisterForm({ name, email, password, confirmPassword }) {
  const errors = {}

  if (!name?.trim()) {
    errors.name = 'Full name is required'
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  if (!email?.trim()) {
    errors.email = 'Email is required'
  } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    errors.password = 'Use at least one letter and one number'
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm your password'
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

export function validateLoginForm({ email, password }) {
  const errors = {}

  if (!email?.trim()) {
    errors.email = 'Email is required'
  } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address'
  }

  if (!password) {
    errors.password = 'Password is required'
  }

  return errors
}
