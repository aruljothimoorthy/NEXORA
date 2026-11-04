# NEXORA – Deployment guide

Production targets:

| Piece | Service |
|--------|---------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) |

Use this checklist in **Phase 10**. Phase 9 only prepares the repo and configs.

---

## 1. MongoDB Atlas

1. Create a free cluster.
2. Database Access → create a user with a strong password.
3. Network Access → allow Render IPs (`0.0.0.0/0` is fine for a portfolio MVP).
4. Connect → Drivers → copy the URI, e.g.  
   `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/nexora?retryWrites=true&w=majority`
5. Keep `USE_MEMORY_MONGO=false` in production.

---

## 2. Backend on Render

Repo already includes `render.yaml` (Blueprint) and `backend/package.json` `start` script.

### Option A — Blueprint

1. Push this repo to GitHub.
2. Render Dashboard → **New** → **Blueprint** → select the repo.
3. Confirm the `nexora-api` web service from `render.yaml`.
4. Set secret env vars in the Render dashboard (Blueprint marks them as `sync: false`):

| Variable | Example |
|----------|---------|
| `MONGODB_URI` | Atlas connection string |
| `JWT_SECRET` | long random string (32+ chars) |
| `CLIENT_URL` | `https://your-app.vercel.app` |
| `COOKIE_SECURE` | `true` |
| `NODE_ENV` | `production` |
| `USE_MEMORY_MONGO` | `false` |

### Option B — Manual Web Service

- **Root Directory:** `backend`
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- Same env vars as above.

After deploy, open `https://YOUR-SERVICE.onrender.com/api/health` — expect `"success": true`.

> Free Render web services spin down after idle time; the first request can take ~30–60s.

---

## 3. Frontend on Vercel

Repo includes `frontend/vercel.json` (SPA rewrites).

1. Import the GitHub repo in Vercel.
2. **Root Directory:** `frontend`
3. Framework preset: Vite (auto).
4. Build: `npm run build` · Output: `dist`
5. Environment variable:

| Variable | Value |
|----------|--------|
| `VITE_API_URL` | `https://YOUR-SERVICE.onrender.com/api` |

6. Redeploy after changing env vars (Vite inlines them at build time).

---

## 4. Wire CORS + cookies

On the backend, set:

```env
CLIENT_URL=https://your-frontend.vercel.app
COOKIE_SECURE=true
NODE_ENV=production
```

`CLIENT_URL` may be comma-separated if you use a custom domain **and** the default Vercel URL.

Socket.IO uses the same origin allow-list as Express CORS (`clientOrigins` in `backend/src/config/env.js`).

---

## 5. Post-deploy smoke checklist

- [ ] `/api/health` returns OK  
- [ ] Register / login from the Vercel URL  
- [ ] Create a project and drag a Kanban card  
- [ ] Invite a second test user (or seed demo)  
- [ ] Comments + notification toast appear  
- [ ] Profile / settings save  
- [ ] Dark / light theme persists  

Local API smoke (with backend running):

```bash
cd backend
npm run smoke
```

---

## 6. Local vs production env

| Variable | Local | Production |
|----------|--------|------------|
| `USE_MEMORY_MONGO` | `true` (optional) | `false` |
| `COOKIE_SECURE` | `false` | `true` |
| `CLIENT_URL` | `http://localhost:5173` | Vercel URL |
| `VITE_API_URL` | `http://localhost:5000/api` | Render `/api` URL |
| `MONGODB_URI` | local or Atlas | Atlas |
