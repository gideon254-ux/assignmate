# Vercel + Neon + Firebase Configuration

## Setup Instructions

### 1. Neon Database Setup
1. Go to https://neon.tech/
2. Create a new project
3. Get your connection string from the dashboard
4. Add to Vercel environment variables as `DATABASE_URL`

### 2. Firebase Setup
1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Email/Password authentication
4. Get your web app configuration
5. Add the config values to Vercel environment variables

### 3. Environment Variables for Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:password@ep-hostname.us-east-1.aws.neon.tech/neondb?sslmode=require

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAaX5_tWNauqacbAzGXrvMJc6dou1j3MJ4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=assignmate-254.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=assignmate-254
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=assignmate-254.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=981973088869
NEXT_PUBLIC_FIREBASE_APP_ID=1:981973088869:web:8785cdab8e0a7bab45648c
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-RL3F5DSF1S
```

### 4. Database Migration

After setting up Neon, run:
```bash
npx prisma db push
```

Or use the Vercel CLI:
```bash
vercel --prod
```

## Architecture

- **Frontend**: Next.js 14 (App Router)
- **Authentication**: Firebase Auth
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Prisma
- **Hosting**: Vercel
- **Real-time**: Polling every 30 seconds (API-based)

## Free Tier Limits

### Vercel (Hobby Plan)
- 100GB bandwidth
- 1000 GB-hours of serverless function execution
- Unlimited deployments

### Neon (Free Tier)
- 1 project
- 10GB storage
- Unlimited databases
- 190 compute hours/month

### Firebase (Spark Plan)
- 10,000 users/month
- 50K reads, 20K writes/day (Firestore not used, just Auth)

## Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.