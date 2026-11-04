/**
 * Capture portfolio screenshots for the README.
 * Usage (from repo root, with frontend running):
 *   npm i -D playwright
 *   npx playwright install chromium
 *   set NEXORA_UI_URL=http://localhost:5174
 *   npm run screenshots
 */
import { chromium } from 'playwright'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../docs/screenshots')
const base = process.env.NEXORA_UI_URL || 'http://localhost:5174'

fs.mkdirSync(outDir, { recursive: true })

const shots = [
  { name: '01-landing.png', url: `${base}/`, fullPage: false },
  { name: '02-login.png', url: `${base}/login`, fullPage: false },
  { name: '03-register.png', url: `${base}/register`, fullPage: false },
]

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
})

for (const shot of shots) {
  await page.goto(shot.url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)
  const file = path.join(outDir, shot.name)
  await page.screenshot({ path: file, fullPage: shot.fullPage })
  console.log('Saved', file)
}

await browser.close()
console.log('Done.')
