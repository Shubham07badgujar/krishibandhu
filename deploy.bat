@echo off
echo 🌾 KrishiBandhu Windows Deployment Script
echo ==========================================

:menu
echo.
echo What would you like to do?
echo 1. Check prerequisites
echo 2. Install dependencies
echo 3. Build for production
echo 4. Deploy with Docker
echo 5. Start development servers
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto check_prereq
if "%choice%"=="2" goto install_deps
if "%choice%"=="3" goto build_prod
if "%choice%"=="4" goto deploy_docker
if "%choice%"=="5" goto start_dev
if "%choice%"=="6" goto exit
goto invalid

:check_prereq
echo Checking prerequisites...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    goto menu
)
echo ✅ Node.js is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed.
    goto menu
)
echo ✅ npm is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️ Docker is not installed. Install Docker for containerized deployment.
) else (
    echo ✅ Docker is installed
)
goto menu

:install_deps
echo Installing dependencies...
echo.
echo Installing backend dependencies...
cd server
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    cd ..
    goto menu
)
cd ..
echo ✅ Backend dependencies installed

echo.
echo Installing frontend dependencies...
cd krishibandhu-client
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    cd ..
    goto menu
)
cd ..
echo ✅ Frontend dependencies installed

echo.
echo Setting up environment files...
if not exist "server\.env" (
    copy "server\.env.example" "server\.env" >nul
    echo ✅ Created server\.env from template
    echo ⚠️ Please edit server\.env with your actual configuration
) else (
    echo ✅ server\.env already exists
)

if not exist "krishibandhu-client\.env.local" (
    copy "krishibandhu-client\.env.example" "krishibandhu-client\.env.local" >nul
    echo ✅ Created krishibandhu-client\.env.local from template
    echo ⚠️ Please edit krishibandhu-client\.env.local with your actual configuration
) else (
    echo ✅ krishibandhu-client\.env.local already exists
)
goto menu

:build_prod
echo Building for production...
cd krishibandhu-client
echo Building React application...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed
    cd ..
    goto menu
)
echo ✅ Build completed successfully
echo Build files are in krishibandhu-client\dist\
cd ..
goto menu

:deploy_docker
echo Deploying with Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker first.
    goto menu
)

echo ⚠️ Make sure you have updated environment variables in docker-compose.yml
set /p proceed="Proceed with deployment? (y/n): "
if not "%proceed%"=="y" goto menu

echo Starting Docker containers...
docker-compose up -d --build
if errorlevel 1 (
    echo ❌ Docker deployment failed
    goto menu
)
echo ✅ Deployment successful!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔗 Backend API: http://localhost:5001
echo 📊 Database: MongoDB running on port 27017
echo.
echo To stop: docker-compose down
echo To view logs: docker-compose logs -f
goto menu

:start_dev
echo Starting development servers...
echo Starting backend server...
start cmd /k "cd server && npm run dev"
timeout /t 3 >nul
echo Starting frontend server...
start cmd /k "cd krishibandhu-client && npm run dev"
echo ✅ Development servers started
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔗 Backend API: http://localhost:5001
goto menu

:invalid
echo Invalid choice. Please try again.
goto menu

:exit
echo Goodbye!
pause
