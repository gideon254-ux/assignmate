# Assignmate Hybrid Deployment

## Overview
This project uses a hybrid architecture:
- **Vercel**: Primary hosting for Next.js app + API routes
- **Railway**: PostgreSQL database
- **Firebase**: Authentication + additional services

## Quick Start

### 1. Environment Setup

Create `web/.env.local`:
```env
# Railway Database
DATABASE_URL=your_railway_database_url

# Firebase Configuration (get from Firebase Console > Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=assignmate-254.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=assignmate-254
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=assignmate-254.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2. Database Setup (Railway)

1. Create project at https://railway.app/
2. Add PostgreSQL database
3. Copy Database URL from "Connect" tab
4. Run migrations:
```bash
cd web
npx prisma migrate deploy
npx prisma generate
```

### 3. Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)
1. Push to GitHub: `oliver4441/assignmate`
2. Go to https://vercel.com/new
3. Import repository
4. **CRITICAL SETTINGS**:
   - Root Directory: `web`
   - Framework: Next.js
   - Build Command: `prisma generate && next build`
5. Add environment variables from `.env.local`

#### Option B: Vercel CLI
```bash
# Install CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd web
vercel --prod
```

### 4. Deploy Script
```bash
./deploy-hybrid.sh
```

## Configuration

### Vercel Settings
| Setting | Value |
|---------|-------|
| Root Directory | `web` |
| Framework | Next.js |
| Build Command | `prisma generate && next build` |
| Output | `.next` |
| Install Command | `npm install` |

### Required Environment Variables
```env
# Database
DATABASE_URL=postgresql://...

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=assignmate-254.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=assignmate-254
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=assignmate-254.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Architecture

```
User → Vercel (Next.js)
       ├── API Routes → Railway DB (Prisma)
       ├── Frontend → React/Next.js
       └── Firebase SDK → Firebase Auth/Services
```

## URLs After Deployment
- **Production**: https://assignmate.vercel.app (or your custom domain)
- **Firebase**: https://assignmate-254.web.app (fallback)

## Monitoring
- Vercel: https://vercel.com/dashboard
- Railway: https://railway.app/dashboard
- Firebase: https://console.firebase.google.com/project/assignmate-254

## Troubleshooting

### Build Failed
1. Check Root Directory is `web`
2. Verify Build Command includes `prisma generate`
3. Ensure DATABASE_URL is set

### Database Connection Error
```bash
# Test connection
cd web
npx prisma db pull
```

### Firebase Auth Not Working
- Check Firebase config in environment variables
- Verify authorized domains in Firebase Console
