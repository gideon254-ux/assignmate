#!/bin/bash

# Firebase Deployment Script for Assignmate
# This script builds and deploys the web app to Firebase Hosting

set -e

echo "🚀 Starting Firebase Deployment for Assignmate"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "web" ]; then
    echo -e "${RED}Error: web/ directory not found. Please run from project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1/5: Checking Firebase CLI...${NC}"
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}Firebase CLI not found. Installing...${NC}"
    npm install -g firebase-tools
fi
firebase --version

echo -e "${YELLOW}Step 2/5: Installing dependencies...${NC}"
cd web
npm install

echo -e "${YELLOW}Step 3/5: Building Next.js app...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Build failed - dist/ directory not created${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 4/5: Checking Firebase project...${NC}"
cd ..
firebase projects:list | grep "assignmate-254" || {
    echo -e "${RED}Warning: Project 'assignmate-254' not found in your Firebase projects${NC}"
    echo "Available projects:"
    firebase projects:list
    exit 1
}

echo -e "${YELLOW}Step 5/5: Deploying to Firebase...${NC}"
firebase use assignmate-254
firebase deploy

echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo -e "${GREEN}Your app is now live at:${NC}"
echo -e "${GREEN}  https://assignmate-254.web.app/${NC}"
echo ""
echo "Firebase Console:"
echo "  https://console.firebase.google.com/project/assignmate-254"
