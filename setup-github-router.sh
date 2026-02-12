#!/bin/bash

# GitHub Deployment Router Setup Script
# Helps configure GitHub secrets for Vercel + Firebase + Railway deployment

set -e

echo "🚀 GitHub Deployment Router Setup"
echo "================================="
echo ""
echo "This script will help you set up GitHub Actions for hybrid deployment."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Step 1: Verify Repository${NC}"
echo "Make sure you're in the assignmate repository root"
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Check if gh CLI is installed
echo ""
echo -e "${BLUE}Step 2: Check GitHub CLI${NC}"
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}GitHub CLI not found. Please install it:${NC}"
    echo "  npm install -g gh"
    echo "  or visit: https://cli.github.com/"
    exit 1
fi

# Check authentication
echo "Checking GitHub authentication..."
gh auth status || {
    echo -e "${YELLOW}Please login to GitHub:${NC}"
    gh auth login
}

echo ""
echo -e "${GREEN}✅ GitHub CLI is ready${NC}"

# Display required secrets
echo ""
echo -e "${BLUE}Step 3: Required GitHub Secrets${NC}"
echo ""
echo "You need to add these secrets to your GitHub repository:"
echo "  Settings → Secrets and variables → Actions"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔐 RAILWAY (Database):"
echo "   DATABASE_URL"
echo "   → Get from: Railway Dashboard → Connect tab"
echo ""
echo "🔐 VERCEL (Hosting):"
echo "   VERCEL_TOKEN"
echo "   VERCEL_ORG_ID"
echo "   VERCEL_PROJECT_ID"
echo "   → Get from: Run 'vercel link' in web/ directory"
echo ""
echo "🔐 FIREBASE (Auth/Services):"
echo "   FIREBASE_TOKEN"
echo "   → Get from: firebase login:ci"
echo ""
echo "🔐 FIREBASE CONFIG (Public):"
echo "   NEXT_PUBLIC_FIREBASE_API_KEY"
echo "   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=assignmate-254.firebaseapp.com"
echo "   NEXT_PUBLIC_FIREBASE_PROJECT_ID=assignmate-254"
echo "   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=assignmate-254.appspot.com"
echo "   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
echo "   NEXT_PUBLIC_FIREBASE_APP_ID"
echo "   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"
echo "   → Get from: Firebase Console → Project Settings"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check current secrets
echo ""
echo -e "${BLUE}Step 4: Check Current Secrets${NC}"
echo ""
echo "Current secrets in repository:"
gh secret list || echo "No secrets found or not authenticated"

echo ""
echo -e "${BLUE}Step 5: Setup Instructions${NC}"
echo ""

# Railway
echo -e "${YELLOW}Railway Setup:${NC}"
echo "1. Go to https://railway.app/"
echo "2. Create new project → Provision PostgreSQL"
echo "3. Go to 'Connect' tab and copy Database URL"
echo "4. Add to GitHub secrets:"
echo "   gh secret set DATABASE_URL --body 'your_railway_url'"
echo ""

# Vercel
echo -e "${YELLOW}Vercel Setup:${NC}"
echo "1. Install Vercel CLI: npm i -g vercel"
echo "2. Login: vercel login"
echo "3. Link project:"
echo "   cd web"
echo "   vercel link"
echo "4. Get credentials:"
echo "   cat .vercel/project.json"
echo "5. Create token at: https://vercel.com/account/tokens"
echo "6. Add secrets:"
echo "   gh secret set VERCEL_TOKEN --body 'your_token'"
echo "   gh secret set VERCEL_ORG_ID --body 'your_org_id'"
echo "   gh secret set VERCEL_PROJECT_ID --body 'your_project_id'"
echo ""

# Firebase
echo -e "${YELLOW}Firebase Setup:${NC}"
echo "1. Install Firebase CLI: npm install -g firebase-tools"
echo "2. Get CI token:"
echo "   firebase login:ci"
echo "3. Add token to GitHub:"
echo "   gh secret set FIREBASE_TOKEN --body 'your_token'"
echo "4. Get Firebase config from:"
echo "   https://console.firebase.google.com/project/assignmate-254/settings/general"
echo "5. Add all NEXT_PUBLIC_FIREBASE_* secrets"
echo ""

echo -e "${GREEN}Step 6: Test Deployment${NC}"
echo ""
echo "Once all secrets are set, push to main branch:"
echo "   git add ."
echo "   git commit -m 'Setup GitHub deployment router'"
echo "   git push origin main"
echo ""
echo "GitHub Actions will automatically:"
echo "  ✅ Run database migrations on Railway"
echo "  ✅ Deploy Firebase configs"
echo "  ✅ Build and deploy to Vercel"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Documentation:"
echo "  📖 GITHUB_DEPLOYMENT_ROUTER.md - Full guide"
echo "  📖 DEPLOY.md - Quick reference"
echo "  📖 HYBRID_DEPLOYMENT_GUIDE.md - Architecture details"
echo ""
echo "Monitoring:"
echo "  🔍 GitHub Actions: https://github.com/oliver4441/assignmate/actions"
echo "  🔍 Vercel: https://vercel.com/dashboard"
echo "  🔍 Railway: https://railway.app/dashboard"
echo "  🔍 Firebase: https://console.firebase.google.com/project/assignmate-254"
