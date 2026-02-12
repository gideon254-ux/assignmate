# 🚨 404 DEPLOYMENT_NOT_FOUND - How to Fix

## What This Error Means

The error **"404: DEPLOYMENT_NOT_FOUND"** means:
- ❌ The app has NOT been deployed to Vercel yet
- ❌ The URL you're trying to access doesn't exist
- ❌ No deployment was found at that address

## ✅ Solution: Deploy First!

### Step 1: Deploy to Vercel

```bash
cd /home/olivertwist/assignmate/web

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

### Step 2: Follow the Prompts

```
? Set up and deploy "~/assignmate/web"? [Y/n] y
? Which scope do you want to deploy to? [Your Username]
? Link to existing project? [y/N] n
? What's your project name? [assignmate]
? In which directory is your code located? [./]
? Want to override the settings? [y/N] n
```

### Step 3: Wait for Deployment

You'll see output like:
```
🔍  Inspect: https://vercel.com/yourusername/assignmate/xxxxxxxx [2s]
✅  Production: https://assignmate-yourusername.vercel.app [2s]
```

**✅ Your app is now live at the Production URL!**

### Step 4: Add Environment Variables

Go to https://vercel.com/dashboard
1. Click your project
2. Go to **Settings** → **Environment Variables**
3. Add all variables from your `.env.local` file:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAaX5_tWNauqacbAzGXrvMJc6dou1j3MJ4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=assignmate-254.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=assignmate-254
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=assignmate-254.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=981973088869
NEXT_PUBLIC_FIREBASE_APP_ID=1:981973088869:web:8785cdab8e0a7bab45648c
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-RL3F5DSF1S
```

4. Click **Save**
5. Redeploy: `vercel --prod`

### Step 5: Initialize Database

```bash
# Make sure DATABASE_URL is set locally
npx prisma db push
```

This creates the tables in your Neon database.

## 🔧 Quick Deploy Script

I've created a deploy script for you:

```bash
cd /home/olivertwist/assignmate/web
./deploy-vercel.sh
```

This will:
1. Check prerequisites
2. Install dependencies
3. Build locally
4. Deploy to Vercel

## 📋 Deployment Checklist

Before your app will work:

- [ ] Deployed to Vercel (`vercel` or `vercel --prod`)
- [ ] Environment variables added in Vercel Dashboard
- [ ] Database tables created (`npx prisma db push`)
- [ ] Firebase Auth enabled in Firebase Console

## ❓ Common Questions

**Q: Why do I see "DEPLOYMENT_NOT_FOUND"?**
A: Because you haven't deployed yet. Run `vercel` first.

**Q: Do I need to deploy every time I make changes?**
A: Yes, run `vercel --prod` after changes. Or connect GitHub for auto-deploy.

**Q: Where is my deployed URL?**
A: After deployment, Vercel shows it. Usually: `https://assignmate-yourusername.vercel.app`

**Q: Can I use a custom domain?**
A: Yes! Go to Vercel Dashboard → Your Project → Settings → Domains

## 🚀 One-Command Deploy

```bash
cd /home/olivertwist/assignmate/web && vercel --prod
```

**This will deploy your app and give you a live URL!**

## After Deployment

Once deployed successfully:
1. Visit your URL (shown in terminal)
2. Test login/signup
3. Create an assignment
4. Set first user as admin in database

## Need Help?

- Check TROUBLESHOOTING_404.md for detailed fixes
- Check DEPLOY_VERCEL.md for full deployment guide
- Run `./deploy-vercel.sh` for guided deployment

---

**⚠️ Remember: You MUST run `vercel` or `vercel --prod` to deploy before the URL will work!**