# Firebase Deployment Guide

## Current Setup
- **Hosting**: Firebase Hosting
- **Domain**: https://assignmate-254.web.app/
- **Database**: Firebase Firestore
- **APIs**: Firebase (client-side with Firebase SDK)

## Prerequisites

1. Firebase CLI installed:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Select your project:
```bash
firebase use assignmate-254
```

## Deployment

### Quick Deploy (One Command)
```bash
cd /home/olivertwist/assignmate
./deploy-firebase.sh
```

### Manual Deploy
```bash
cd web

# Install dependencies
npm install

# Build the app
npm run build

# Deploy to Firebase
firebase deploy
```

## Configuration

### Important Files
- `web/firebase.json` - Firebase hosting config
- `web/firestore.rules` - Database security rules
- `web/firestore.indexes.json` - Database indexes
- `web/next.config.js` - Must have `output: 'export'` for static hosting

### Environment Variables
Create `web/.env.local`:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=assignmate-254.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=assignmate-254
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=assignmate-254.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Project Structure
```
assignmate/
├── web/                    # Next.js web app (deployed to Firebase)
│   ├── src/
│   ├── firebase.json       # Firebase config
│   ├── firestore.rules     # Security rules
│   └── next.config.js      # Static export config
├── android/                # Android native app
└── deploy-firebase.sh      # Deployment script
```

## What Gets Deployed
- **Web App**: Static files from `web/dist/` → Firebase Hosting
- **Firestore Rules**: Security rules from `web/firestore.rules`
- **Firestore Indexes**: Database indexes from `web/firestore.indexes.json`

## Post-Deployment
After deployment, your app will be live at:
- **Primary**: https://assignmate-254.web.app/
- **Custom Domain**: (if configured in Firebase Console)

## Troubleshooting

### Build Errors
```bash
# Clean and rebuild
cd web
rm -rf dist
rm -rf .next
npm install
npm run build
```

### Deployment Errors
```bash
# Check Firebase project
firebase projects:list

# Use correct project
firebase use assignmate-254

# Deploy with debug info
firebase deploy --debug
```

### 404 Errors After Deploy
- Check `firebase.json` rewrites configuration
- Ensure `next.config.js` has `trailingSlash: true`
- Verify all routes are generated in `dist/`

## Useful Commands

```bash
# Preview locally before deploying
firebase serve

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Check deployment status
firebase hosting:channel:list
```

## Firebase Console Links
- **Hosting**: https://console.firebase.google.com/project/assignmate-254/hosting
- **Firestore**: https://console.firebase.google.com/project/assignmate-254/firestore
- **Authentication**: https://console.firebase.google.com/project/assignmate-254/authentication
