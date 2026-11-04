# GitHub repository setup

This project is prepared for a public portfolio repo named **`nexora`**.

## Create the remote (GitHub CLI)

```bash
# Install: https://cli.github.com/
gh auth login
gh repo create nexora --public --source=. --remote=origin --push --description "NEXORA – Smart Project Management Platform (MERN SaaS)"
```

## Create the remote (GitHub website)

1. Open https://github.com/new  
2. Repository name: `nexora`  
3. Public · **do not** add README / .gitignore / license (this repo already has them)  
4. Create repository, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/nexora.git
git branch -M main
git push -u origin main
```

## Safety checklist before every push

- [ ] No `.env` files staged (`git status`)  
- [ ] Secrets only in Render / Vercel / Atlas dashboards  
- [ ] `frontend/.env.example` and `backend/.env.example` stay placeholder-only  

## Suggested GitHub extras (optional)

- **About** → add homepage URL after Vercel deploy  
- **Topics:** `mern`, `react`, `nodejs`, `mongodb`, `socket-io`, `saas`, `project-management`  
- **README** badges → replace `YOUR_USERNAME` in the root README once the repo exists  
