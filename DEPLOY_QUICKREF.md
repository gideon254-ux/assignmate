# Quick Deployment Reference

## Architecture

```
┌─────────────────────────────────────────────┐
│           GitHub Repository                 │
│        oliver4441/assignmate                │
└───────────────────┬─────────────────────────┘
                    │ Push to main
                    ▼
        ┌───────────────────────┐
        │   GitHub Actions      │
        └───────────┬───────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
┌───────────┐ ┌───────────┐ ┌───────────┐
│  Railway  │ │  Firebase │ │  Vercel   │
│    (DB)   │ │ (Auth/API)│ │(Frontend) │
└───────────┘ └───────────┘ └───────────┘
```

## Required Secrets (12 total)

### Database (1)
- `DATABASE_URL` - From Railway Console

### Vercel (3)
- `VERCEL_TOKEN` - From https://vercel.com/account/tokens
- `VERCEL_ORG_ID` - From `vercel link` (project.json)
- `VERCEL_PROJECT_ID` - From `vercel link` (project.json)

### Firebase (1)
- `FIREBASE_TOKEN` - From `firebase login:ci`

### Firebase Config (7)
Get from https://console.firebase.google.com/project/assignmate-254/settings/general
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## Setup Commands

### 1. Railway Database
```bash
# Go to https://railway.app/
# Create project → Add PostgreSQL
# Copy Database URL from "Connect" tab
gh secret set DATABASE_URL --body "postgresql://..."
```

### 2. Vercel
```bash
npm i -g vercel
cd web
vercel link
cat .vercel/project.json  # Get orgId and projectId
gh secret set VERCEL_TOKEN --body "your_token"
gh secret set VERCEL_ORG_ID --body "your_org_id"
gh secret set VERCEL_PROJECT_ID --body "your_project_id"
```

### 3. Firebase
```bash
npm install -g firebase-tools
firebase login:ci
gh secret set FIREBASE_TOKEN --body "your_token"
# Add all NEXT_PUBLIC_FIREBASE_* secrets
```

## Deploy

Push to main branch - GitHub Actions handles the rest!

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## URLs

- **App**: https://assignmate.vercel.app
- **GitHub Actions**: https://github.com/oliver4441/assignmate/actions
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **Firebase Console**: https://console.firebase.google.com/project/assignmate-254

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection error | Check `DATABASE_URL` secret |
| Vercel build fails | Check all `VERCEL_*` secrets |
| Firebase deploy fails | Regenerate `FIREBASE_TOKEN` |
| Missing env vars | Check all `NEXT_PUBLIC_FIREBASE_*` secrets |

## Workflow Files

- `.github/workflows/deploy-all.yml` - Full deployment
- `.github/workflows/deploy-vercel.yml` - Vercel only
- `.github/workflows/deploy-firebase.yml` - Firebase only
- `.github/workflows/deploy-database.yml` - Database only

## Manual Trigger

Go to **Actions** tab → Select workflow → **Run workflow**
