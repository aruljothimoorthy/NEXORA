# Screenshots

Portfolio images referenced from the root `README.md`.

| File | Screen |
|------|--------|
| `01-landing.png` | Marketing landing + 3D hero |
| `02-login.png` | Login |
| `03-register.png` | Register |
| `04-dashboard.png` | Dashboard analytics (optional — capture while logged in) |
| `05-kanban.png` | Project Kanban board (optional) |

## Recapture

With the frontend running (`npm run dev` in `frontend/`):

```bash
# from repo root — adjust port if Vite chose 5173
set NEXORA_UI_URL=http://localhost:5174
npm install --prefix . playwright
npx playwright install chromium
node scripts/capture-screenshots.mjs
```

For authenticated shots (dashboard / Kanban), log in once in headed mode or seed via the API, then add capture steps.
