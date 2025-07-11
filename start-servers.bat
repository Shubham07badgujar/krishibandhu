@echo off
echo 🚀 KrishiBandhu E-Commerce Setup and Launch Script
echo ================================================

echo.
echo 📦 Installing frontend dependencies...
cd /d "c:\Users\HP\Desktop\VS codes\krishibandhu\krishibandhu-client"
call npm install

echo.
echo 📦 Installing backend dependencies...
cd /d "c:\Users\HP\Desktop\VS codes\krishibandhu\server"
call npm install

echo.
echo 🚀 Starting backend server...
start "Backend Server" cmd /k "cd /d \"c:\Users\HP\Desktop\VS codes\krishibandhu\server\" && npm start"

echo.
echo ⏳ Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo 🚀 Starting frontend development server...
start "Frontend Dev Server" cmd /k "cd /d \"c:\Users\HP\Desktop\VS codes\krishibandhu\krishibandhu-client\" && npm run dev"

echo.
echo ✅ Both servers are starting!
echo.
echo 📋 Access your application:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo.
echo 🧪 To test the e-commerce module:
echo   cd "c:\Users\HP\Desktop\VS codes\krishibandhu\server"
echo   node test-ecommerce.js
echo.
echo Press any key to close this window...
pause >nul
