# 🚀 GitHub Deployment Guide for KrishiBandhu

## 📋 Overview

This guide will help you deploy your KrishiBandhu project directly from GitHub using automated workflows and various deployment platforms.

## 🔧 Prerequisites

Before deploying to GitHub, ensure you have:
- GitHub account
- Git installed on your local machine
- Node.js 16+ installed
- All project dependencies working locally

## 📂 Repository Setup

### Step 1: Create GitHub Repository

1. **Go to GitHub and create a new repository**
   ```
   Repository name: krishibandhu
   Description: Agricultural Support Platform
   Visibility: Public (or Private)
   Initialize with README: No (we already have one)
   ```

2. **Clone or initialize your local repository**
   ```bash
   # If starting fresh
   git init
   git add .
   git commit -m "Initial commit: KrishiBandhu Agricultural Platform"
   
   # Add GitHub remote
   git remote add origin https://github.com/YOUR_USERNAME/krishibandhu.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Setup GitHub Repository Settings

1. **Go to repository Settings > Pages**
   - Source: Deploy from a branch
   - Branch: gh-pages (will be created automatically)
   
2. **Go to repository Settings > Secrets and variables > Actions**
   
   Add the following repository secrets:

   **For Vercel Deployment:**
   - `VERCEL_TOKEN` - Your Vercel account token
   - `ORG_ID` - Your Vercel organization ID
   - `PROJECT_ID_BACKEND` - Backend project ID from Vercel
   - `PROJECT_ID_FRONTEND` - Frontend project ID from Vercel
   - `VITE_BACKEND_URL` - Your backend URL
   - `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID

   **For Server Deployment (if using VPS):**
   - `HOST` - Server IP address
   - `USERNAME` - Server username
   - `KEY` - SSH private key for server access

## 🌐 Deployment Options

### Option 1: GitHub Pages + Vercel (Recommended)

This setup uses GitHub Pages for frontend and Vercel for backend.

#### Step 1: Setup Vercel Projects

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy backend first
cd server
vercel --prod
# Follow prompts and note down the project ID

# Deploy frontend
cd ../krishibandhu-client
vercel --prod
# Follow prompts and note down the project ID
```

#### Step 2: Configure GitHub Secrets

Add these secrets to your GitHub repository:

```
VERCEL_TOKEN=your_vercel_token
ORG_ID=your_org_id
PROJECT_ID_BACKEND=backend_project_id
PROJECT_ID_FRONTEND=frontend_project_id
VITE_BACKEND_URL=https://your-backend.vercel.app
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

#### Step 3: Push to GitHub

```bash
git add .
git commit -m "Add GitHub Actions workflows"
git push origin main
```

The deployment will start automatically!

### Option 2: GitHub Pages Only (Frontend)

For frontend-only deployment on GitHub Pages:

#### Step 1: Enable GitHub Pages

1. Go to repository Settings > Pages
2. Select "GitHub Actions" as source
3. The `pages.yml` workflow will handle deployment

#### Step 2: Update Environment Variables

Create repository secrets:
```
VITE_BACKEND_URL=https://your-backend-api.herokuapp.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

#### Step 3: Access Your Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/krishibandhu
```

### Option 3: Docker with GitHub Container Registry

For containerized deployment:

#### Step 1: Enable GitHub Packages

The `docker.yml` workflow will automatically:
- Build Docker images for both frontend and backend
- Push images to GitHub Container Registry
- Deploy to your server (if configured)

#### Step 2: Configure Server Secrets (Optional)

If you have a VPS for deployment:
```
HOST=your.server.ip
USERNAME=your_server_username
KEY=your_ssh_private_key
```

### Option 4: Full CI/CD Pipeline

The `ci.yml` workflow provides:
- Automated testing on multiple Node.js versions
- Code linting
- Build verification
- Automatic deployment on successful tests

## 🔄 Automated Workflows

### Available Workflows

1. **`deploy.yml`** - Deploys to Vercel automatically
2. **`ci.yml`** - Runs tests and deploys if successful
3. **`pages.yml`** - Deploys frontend to GitHub Pages
4. **`docker.yml`** - Builds and pushes Docker images

### Workflow Triggers

- **Push to main/master**: Triggers production deployment
- **Pull Requests**: Triggers testing and preview deployments
- **Manual**: You can manually trigger workflows from Actions tab

## 📋 Step-by-Step GitHub Deployment

### Quick Setup (5 minutes)

1. **Create GitHub repository and push code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/krishibandhu.git
   git push -u origin main
   ```

2. **Setup Vercel (for backend)**
   ```bash
   npm install -g vercel
   cd server
   vercel login
   vercel --prod
   ```

3. **Add GitHub Secrets**
   - Go to repository Settings > Secrets and variables > Actions
   - Add all required secrets (see list above)

4. **Enable GitHub Pages**
   - Go to Settings > Pages
   - Select "GitHub Actions" as source

5. **Push changes to trigger deployment**
   ```bash
   git push origin main
   ```

### Manual Deployment Commands

If you prefer manual deployment:

```bash
# Deploy backend to Vercel
cd server
vercel --prod

# Build and deploy frontend to GitHub Pages
cd ../krishibandhu-client
npm run build
# Manually upload dist/ folder to gh-pages branch
```

## 🔍 Monitoring Deployments

### GitHub Actions

1. **View deployment status**
   - Go to your repository
   - Click "Actions" tab
   - See all workflow runs and their status

2. **Debug failed deployments**
   - Click on failed workflow
   - Expand failed steps to see error messages
   - Check logs for specific issues

### Vercel Dashboard

1. **Monitor backend deployment**
   - Go to https://vercel.com/dashboard
   - Check deployment status and logs
   - View function logs and performance metrics

### GitHub Pages

1. **Check frontend deployment**
   - Go to repository Settings > Pages
   - See deployment status and URL
   - Access your live site

## 🔧 Environment Configuration

### Development Environment

Create `.env.development`:
```env
VITE_BACKEND_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your_dev_google_client_id
```

### Production Environment

GitHub Actions will use repository secrets:
```env
VITE_BACKEND_URL=${{ secrets.VITE_BACKEND_URL }}
VITE_GOOGLE_CLIENT_ID=${{ secrets.VITE_GOOGLE_CLIENT_ID }}
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check Node.js version compatibility
   # Ensure all dependencies are in package.json
   # Verify environment variables are set
   ```

2. **Deployment Failures**
   ```bash
   # Check GitHub Secrets are correctly set
   # Verify Vercel token is valid
   # Ensure project IDs match your Vercel projects
   ```

3. **GitHub Pages 404 Error**
   ```bash
   # Ensure index.html is in root of gh-pages branch
   # Check if base URL is set correctly in Vite config
   # Verify GitHub Pages is enabled in repository settings
   ```

### Debug Commands

```bash
# Check workflow logs
gh workflow list
gh run list
gh run view [RUN_ID]

# Local testing
npm run build
npm run preview
```

## 🔒 Security Best Practices

### Repository Security

1. **Never commit sensitive data**
   ```bash
   # Add to .gitignore
   echo ".env" >> .gitignore
   echo "*.env.local" >> .gitignore
   echo ".env.production" >> .gitignore
   ```

2. **Use GitHub Secrets for all sensitive data**
   - API keys
   - Database connection strings
   - Authentication tokens

3. **Enable branch protection**
   - Go to Settings > Branches
   - Add protection rules for main branch
   - Require status checks before merging

## 📊 Performance Monitoring

### GitHub Insights

- **Actions usage**: Monitor workflow run times and costs
- **Repository analytics**: Track commits, contributors, traffic

### Deployment Metrics

- **Build times**: Optimize for faster deployments
- **Bundle size**: Monitor frontend bundle size
- **Performance**: Use Lighthouse CI for performance testing

## 🎯 Next Steps After Deployment

1. **Setup Custom Domain** (Optional)
   ```bash
   # In GitHub Pages settings
   # Add your custom domain
   # Configure DNS records
   ```

2. **Add SSL Certificate**
   - GitHub Pages provides HTTPS automatically
   - Vercel provides SSL for custom domains

3. **Setup Monitoring**
   - Add error tracking (Sentry)
   - Setup uptime monitoring
   - Configure performance monitoring

4. **Continuous Improvement**
   - Add more comprehensive tests
   - Implement code quality checks
   - Setup automated security scanning

## 📞 Support

### GitHub Resources
- **GitHub Actions Documentation**: https://docs.github.com/actions
- **GitHub Pages Documentation**: https://docs.github.com/pages
- **GitHub Container Registry**: https://docs.github.com/packages

### Community Support
- Create issues in your repository for bug reports
- Use GitHub Discussions for questions
- Check Actions marketplace for additional workflows

---

**Your KrishiBandhu project is now ready for automated deployment from GitHub! 🚀**

Every push to your main branch will automatically deploy your updates to production.
