#!/bin/bash

# Full Deployment Script for Assignmate
# This script deploys both web and Android versions

set -e  # Exit on error

echo "🚀 Assignmate Deployment Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -d "web" ] || [ ! -d "android" ]; then
    print_error "Please run this script from the project root"
    exit 1
fi

echo "Step 1: Checking prerequisites..."
echo "-----------------------------------"

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js 18+"
    exit 1
fi
print_status "Node.js found: $(node --version)"

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    print_warning "Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi
print_status "Firebase CLI found"

# Check Java (for Android)
if ! command -v java &> /dev/null; then
    print_warning "Java not found. Android build may fail"
else
    print_status "Java found: $(java -version 2>&1 | head -1)"
fi

echo ""
echo "Step 2: Firebase Configuration"
echo "-----------------------------------"

# Check Firebase login
if ! firebase projects:list &> /dev/null; then
    print_warning "Not logged into Firebase. Please login:"
    firebase login
fi
print_status "Firebase login verified"

# Select or create Firebase project
echo ""
echo "Available Firebase projects:"
firebase projects:list 2>/dev/null | grep -E "^│" | head -10

echo ""
read -p "Enter Firebase Project ID to use (or press Enter to create new): " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    print_warning "Creating new Firebase project..."
    read -p "Enter project name: " PROJECT_NAME
    if [ -z "$PROJECT_NAME" ]; then
        PROJECT_NAME="assignmate-$(date +%s)"
    fi
    
    # Note: firebase projects:create requires interactive mode
    print_warning "Please create project manually:"
    print_warning "1. Go to https://console.firebase.google.com/"
    print_warning "2. Create new project: $PROJECT_NAME"
    print_warning "3. Copy the Project ID"
    print_warning "4. Run this script again with that Project ID"
    exit 0
else
    firebase use --add "$PROJECT_ID"
    print_status "Using project: $PROJECT_ID"
fi

echo ""
echo "Step 3: Web Application Setup"
echo "-----------------------------------"

cd web

# Check for .env.local
if [ ! -f ".env.local" ]; then
    print_warning "Creating .env.local from template..."
    
    # Get Firebase config
    print_warning "Please enter your Firebase configuration:"
    read -p "API Key: " API_KEY
    read -p "Auth Domain (e.g., your-project.firebaseapp.com): " AUTH_DOMAIN
    read -p "Project ID: " FB_PROJECT_ID
    read -p "Storage Bucket (e.g., your-project.appspot.com): " STORAGE_BUCKET
    read -p "Messaging Sender ID: " MESSAGING_SENDER_ID
    read -p "App ID: " APP_ID
    
    cat > .env.local << EOF
NEXT_PUBLIC_FIREBASE_API_KEY=$API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$FB_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=$APP_ID
EOF
    print_status ".env.local created"
else
    print_status ".env.local already exists"
fi

echo ""
echo "Installing dependencies..."
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps 2>&1 | tail -5
print_status "Dependencies installed"

echo ""
echo "Building web application..."
npm run build 2>&1 | tail -20
print_status "Build complete"

echo ""
echo "Step 4: Deploying to Firebase"
echo "-----------------------------------"

# Deploy Firestore rules
print_status "Deploying Firestore rules..."
firebase deploy --only firestore:rules --project "$PROJECT_ID"

# Deploy Firestore indexes
print_status "Deploying Firestore indexes..."
firebase deploy --only firestore:indexes --project "$PROJECT_ID"

# Deploy hosting
print_status "Deploying to Firebase Hosting..."
firebase deploy --only hosting --project "$PROJECT_ID"

cd ..

echo ""
echo "Step 5: Android Application"
echo "-----------------------------------"

print_status "Android project location: /home/olivertwist/assignmate/android"
print_status "Also available at: /home/olivertwist/StudioProjects/assignmate"

print_warning "To build Android APK:"
print_warning "1. Open Android Studio"
print_warning "2. Open project: /home/olivertwist/StudioProjects/assignmate"
print_warning "3. Download google-services.json from Firebase Console"
print_warning "4. Place it in: app/google-services.json"
print_warning "5. Build → Build Bundle(s) / APK(s) → Build APK(s)"

echo ""
echo "================================"
print_status "Deployment Complete!"
echo "================================"
echo ""
echo "Web app deployed to:"
echo "  https://$PROJECT_ID.web.app"
echo ""
echo "Next steps:"
echo "1. Enable Authentication in Firebase Console"
echo "2. Enable Firestore Database"
echo "3. Build Android APK in Android Studio"
echo "4. Set your first admin user in Firestore"
echo ""
echo "For support, see SETUP.md and DEPLOYMENT_GUIDE.md"