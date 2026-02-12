# Hybrid Deployment Guide: Vercel + Firebase + Railway

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Request                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Vercel (Primary Hosting)                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Next.js App                                     │  │
│  │  ├─ Frontend (React Components)                  │  │
│  │  ├─ API Routes (/api/*)                          │  │
│  │  └─ Server-Side Rendering                        │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Railway │  │ Firebase │  │ Firebase │
│  (DB)    │  │ (Auth)   │  │ (APIs)   │
└──────────┘  └──────────┘  └──────────┘
```

## Project Structure

```
assignmate/
├── web/                          # Next.js app → Deploy to Vercel
│   ├── src/
│   │   ├── app/api/             # API routes (Vercel serverless)
│   │   ├── lib/
│   │   │   ├── firebase.ts      # Firebase SDK
│   │   │   └── database.ts      # Prisma + Railway DB
│   │   └── ...
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   └── .env.local               # Environment variables
├── android/                      # Android app (separate)
└── firebase/                     # Firebase configs
    ├── functions/               # Firebase Functions (optional)
    └── firestore.rules          # Firebase security rules
```

## Setup Instructions

### 1. Railway Database Setup

#### Create Railway Project
1. Go to https://railway.app/
2. Click "New Project"
3. Select "Provision PostgreSQL"
4. Once created, go to "Connect" tab
5. Copy the "Database URL"

#### Database Schema
The app uses Prisma. Deploy schema to Railway:

```bash
cd web
npx prisma migrate deploy
npx prisma generate
```

### 2. Vercel Deployment

#### Option A: GitHub Integration (Recommended)

1. Push code to GitHub (`oliver4441/assignmate`)
2. Go to https://vercel.com/new
3. Import `oliver4441/assignmate`
4. Configure settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `web`
   - **Build Command**: `prisma generate && next build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
```env
# Database (Railway)
DATABASE_URL=postgresql://user:password@host:port/database

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=assignmate-254.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=assignmate-254
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=assignmate-254.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=xxx

# App Config
NEXT_PUBLIC_APP_URL=https://assignmate.vercel.app
```

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from web directory
cd web
vercel --prod
```

### 3. Firebase Integration

#### Firebase Configuration
Your Firebase project (`assignmate-254`) handles:
- Authentication
- Some API endpoints (if using Firebase Functions)
- Firestore (for real-time features)

#### Environment Variables for Firebase
Add to Vercel dashboard or `.env.local`:

```env
# Firebase Web Config (get from Firebase Console > Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=assignmate-254.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=assignmate-254
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=assignmate-254.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin (for server-side operations) - Optional
# Only needed if using Firebase Admin SDK in API routes
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@assignmate-254.iam.gserviceaccount.com
```

## API Routing Strategy

### Vercel API Routes (Primary)
Located in `web/src/app/api/`

These run on Vercel's serverless functions:
- `/api/assignments` - CRUD operations (uses Railway DB via Prisma)
- `/api/auth/*` - Authentication endpoints
- `/api/users` - User management

### Firebase APIs (Secondary)
Use Firebase SDK directly from frontend or Firebase Functions:
- Real-time notifications
- Image storage
- Push notifications

Example hybrid approach:
```typescript
// Primary data from Railway via Vercel API
const assignments = await fetch('/api/assignments')

// Real-time updates from Firebase
import { onSnapshot } from 'firebase/firestore'
onSnapshot(doc(db, 'notifications', userId), (doc) => {
  // Handle real-time updates
})
```

## Database Architecture

### Railway (PostgreSQL) - Primary Database
Stores:
- Users
- Assignments
- Courses
- Settings
- Analytics data

Connection via Prisma:
```typescript
// web/src/lib/database.ts
import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()
```

### Firebase Firestore - Secondary/Cache
Stores:
- Real-time presence
- Notifications
- Chat messages
- Temporary session data

## Deployment Workflows

### Full Deployment (All Services)

```bash
# 1. Deploy database migrations (Railway)
cd web
npx prisma migrate deploy

# 2. Deploy to Vercel
vercel --prod

# 3. Deploy Firebase rules (if changed)
firebase deploy --only firestore:rules
```

### Quick Deploy (Vercel only)
```bash
cd web
vercel --prod
```

### Automated Deploy Script
```bash
#!/bin/bash
# deploy-hybrid.sh

echo "🚀 Deploying Assignmate (Hybrid)"
echo "================================"

# Database migrations
echo "📦 Running database migrations..."
cd web
npx prisma migrate deploy

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

# Deploy Firebase configs (optional)
echo "🔥 Updating Firebase configs..."
cd ..
firebase deploy --only firestore:rules,firestore:indexes

echo "✅ Deployment complete!"
echo ""
echo "URLs:"
echo "  Vercel: https://assignmate.vercel.app"
echo "  Firebase: https://assignmate-254.web.app"
```

## Environment Variables Reference

### Required for Vercel
```env
# Database
DATABASE_URL=postgresql://...

# Firebase (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# App
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Optional
```env
# Firebase Admin (Server-side)
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## Troubleshooting

### Database Connection Issues
```bash
# Test Railway connection
cd web
npx prisma db pull

# Check connection string format
# Should be: postgresql://user:password@host:port/database
```

### Build Failures on Vercel
1. Check Root Directory is set to `web`
2. Verify Build Command includes Prisma: `prisma generate && next build`
3. Check environment variables are set

### Firebase Auth Issues
- Ensure Firebase config is correct in environment variables
- Check Firebase Console > Authentication > Sign-in methods are enabled
- Verify authorized domains in Firebase Console

## Monitoring

- **Vercel**: https://vercel.com/dashboard
- **Railway**: https://railway.app/dashboard
- **Firebase**: https://console.firebase.google.com/project/assignmate-254

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth, 6000 execution hours
- **Railway**: $0.0005/GB RAM/month, $0.10/GB storage/month
- **Firebase**: Free Spark plan available

## Next Steps

1. ✅ Set up Railway PostgreSQL database
2. ✅ Configure Vercel project with `web/` as root
3. ✅ Add all environment variables to Vercel
4. ✅ Deploy!
5. Configure custom domain (optional)
6. Set up monitoring and alerting
