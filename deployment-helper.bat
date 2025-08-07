@echo off
echo.
echo 🚀 KrishiBandhu Deployment Helper
echo =================================
echo.
echo Your repository: https://github.com/Shubham07badgujar/krishibandhu
echo Actions monitoring: https://github.com/Shubham07badgujar/krishibandhu/actions
echo Settings page: https://github.com/Shubham07badgujar/krishibandhu/settings/pages
echo Future live site: https://Shubham07badgujar.github.io/krishibandhu
echo.
echo 📋 Manual Steps to Complete:
echo.
echo 1. 🔧 Enable GitHub Pages:
echo    - Open: https://github.com/Shubham07badgujar/krishibandhu/settings/pages
echo    - Under "Source", select "GitHub Actions"
echo    - Click "Save"
echo.
echo 2. ⚡ Monitor Deployment:
echo    - Open: https://github.com/Shubham07badgujar/krishibandhu/actions
echo    - Wait for green checkmarks (successful deployment)
echo    - Red X means there's an error to fix
echo.
echo 3. 🌐 Access Your Live Site:
echo    - After successful deployment: https://Shubham07badgujar.github.io/krishibandhu
echo.
echo 4. 🔑 Optional - Add Repository Secrets (for full functionality):
echo    - Go to: https://github.com/Shubham07badgujar/krishibandhu/settings/secrets/actions
echo    - Add: VITE_BACKEND_URL (your backend API URL)
echo    - Add: VITE_GOOGLE_CLIENT_ID (your Google OAuth client ID)
echo.
echo 📱 Quick Actions:
echo.
set /p action="Press 1 to open repository, 2 for actions, 3 for settings, or Enter to continue: "

if "%action%"=="1" (
    start https://github.com/Shubham07badgujar/krishibandhu
    echo Repository opened in browser
) else if "%action%"=="2" (
    start https://github.com/Shubham07badgujar/krishibandhu/actions
    echo Actions page opened in browser
) else if "%action%"=="3" (
    start https://github.com/Shubham07badgujar/krishibandhu/settings/pages
    echo Settings page opened in browser
)

echo.
echo ✅ Deployment initiated! 
echo Your KrishiBandhu agricultural platform will be live shortly.
echo.
pause
