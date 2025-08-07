@echo off
echo 🚀 KrishiBandhu GitHub Deployment Script
echo ========================================

:menu
echo.
echo What would you like to do?
echo 1. Initialize new GitHub repository
echo 2. Push to existing repository
echo 3. Setup GitHub Pages deployment
echo 4. Deploy to Vercel from GitHub
echo 5. View deployment status
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto init_repo
if "%choice%"=="2" goto push_repo
if "%choice%"=="3" goto setup_pages
if "%choice%"=="4" goto deploy_vercel
if "%choice%"=="5" goto view_status
if "%choice%"=="6" goto exit
goto invalid

:init_repo
echo Setting up new GitHub repository...
echo.
set /p repo_name="Enter repository name (default: krishibandhu): "
if "%repo_name%"=="" set repo_name=krishibandhu

set /p github_username="Enter your GitHub username: "
if "%github_username%"=="" (
    echo GitHub username is required!
    goto menu
)

echo.
echo Initializing Git repository...
git init
echo.
echo Adding all files...
git add .
echo.
echo Making initial commit...
git commit -m "Initial commit: KrishiBandhu Agricultural Platform"
echo.
echo Adding GitHub remote...
git remote add origin https://github.com/%github_username%/%repo_name%.git
echo.
echo Setting main branch...
git branch -M main
echo.
echo Pushing to GitHub...
git push -u origin main
echo.
echo ✅ Repository created and pushed to GitHub!
echo 🌐 Visit: https://github.com/%github_username%/%repo_name%
echo.
pause
goto menu

:push_repo
echo Pushing changes to existing repository...
echo.
echo Adding all changes...
git add .
echo.
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg="Update: Latest changes to KrishiBandhu"
echo.
echo Committing changes...
git commit -m "%commit_msg%"
echo.
echo Pushing to GitHub...
git push
echo.
echo ✅ Changes pushed to GitHub!
echo.
pause
goto menu

:setup_pages
echo Setting up GitHub Pages deployment...
echo.
echo Follow these steps:
echo 1. Go to your repository on GitHub
echo 2. Click on "Settings" tab
echo 3. Scroll down to "Pages" section
echo 4. Under "Source", select "GitHub Actions"
echo 5. The pages.yml workflow will handle deployment
echo.
echo Your site will be available at:
echo https://YOUR_USERNAME.github.io/krishibandhu
echo.
echo Make sure you have set the following repository secrets:
echo - VITE_BACKEND_URL
echo - VITE_GOOGLE_CLIENT_ID
echo.
pause
goto menu

:deploy_vercel
echo Deploying to Vercel from GitHub...
echo.
echo Prerequisites:
echo 1. Vercel account connected to GitHub
echo 2. Repository secrets configured in GitHub
echo.
echo Required GitHub Secrets:
echo - VERCEL_TOKEN (from Vercel dashboard)
echo - ORG_ID (from Vercel)
echo - PROJECT_ID_BACKEND (from Vercel backend project)
echo - PROJECT_ID_FRONTEND (from Vercel frontend project)
echo - VITE_BACKEND_URL (your backend URL)
echo - VITE_GOOGLE_CLIENT_ID (Google OAuth client ID)
echo.
echo Setup Instructions:
echo 1. Go to https://vercel.com/dashboard
echo 2. Import your GitHub repository
echo 3. Deploy backend (server folder)
echo 4. Deploy frontend (krishibandhu-client folder)
echo 5. Note down the project IDs
echo 6. Add all secrets to GitHub repository settings
echo.
echo The deploy.yml workflow will handle automatic deployment!
echo.
pause
goto menu

:view_status
echo Checking deployment status...
echo.
echo Opening GitHub Actions page...
start https://github.com
echo.
echo To check deployment status:
echo 1. Go to your repository
echo 2. Click "Actions" tab
echo 3. View workflow runs
echo.
echo To check if site is live:
start https://YOUR_USERNAME.github.io/krishibandhu
echo.
pause
goto menu

:invalid
echo Invalid choice. Please try again.
goto menu

:exit
echo.
echo 📋 Quick Reference:
echo.
echo GitHub Repository: https://github.com/YOUR_USERNAME/krishibandhu
echo Frontend (GitHub Pages): https://YOUR_USERNAME.github.io/krishibandhu
echo Backend (Vercel): https://your-backend.vercel.app
echo.
echo 🔧 Next Steps:
echo 1. Configure GitHub repository secrets
echo 2. Enable GitHub Pages in repository settings
echo 3. Connect Vercel to your GitHub repository
echo 4. Push changes to trigger automatic deployment
echo.
echo Happy coding! 🌾
pause
