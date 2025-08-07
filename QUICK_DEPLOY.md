# 🚀 Quick GitHub Deployment Guide

## ⚡ 5-Minute Deployment

### Step 1: Push to GitHub (2 minutes)

```bash
# Initialize Git and push to GitHub
git init
git add .
git commit -m "Initial commit: KrishiBandhu Agricultural Platform"
git remote add origin https://github.com/YOUR_USERNAME/krishibandhu.git
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages (1 minute)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **"GitHub Actions"**
4. Done! Your site will deploy automatically

### Step 3: Add Repository Secrets (2 minutes)

Go to **Settings** → **Secrets and variables** → **Actions** and add:

```
VITE_BACKEND_URL=https://your-backend-url.vercel.app
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🌐 Your Live URLs

- **Repository**: `https://github.com/YOUR_USERNAME/krishibandhu`
- **Live Site**: `https://YOUR_USERNAME.github.io/krishibandhu`
- **Actions**: `https://github.com/YOUR_USERNAME/krishibandhu/actions`

## 🔄 Auto-Deployment

Every time you push to the `main` branch:
1. GitHub Actions will automatically build your app
2. Deploy frontend to GitHub Pages
3. Your changes will be live in 2-3 minutes!

## 🚀 Backend Deployment Options

### Option A: Vercel (Recommended)
```bash
npm install -g vercel
cd server
vercel --prod
```

### Option B: Heroku
```bash
git subtree push --prefix server heroku main
```

### Option C: Railway
```bash
railway login
railway init
railway up
```

## 🎯 Quick Commands

### Deploy Updates
```bash
git add .
git commit -m "Update: Your changes description"
git push
```

### View Deployment Status
```bash
# Open GitHub Actions
start https://github.com/YOUR_USERNAME/krishibandhu/actions

# Open live site
start https://YOUR_USERNAME.github.io/krishibandhu
```

## 🔧 Windows Users

Double-click `github-deploy.bat` for guided setup!

---

**That's it! Your KrishiBandhu project is now live on GitHub Pages! 🌾**
