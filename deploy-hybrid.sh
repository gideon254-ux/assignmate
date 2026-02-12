#!/bin/bash

# Hybrid Deployment Script for Assignmate
# Deploys to Vercel (frontend + APIs) with Railway DB and Firebase integration

set -e

echo "🚀 Hybrid Deployment: Vercel + Railway + Firebase"
echo "=================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check directory
if [ ! -d "web" ]; then
    echo -e "${RED}Error: web/ directory not found. Run from project root.${NC}"
    exit 1
fi

cd web

# Step 1: Database Migration
echo -e "${YELLOW}Step 1/4: Running database migrations...${NC}"
if command -v npx &> /dev/null; then
    npx prisma migrate deploy || {
        echo -e "${RED}Warning: Database migration failed. Continuing anyway...${NC}"
    }
    npx prisma generate
else
    echo -e "${YELLOW}Prisma not found. Skipping migration.${NC}"
fi

# Step 2: Install dependencies
echo -e "${YELLOW}Step 2/4: Installing dependencies...${NC}"
npm install

# Step 3: Build locally to verify
echo -e "${YELLOW}Step 3/4: Building locally...${NC}"
npm run build || {
    echo -e "${RED}Build failed! Fix errors before deploying.${NC}"
    exit 1
}

# Step 4: Deploy to Vercel
echo -e "${YELLOW}Step 4/4: Deploying to Vercel...${NC}"
if command -v vercel &> /dev/null; then
    vercel --prod
else
    echo -e "${RED}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    vercel --prod
fi

echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}Your app is now live on Vercel!${NC}"
echo ""
echo "Important URLs:"
echo "  - Vercel Dashboard: https://vercel.com/dashboard"
echo "  - Railway Dashboard: https://railway.app/dashboard"
echo "  - Firebase Console: https://console.firebase.google.com/project/assignmate-254"
echo ""
echo "Environment Variables to set in Vercel:"
echo "  DATABASE_URL (from Railway)"
echo "  NEXT_PUBLIC_FIREBASE_* (from Firebase Console)"
