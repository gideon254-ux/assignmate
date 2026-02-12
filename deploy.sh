#!/bin/bash

# Deploy script for Assignmate

echo "🚀 Assignmate Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -d "web" ] || [ ! -d "android" ]; then
    echo "❌ Error: Please run this script from the project root"
    exit 1
fi

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo "${YELLOW}Step 1: Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "${YELLOW}⚠️  Firebase CLI not found. Installing...${NC}"
    npm install -g firebase-tools
fi

echo "${GREEN}✅ Prerequisites met${NC}"

echo ""
echo "${YELLOW}Step 2: Setting up Firebase configuration...${NC}"

# Check if .env.local exists in web
if [ ! -f "web/.env.local" ]; then
    echo "${RED}❌ web/.env.local not found!${NC}"
    echo "Please create it from web/.env.local.example with your Firebase config"
    exit 1
fi

echo "${GREEN}✅ Firebase configuration found${NC}"

echo ""
echo "${YELLOW}Step 3: Installing dependencies...${NC}"
cd web
npm install
if [ $? -ne 0 ]; then
    echo "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo "${GREEN}✅ Dependencies installed${NC}"

echo ""
echo "${YELLOW}Step 4: Building web app...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo "${RED}❌ Build failed${NC}"
    exit 1
fi
echo "${GREEN}✅ Build successful${NC}"

echo ""
echo "${YELLOW}Step 5: Deploying to Firebase...${NC}"
cd ..
firebase deploy
if [ $? -ne 0 ]; then
    echo "${RED}❌ Deployment failed${NC}"
    exit 1
fi
echo "${GREEN}✅ Deployment successful!${NC}"

echo ""
echo "${GREEN}================================${NC}"
echo "${GREEN}🎉 Deployment Complete!${NC}"
echo "${GREEN}================================${NC}"
echo ""
echo "Web app deployed to Firebase Hosting"
echo "Android app: Open /home/olivertwist/StudioProjects/assignmate in Android Studio"
echo ""
echo "Next steps:"
echo "1. Test the web app in your browser"
echo "2. Build the Android APK in Android Studio"
echo "3. Distribute both apps to users"