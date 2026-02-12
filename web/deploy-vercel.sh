#!/bin/bash

# Deploy to Vercel Script

echo "🚀 Deploying Assignmate to Vercel"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check prerequisites
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}Git not found. Please install Git.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites met${NC}"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}ERROR: .env.local not found!${NC}"
    echo "Please create .env.local with your environment variables:"
    echo "  DATABASE_URL=postgresql://..."
    echo "  NEXT_PUBLIC_FIREBASE_API_KEY=..."
    exit 1
fi

echo -e "${GREEN}✓ Environment file found${NC}"
echo ""

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL" .env.local; then
    echo -e "${RED}ERROR: DATABASE_URL not found in .env.local${NC}"
    echo "Please add your Neon database connection string"
    exit 1
fi

echo -e "${GREEN}✓ Database URL configured${NC}"
echo ""

# Check node_modules
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo -e "${GREEN}✓ Prisma client generated${NC}"
echo ""

# Build locally first to check for errors
echo "Building locally..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed! Please fix errors before deploying.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}"
echo ""

# Deploy to Vercel
echo "Deploying to Vercel..."
echo ""
echo -e "${YELLOW}Note: If this is your first time deploying:${NC}"
echo "1. You'll need to login to Vercel"
echo "2. Link your project or create new one"
echo "3. Add environment variables in Vercel dashboard"
echo ""
read -p "Continue with deployment? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}================================${NC}"
        echo -e "${GREEN}🎉 Deployment Initiated!${NC}"
        echo -e "${GREEN}================================${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Go to Vercel Dashboard"
        echo "2. Add environment variables if not set"
        echo "3. Run: npx prisma db push (to create database tables)"
        echo ""
    else
        echo -e "${RED}Deployment failed. Check errors above.${NC}"
    fi
else
    echo "Deployment cancelled."
fi