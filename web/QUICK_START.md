# 🚀 Quick Start - Deploy in 5 Minutes

## Problem: You're seeing "404 DEPLOYMENT_NOT_FOUND"

**Solution: You need to DEPLOY the app first!**

## Deploy Now (3 Steps)

### Step 1: Install & Login (30 seconds)
```bash
cd /home/olivertwist/assignmate/web
npm install -g vercel
vercel login
```

### Step 2: Deploy (2 minutes)
```bash
vercel --prod
```

When prompted:
- `Set up and deploy?` → Type `y` and press Enter
- `Link to existing project?` → Type `n` and press Enter  
- `Project name?` → Press Enter (accepts default: assignmate)
- `Override settings?` → Type `n` and press Enter

Wait for deployment to complete...

### Step 3: Get Your URL (30 seconds)

You'll see output like:
```
🔍  Inspect: https://vercel.com/yourname/assignmate/abc123
✅  Production: https://assignmate-yourname.vercel.app
```

**Your app is live at: `https://assignmate-yourname.vercel.app`**

## ⚠️ IMPORTANT: Add Environment Variables

Your app won't work without these!

1. Go to: https://vercel.com/dashboard
2. Click your **assignmate** project
3. Click **Settings** tab
4. Click **Environment Variables**
5. Add these one by one:

```
DATABASE_URL=postgresql://your_neon_connection_string

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAaX5_tWNauqacbAzGXrvMJc6dou1j3MJ4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=assignmate-254.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=assignmate-254
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=assignmate-254.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=981973088869
NEXT_PUBLIC_FIREBASE_APP_ID=1:981973088869:web:8785cdab8e0a7bab45648c
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-RL3F5DSF1S
```

6. Click **Save**
7. Redeploy: `vercel --prod`

## Initialize Database

```bash
npx prisma db push
```

This creates the tables in Neon PostgreSQL.

## ✅ Done!

Your app should now be working at:
`https://assignmate-yourusername.vercel.app`

## Test It

1. Visit the URL
2. Click "Register" to create account
3. Log in
4. Create an assignment

## Troubleshooting

**404 error?** → Run `vercel --prod` to deploy
**Database error?** → Check DATABASE_URL in Vercel env vars
**Auth error?** → Check all NEXT_PUBLIC_FIREBASE_* variables
**Build error?** → Run `npm install && npm run build` locally first

## Get Your Neon Database URL

1. Go to https://neon.tech/
2. Create project
3. Copy connection string
4. Add to Vercel as DATABASE_URL

Format:
```
postgresql://user:password@ep-hostname.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

## Still Stuck?

Run the guided deploy script:
```bash
./deploy-vercel.sh
```

Or read:
- FIX_404_ERROR.md - Detailed 404 fix
- TROUBLESHOOTING_404.md - Common issues
- DEPLOY_VERCEL.md - Full deployment guide