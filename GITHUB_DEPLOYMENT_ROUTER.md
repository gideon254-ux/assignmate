# GitHub as Deployment Router

## Architecture

```
GitHub Repository (oliver4441/assignmate)
│
├── Push to main branch
│
└── GitHub Actions Workflows
    │
    ├── deploy-database.yml ──────► Railway (PostgreSQL)
    │   └── Runs Prisma migrations
    │
    ├── deploy-firebase.yml ──────► Firebase
    │   └── Deploys Firestore rules & indexes
    │
    └── deploy-vercel.yml ────────► Vercel (Next.js)
        └── Builds & deploys web app
```

## Setup Instructions

### 1. Repository Settings

Ensure your repo is connected:
- GitHub: `oliver4441/assignmate`
- Main branch: `main`

### 2. Required GitHub Secrets

Go to: **Settings → Secrets and variables → Actions → New repository secret**

#### Railway Database
| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `DATABASE_URL` | `postgresql://...` | Railway Dashboard → Connect tab |

#### Vercel
| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `VERCEL_TOKEN` | Token string | Vercel Settings → Tokens |
| `VERCEL_ORG_ID` | Org ID | `vercel teams list` or Project Settings |
| `VERCEL_PROJECT_ID` | Project ID | Project Settings → General |

**Getting Vercel Credentials:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project (from web/ directory)
cd web
vercel link

# Get project info
cat .vercel/project.json
# Shows: {"orgId":"...","projectId":"..."}

# Create token
# Go to https://vercel.com/account/tokens
```

#### Firebase
| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `FIREBASE_TOKEN` | Token string | `firebase login:ci` |

**Getting Firebase Token:**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and get CI token
firebase login:ci
# Copy the printed token
```

#### Firebase Configuration (Public)
| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | API key | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `assignmate-254.firebaseapp.com` | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `assignmate-254` | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `assignmate-254.appspot.com` | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Measurement ID | Firebase Console |

**Getting Firebase Config:**
1. Go to https://console.firebase.google.com/project/assignmate-254/settings/general
2. Scroll to "Your apps" → Web app
3. Click "Config" to see all values

### 3. Complete Secrets List

Add these 12 secrets to GitHub:

```
DATABASE_URL
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
FIREBASE_TOKEN
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

## Deployment Workflows

### Automatic Deployments

All workflows trigger on push to `main`:

1. **Database** (`deploy-database.yml`)
   - Triggers on: `prisma/schema.prisma` changes
   - Action: Runs migrations on Railway

2. **Firebase** (`deploy-firebase.yml`)
   - Triggers on: `firebase.json`, `firestore.rules` changes
   - Action: Deploys security rules & indexes

3. **Vercel** (`deploy-vercel.yml`)
   - Triggers on: Any `web/**` changes
   - Action: Builds & deploys Next.js app

### Manual Deployments

Trigger full deployment manually:

```bash
# Go to Actions tab → "Full Stack Deploy" → "Run workflow"
# Or use GitHub CLI:
gh workflow run deploy-all.yml
```

## Workflow Files

Located in `.github/workflows/`:

- `deploy-all.yml` - Orchestrates all deployments
- `deploy-vercel.yml` - Vercel deployment
- `deploy-firebase.yml` - Firebase config deployment
- `deploy-database.yml` - Railway database migrations

## Monitoring Deployments

### GitHub Actions
- Go to: **Actions** tab in your repo
- View workflow runs and logs
- Check for errors

### Deployment URLs

After successful deployment:

| Service | URL | Dashboard |
|---------|-----|-----------|
| Vercel | https://assignmate.vercel.app | https://vercel.com/dashboard |
| Firebase | https://assignmate-254.web.app | https://console.firebase.google.com |
| Railway | PostgreSQL | https://railway.app/dashboard |

## Testing Deployments

### Local Testing
```bash
# Test database connection
cd web
npx prisma db pull

# Test build
npm run build

# Test Firebase locally
firebase serve
```

### Production Testing
After deployment, verify:
1. App loads at Vercel URL
2. Authentication works (Firebase)
3. Database operations work (Railway)
4. API endpoints respond correctly

## Troubleshooting

### Workflow Fails

1. **Check Secrets**
   ```bash
   # Verify secrets are set (need GitHub CLI)
   gh secret list
   ```

2. **Check Logs**
   - Go to Actions tab
   - Click failed workflow
   - Review job logs

3. **Common Issues**

   **Database Connection Error:**
   - Verify `DATABASE_URL` secret is correct
   - Check Railway database is running
   - Ensure IP allowlist includes GitHub Actions IPs

   **Vercel Deploy Fail:**
   - Check `VERCEL_TOKEN` is valid
   - Verify `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`
   - Ensure project is linked: `vercel link`

   **Firebase Deploy Fail:**
   - Check `FIREBASE_TOKEN` is valid
   - Run `firebase login:ci` again if expired
   - Verify project ID matches

### Rollback

**Vercel:**
- Go to Vercel Dashboard → Deployments
- Select previous working deployment
- Click "Promote to Production"

**Database:**
```bash
# Rollback migration
cd web
npx prisma migrate resolve --rolled-back "migration_name"
```

## Best Practices

1. **Always check migrations before deploying**
   - Test locally first
   - Review schema changes

2. **Use Pull Requests**
   - Workflows run on PRs (dry run)
   - Merge only after checks pass

3. **Monitor deployments**
   - Enable notifications in GitHub
   - Check Vercel/Firebase dashboards

4. **Keep secrets secure**
   - Never commit secrets to repo
   - Rotate tokens periodically
   - Use environment-specific secrets

## Summary

With GitHub as your deployment router:
- ✅ Push to `main` → automatic deployments
- ✅ All services stay in sync
- ✅ Easy rollbacks via GitHub
- ✅ Full deployment history

Just push your code and GitHub handles the rest!
