#!/bin/bash

# Quick Deployment Guide for Assignmate
# Run this on a machine with stable internet connection

echo "🚀 Assignmate Quick Deployment"
echo "==============================="
echo ""

# Configuration
PROJECT_ID="project-tracker-c2cd2"
API_KEY="AIzaSyD_tiqi3EuHwerhLQ5yRLD2yzft4iE_YHY"
AUTH_DOMAIN="project-tracker-c2cd2.firebaseapp.com"
STORAGE_BUCKET="project-tracker-c2cd2.firebasestorage.app"
MESSAGING_SENDER_ID="898012215027"
APP_ID="1:898012215027:web:ece017780ef7592f6fe986"

echo "Step 1: Setting up environment..."
cd web

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_FIREBASE_API_KEY=$API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=$APP_ID
EOF

echo "✅ Environment configured"
echo ""

echo "Step 2: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed. Trying with --force..."
    npm install --force --legacy-peer-deps
fi
echo "✅ Dependencies installed"
echo ""

echo "Step 3: Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"
echo ""

echo "Step 4: Deploying to Firebase..."
firebase use $PROJECT_ID
firebase deploy --only hosting
echo "✅ Deployed!"
echo ""

echo "==============================="
echo "🎉 Deployment Complete!"
echo "==============================="
echo ""
echo "Your app is live at:"
echo "  https://$PROJECT_ID.web.app"
echo ""
echo "Android app: Open in Android Studio and build APK"