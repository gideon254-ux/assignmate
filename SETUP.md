# Setup Checklist

## Before First Deployment

### 1. Firebase Project Setup

- [ ] Go to https://console.firebase.google.com/
- [ ] Create new project named "Assignmate"
- [ ] Disable Google Analytics (optional, keeps it simpler)
- [ ] Click "Create Project"

### 2. Enable Authentication

- [ ] Go to Authentication → Get Started
- [ ] Enable "Email/Password" provider
- [ ] Save

### 3. Enable Firestore Database

- [ ] Go to Firestore Database → Create Database
- [ ] Choose "Start in production mode"
- [ ] Select region (us-central1 recommended)
- [ ] Deploy the security rules (already in firestore.rules)

### 4. Add Web App

- [ ] Click "</>" icon to add web app
- [ ] Register app with nickname "Assignmate Web"
- [ ] Copy the Firebase config object
- [ ] Paste values into `web/.env.local`

### 5. Add Android App

- [ ] Click Android icon to add Android app
- [ ] Package name: `com.assignmate`
- [ ] Download `google-services.json`
- [ ] Place it in:
  - `android/app/google-services.json`
  - `/home/olivertwist/StudioProjects/assignmate/app/google-services.json`

### 6. Set First Admin

After first user registration, manually set them as admin in Firestore:

```
Collection: users
Document: {userId}
Field: isAdmin = true
```

## Environment Variables

Create `web/.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Deployment Commands

### Web App

```bash
cd /home/olivertwist/assignmate
./deploy.sh
```

Or manually:

```bash
cd web
npm install
npm run build
firebase deploy
```

### Android App

1. Open Android Studio
2. Open project: `/home/olivertwist/StudioProjects/assignmate`
3. Wait for Gradle sync
4. Build → Build Bundle(s) / APK(s) → Build APK(s)
5. APK will be in: `app/build/outputs/apk/debug/`

## Free Tier Limits

Daily quotas (resets every 24 hours):

- Auth: 10,000 users/month
- Firestore: 50,000 reads, 20,000 writes
- Hosting: 10GB bandwidth, 1GB storage

This is plenty for a student app with thousands of users!

## Troubleshooting

### Web App

**Error: Firebase config not found**
→ Check `.env.local` exists with correct values

**Error: Permission denied on Firestore**
→ Deploy security rules: `firebase deploy --only firestore:rules`

**Build fails**
→ Delete `node_modules` and run `npm install` again

### Android App

**Error: google-services.json not found**
→ Download from Firebase Console and place in `app/` folder

**Gradle sync fails**
→ Check internet connection, try "File → Invalidate Caches → Invalidate and Restart"

## Features Checklist

### Both Apps Include

- [x] User registration and login
- [x] Real-time assignment list
- [x] Create, read, update, delete assignments
- [x] Priority levels (low/medium/high)
- [x] Status tracking (pending/in-progress/completed)
- [x] Calendar view
- [x] Dashboard with stats
- [x] Admin panel (for admin users)
- [x] Offline support
- [x] Real-time sync

### Web Only

- [x] Responsive design
- [x] Optimistic updates
- [x] Admin analytics dashboard

### Android Only

- [x] Native Material Design
- [x] Native navigation
- [x] APK distribution

## Next Features to Add (Optional)

- [ ] Push notifications
- [ ] Assignment reminders
- [ ] File attachments
- [ ] Dark mode
- [ ] Assignment sharing
- [ ] Export to calendar

## Support

For Firebase free tier questions:
https://firebase.google.com/pricing

For help with deployment:
Run `./deploy.sh` and follow the prompts
