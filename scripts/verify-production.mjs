/**
 * Post-deploy smoke checks against production URLs.
 *
 * Usage:
 *   set NEXORA_API_URL=https://nexora-api.onrender.com
 *   set NEXORA_CLIENT_URL=https://nexora.vercel.app
 *   node scripts/verify-production.mjs
 */
const apiBase = (process.env.NEXORA_API_URL || '').replace(/\/$/, '')
const clientUrl = (process.env.NEXORA_CLIENT_URL || '').replace(/\/$/, '')

if (!apiBase) {
  console.error('Set NEXORA_API_URL (e.g. https://nexora-api.onrender.com)')
  process.exit(1)
}

const results = []

const check = async (name, fn) => {
  try {
    await fn()
    results.push({ name, ok: true })
    console.log(`✓ ${name}`)
  } catch (error) {
    results.push({ name, ok: false, error: error.message })
    console.error(`✗ ${name}: ${error.message}`)
  }
}

await check('API health', async () => {
  const res = await fetch(`${apiBase}/api/health`)
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(`status ${res.status} body=${JSON.stringify(json)}`)
  }
  if (json.data?.database !== 'connected') {
    throw new Error(`database state: ${json.data?.database}`)
  }
})

await check('API welcome', async () => {
  const res = await fetch(`${apiBase}/`)
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(`status ${res.status}`)
  }
})

await check('Auth register validation', async () => {
  const res = await fetch(`${apiBase}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
  // Expect 400 validation — proves route is live
  if (res.status !== 400 && res.status !== 422) {
    throw new Error(`expected validation error, got ${res.status}`)
  }
})

if (clientUrl) {
  await check('Frontend reachable', async () => {
    const res = await fetch(clientUrl)
    if (!res.ok) {
      throw new Error(`status ${res.status}`)
    }
    const html = await res.text()
    if (!html.includes('NEXORA') && !html.includes('root')) {
      throw new Error('unexpected HTML payload')
    }
  })
} else {
  console.log('• Skipping frontend check (set NEXORA_CLIENT_URL)')
}

const failed = results.filter((r) => !r.ok)
console.log('')
if (failed.length) {
  console.error(`Production verify failed (${failed.length})`)
  process.exit(1)
}

console.log('Production verify passed.')
