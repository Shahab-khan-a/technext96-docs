# Firebase Hosting Deployment Guide

## 🎯 Overview
This guide helps you deploy your Next.js documentation app to Firebase App Hosting with 100% feature parity with your local development environment.

## ✅ Prerequisites
- Node.js 20.x or later installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Logged into Firebase (`firebase login`)
- Firebase project already created: **app-technext96**

## 🚀 Deployment Steps

### Option 1: Automatic Deployment (Recommended)

**On Windows (PowerShell):**
```powershell
.\deploy.ps1
```

**On macOS/Linux (Bash):**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Deployment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Deploy to Firebase:**
   ```bash
   firebase deploy --only apphosting
   ```

## 📋 What's Configured

### App Hosting Configuration (`apphosting.yaml`)
- **Runtime:** Node.js 20
- **CPU:** 1 vCPU
- **Memory:** 1 GiB
- **Concurrency:** 100
- **Max Instances:** 100
- **Min Instances:** 0 (scales to zero when idle)

### Environment Variables
The following environment variables are automatically loaded:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NODE_ENV` - Set to `production`

### Next.js Configuration
- Unoptimized images for faster deployment
- Server-side rendering enabled (like local)
- Strict mode enabled for development checks
- Compression enabled for better performance

## 🔍 After Deployment

1. **Check deployment status:**
   ```bash
   firebase deploy --info
   ```

2. **View logs:**
   ```bash
   firebase functions:log
   ```
   Or use Firebase Console: https://console.firebase.google.com/u/0/project/app-technext96/apphosting

3. **Test your app:**
   - The URL will be: `https://app-technext96.web.app`
   - Test all features that work in local development

## 🐛 Troubleshooting

### Issue: Build fails with dependency errors
**Solution:**
```bash
rm -rf node_modules
npm install
npm run build
```

### Issue: Environment variables not working
**Solution:**
1. Verify `.env.production` exists with correct keys
2. Check Firebase Console for environment variable settings
3. Rebuild and redeploy

### Issue: Database queries fail in production
**Solution:**
1. Verify Supabase project allows requests from `web.app` domain
2. Check CORS settings in Supabase
3. Review Supabase logs for actual errors

### Issue: Pages show 404
**Solution:**
1. Verify the build completed successfully
2. Check that all pages exist in `src/app/`
3. Clear Firebase cache: `firebase deploy --force`

## 📊 Monitor Your App

View real-time metrics in Firebase Console:
- https://console.firebase.google.com/u/0/project/app-technext96/apphosting

## 🔄 Continuous Improvements

For automatic deployments on every push:
1. Connect your GitHub repository to Firebase
2. Firebase will automatically build and deploy on commits

## 💡 Performance Tips

- The app scales automatically based on demand
- Idle instances shut down to save costs
- Cold starts are typically 5-15 seconds
- Keep `.env.production` with only necessary variables

---

**Questions?** Check the [Next.js Deployment Docs](https://nextjs.org/docs/deployment) or [Firebase App Hosting Docs](https://firebase.google.com/docs/app-hosting)
