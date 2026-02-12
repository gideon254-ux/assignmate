# 🔧 Deployment Troubleshooting Guide

## Error: 404 DEPLOYMENT_NOT_FOUND

This error means the deployment URL doesn't exist. Here's how to fix it:

## Quick Fix Steps

### 1. Check if Deployed
```bash
# In the web directory
cd /home/olivertwist/assignmate/web
vercel list
```

If no deployments show up, you need to deploy first.

### 2. Deploy to Vercel

**Option A: Use the deploy script**
```bash
cd /home/olivertwist/assignmate/web
./deploy-vercel.sh
```

**Option B: Manual deployment**
```bash
cd /home/olivertwist/assignmate/web
# Install Vercel CLI if not installed
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Or deploy to production directly
vercel --prod
```

### 3. First Time Setup

When deploying for the first time:

1. **Login**: `vercel login`
2. **Link project**: Choose "Link to existing project" or "Create new project"
3. **Set up project**:
   - Project name: assignmate
   - Directory: ./ (current)
   - Override settings: No (use defaults)

4. **After first deploy**, go to Vercel Dashboard:
   - https://vercel.com/dashboard
   - Find your project
   - Go to Settings → Environment Variables
   - Add all variables from `.env.local`

### 4. Required Environment Variables

In Vercel Dashboard, add these:

```
DATABASE_URL=postgresql://user:password@ep-hostname.region.aws.neon.tech/dbname?sslmode=require

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAaX5_tWNauqacbAzGXrvMJc6dou1j3MJ4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=assignmate-254.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=assignmate-254
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=assignmate-254.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=981973088869
NEXT_PUBLIC_FIREBASE_APP_ID=1:981973088869:web:8785cdab8e0a7bab45648c
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-RL3F5DSF1S
```

### 5. Initialize Database

After first deploy, create the database tables:

```bash
# Make sure DATABASE_URL is set in your local .env
npx prisma db push
```

Or use Vercel CLI:
```bash
vercel env pull .env.production.local
npx prisma db push
```

## Common Issues

### Issue: "Command "vercel" not found"
```bash
npm install -g vercel
```

### Issue: "Build failed"
```bash
# Check the build locally first
npm run build

# If it fails, check:
# 1. All dependencies installed: npm install
# 2. Prisma generated: npx prisma generate
# 3. No TypeScript errors: npx tsc --noEmit
```

### Issue: "DATABASE_URL not found"
- Make sure you added it to Vercel Environment Variables
- Must be in Project Settings → Environment Variables (NOT just local .env)

### Issue: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Issue: Firebase Auth not working
- Check that all NEXT_PUBLIC_FIREBASE_* variables are set
- Make sure Firebase Auth is enabled in Firebase Console
- Check browser console for Firebase errors

## Deployment Checklist

Before deploying, ensure:

- [ ] `.env.local` created with all variables
- [ ] `npm install` ran successfully
- [ ] `npx prisma generate` ran successfully
- [ ] `npm run build` succeeds locally
- [ ] Vercel CLI installed: `npm install -g vercel`
- [ ] Logged into Vercel: `vercel login`
- [ ] Project linked or created
- [ ] Environment variables added in Vercel Dashboard
- [ ] Database tables created: `npx prisma db push`

## Testing Locally Before Deploy

```bash
cd /home/olivertwist/assignmate/web

# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Build
npm run build

# 4. If build succeeds, deploy
vercel --prod
```

## Getting Your Deployed URL

After successful deployment:
```bash
vercel list
```

Or check Vercel Dashboard: https://vercel.com/dashboard

## Still Getting 404?

1. Check if deployment succeeded in Vercel Dashboard
2. Check build logs for errors
3. Make sure you're using the correct URL
4. Try redeploying: `vercel --prod --force`

## Need Help?

1. Check Vercel docs: https://vercel.com/docs
2. Check build logs in Vercel Dashboard
3. Run locally first: `npm run dev`

## Your Deployed App

Once successfully deployed, your app will be at:
- Production: `https://assignmate-YOUR_USERNAME.vercel.app`
- Or your custom domain if configured