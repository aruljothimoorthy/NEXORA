/**
 * Phase 8 API smoke test.
 * Usage: node scripts/smoke-test.js
 * Requires API running on PORT (default 5000) with Mongo connected.
 */
const BASE = process.env.API_URL || 'http://localhost:5000/api'

async function request(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status}: ${data.message || res.statusText}`)
  }
  return data
}

async function run() {
  const stamp = Date.now()
  const email = `smoke${stamp}@nexora.test`
  const memberEmail = `smoke.member${stamp}@nexora.test`

  console.log('1) Health')
  await request('/health')

  console.log('2) Register owner')
  const owner = await request('/auth/register', {
    method: 'POST',
    body: {
      name: 'Smoke Owner',
      email,
      password: 'Password1',
      confirmPassword: 'Password1',
    },
  })
  const ownerToken = owner.data.token

  console.log('3) Register member')
  const member = await request('/auth/register', {
    method: 'POST',
    body: {
      name: 'Smoke Member',
      email: memberEmail,
      password: 'Password1',
      confirmPassword: 'Password1',
    },
  })
  const memberToken = member.data.token

  console.log('4) Create project')
  const projectRes = await request('/projects', {
    method: 'POST',
    token: ownerToken,
    body: { name: 'Smoke Project', status: 'active', priority: 'high' },
  })
  const projectId = projectRes.data.project.id

  console.log('5) Invite member')
  await request(`/projects/${projectId}/team/invite`, {
    method: 'POST',
    token: ownerToken,
    body: { email: memberEmail, role: 'member' },
  })

  console.log('6) Create + move task')
  const taskRes = await request(`/projects/${projectId}/tasks`, {
    method: 'POST',
    token: ownerToken,
    body: {
      title: 'Smoke task',
      status: 'todo',
      assignee: member.data.user.id,
    },
  })
  const taskId = taskRes.data.task.id
  await request(`/tasks/${taskId}/move`, {
    method: 'PATCH',
    token: ownerToken,
    body: { status: 'in_progress', order: 0 },
  })

  console.log('7) Comment')
  await request(`/tasks/${taskId}/comments`, {
    method: 'POST',
    token: memberToken,
    body: { body: 'Smoke comment' },
  })

  console.log('8) Dashboard + notifications')
  await request('/dashboard', { token: ownerToken })
  const notifs = await request('/notifications', { token: memberToken })
  if (!notifs.data.notifications.length) {
    throw new Error('Expected member notifications after invite/assign')
  }

  console.log('9) Profile + settings')
  await request('/users/me', {
    method: 'PUT',
    token: ownerToken,
    body: { bio: 'Smoke bio' },
  })
  await request('/users/me/settings', {
    method: 'PUT',
    token: ownerToken,
    body: { theme: 'light', deadlineReminders: true },
  })

  console.log('10) Cleanup')
  await request(`/projects/${projectId}`, {
    method: 'DELETE',
    token: ownerToken,
  })

  console.log('\nSmoke test passed.')
}

run().catch((error) => {
  console.error('\nSmoke test failed:', error.message)
  process.exit(1)
})
