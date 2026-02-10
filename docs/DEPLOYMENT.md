# Deployment Guide

This document provides detailed instructions for deploying Assignmate to production.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Vercel Deployment](#vercel-deployment)
- [Post-Deployment Verification](#post-deployment-verification)

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests passing (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Production build successful (`npm run build`)
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] No console errors in development

## Environment Setup

### 1. Create Production Environment File

Create `.env.local` with production values:

```bash
# Database (use a production PostgreSQL instance)
DATABASE_URL="postgresql://user:password@host:5432/assignmate?schema=public"

# NextAuth.js
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-256-bit-secret-key-here"

# Google OAuth (create credentials in Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# API
NEXT_PUBLIC_API_ENDPOINT="https://your-domain.vercel.app/api"
```

### 2. Generate NextAuth Secret

Generate a secure random string:
```bash
openssl rand -base64 32
```

## Database Setup

### Option 1: Neon (Recommended for Vercel)

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to environment variables

### Option 2: Railway

1. Create account at [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Copy connection string from dashboard

### Run Migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

## Vercel Deployment

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Authenticate

```bash
vercel login
```

### Step 3: Initialize Project

```bash
vercel
```

Follow the prompts to link your project.

### Step 4: Configure Environment Variables

Add environment variables in Vercel Dashboard:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable from `.env.local`

### Step 5: Deploy to Production

```bash
vercel --prod
```

### Alternative: GitHub Integration

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:username/assignmate.git
git push -u origin main
```

2. Connect repository in Vercel Dashboard
3. Vercel will auto-deploy on every push to main

## Post-Deployment Verification

### 1. Verify Deployment

- [ ] Production URL loads successfully
- [ ] No console errors in browser
- [ ] All pages accessible
- [ ] Authentication working
- [ ] Database connections successful

### 2. Test Core Functionality

- [ ] Create new assignment
- [ ] Edit assignment
- [ ] Delete assignment
- [ ] Mark as complete
- [ ] View calendar
- [ ] Check dashboard statistics

### 3. Performance Check

Run Lighthouse audit in Chrome DevTools:
- Target scores: 90+ for all metrics
- LCP < 2.5 seconds
- CLS < 0.1

### 4. Monitor Logs

```bash
vercel logs assignmate
```

## Rollback Procedure

If critical issues occur:

```bash
# Rollback to previous deployment
vercel rollback

# Or revert Git commit
git revert <commit-hash>
git push origin main
```

## Troubleshooting

### Database Connection Errors

- Verify DATABASE_URL format
- Check database firewall settings
- Ensure Prisma client is generated: `npx prisma generate`

### Authentication Issues

- Verify NEXTAUTH_URL matches production domain
- Check Google OAuth redirect URIs
- Ensure NEXTAUTH_SECRET is set

### Build Failures

- Check TypeScript errors: `npm run type-check`
- Verify all dependencies installed: `npm ci`
- Check Node.js version (requires 18+)

## Support

For issues or questions:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Review Next.js deployment guide: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
