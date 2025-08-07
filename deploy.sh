#!/bin/bash

# KrishiBandhu Quick Deployment Script
echo "🌾 KrishiBandhu Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Check if required tools are installed
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_status "Node.js version: $NODE_VERSION"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_status "npm version: $NPM_VERSION"
    
    # Check if MongoDB is running (optional)
    if command -v mongod &> /dev/null; then
        print_status "MongoDB is installed"
    else
        print_warning "MongoDB not found locally. Make sure you have a MongoDB connection string ready."
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    # Backend dependencies
    print_status "Installing backend dependencies..."
    cd server
    if npm install; then
        print_status "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    cd ..
    
    # Frontend dependencies
    print_status "Installing frontend dependencies..."
    cd krishibandhu-client
    if npm install; then
        print_status "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    
    cd ..
}

# Setup environment files
setup_environment() {
    print_header "Setting up Environment Files"
    
    # Backend environment
    if [ ! -f "server/.env" ]; then
        print_status "Creating backend .env file from template..."
        cp server/.env.example server/.env
        print_warning "Please edit server/.env with your actual configuration values"
    else
        print_status "Backend .env file already exists"
    fi
    
    # Frontend environment
    if [ ! -f "krishibandhu-client/.env.local" ]; then
        print_status "Creating frontend .env.local file from template..."
        cp krishibandhu-client/.env.example krishibandhu-client/.env.local
        print_warning "Please edit krishibandhu-client/.env.local with your actual configuration values"
    else
        print_status "Frontend .env.local file already exists"
    fi
}

# Build frontend for production
build_frontend() {
    print_header "Building Frontend for Production"
    
    cd krishibandhu-client
    print_status "Building React application..."
    
    if npm run build; then
        print_status "Frontend build completed successfully"
        print_status "Build files created in: krishibandhu-client/dist/"
    else
        print_error "Frontend build failed"
        exit 1
    fi
    
    cd ..
}

# Display deployment options
show_deployment_options() {
    print_header "Deployment Options"
    
    echo "Choose your deployment method:"
    echo "1. 🌐 Vercel (Recommended for beginners)"
    echo "2. 🐳 Docker Compose (Local/VPS)"
    echo "3. 🔧 Manual VPS Setup"
    echo "4. ☁️ Cloud Platform (AWS/GCP/Azure)"
    echo ""
    
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            deploy_vercel
            ;;
        2)
            deploy_docker
            ;;
        3)
            deploy_manual
            ;;
        4)
            deploy_cloud
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
}

# Vercel deployment
deploy_vercel() {
    print_header "Vercel Deployment"
    
    print_status "Installing Vercel CLI..."
    npm install -g vercel
    
    print_status "Please follow these steps:"
    echo "1. Deploy backend: cd server && vercel --prod"
    echo "2. Deploy frontend: cd krishibandhu-client && vercel --prod"
    echo "3. Update environment variables in Vercel dashboard"
    echo "4. Set VITE_BACKEND_URL to your backend Vercel URL"
    
    print_warning "Don't forget to set up MongoDB Atlas for your database!"
}

# Docker deployment
deploy_docker() {
    print_header "Docker Deployment"
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Building and starting Docker containers..."
    
    # Update environment variables in docker-compose.yml
    print_warning "Please update environment variables in docker-compose.yml before proceeding"
    read -p "Have you updated the environment variables? (y/n): " updated
    
    if [ "$updated" != "y" ]; then
        print_error "Please update environment variables first"
        exit 1
    fi
    
    if docker-compose up -d --build; then
        print_status "Deployment successful!"
        print_status "Access your application at: http://localhost:3000"
        print_status "API available at: http://localhost:5001"
    else
        print_error "Docker deployment failed"
        exit 1
    fi
}

# Manual VPS deployment
deploy_manual() {
    print_header "Manual VPS Deployment Instructions"
    
    echo "For manual VPS deployment, follow these steps:"
    echo ""
    echo "1. Set up your VPS with Node.js, MongoDB, and Nginx"
    echo "2. Clone your repository to the server"
    echo "3. Install dependencies: ./deploy.sh install_deps"
    echo "4. Set up environment variables"
    echo "5. Build the frontend: ./deploy.sh build"
    echo "6. Use PM2 to run the backend: pm2 start server/server.js --name krishibandhu-api"
    echo "7. Configure Nginx to serve frontend and proxy API requests"
    echo "8. Set up SSL with Let's Encrypt"
    echo ""
    echo "Detailed instructions are available in DEPLOYMENT_GUIDE.md"
}

# Cloud deployment
deploy_cloud() {
    print_header "Cloud Platform Deployment"
    
    echo "For cloud deployment, choose your platform:"
    echo "1. AWS - Use EC2, RDS, and S3"
    echo "2. Google Cloud Platform - Use Compute Engine and Cloud SQL"
    echo "3. Microsoft Azure - Use App Service and CosmosDB"
    echo ""
    echo "Detailed cloud deployment instructions are available in DEPLOYMENT_GUIDE.md"
}

# Health check
health_check() {
    print_header "Running Health Check"
    
    # Check if backend is running
    if curl -f http://localhost:5001/health &> /dev/null; then
        print_status "Backend is running and healthy"
    else
        print_warning "Backend health check failed or not running"
    fi
    
    # Check if frontend build exists
    if [ -d "krishibandhu-client/dist" ]; then
        print_status "Frontend build exists"
    else
        print_warning "Frontend build not found. Run 'build' command first."
    fi
}

# Main script logic
case "${1:-}" in
    "check")
        check_prerequisites
        ;;
    "install")
        check_prerequisites
        install_dependencies
        setup_environment
        ;;
    "build")
        build_frontend
        ;;
    "deploy")
        show_deployment_options
        ;;
    "health")
        health_check
        ;;
    "")
        # Interactive mode
        print_header "KrishiBandhu Deployment Wizard"
        echo "What would you like to do?"
        echo "1. Check prerequisites"
        echo "2. Install dependencies and setup environment"
        echo "3. Build for production"
        echo "4. Deploy application"
        echo "5. Health check"
        echo "6. Exit"
        echo ""
        
        read -p "Enter your choice (1-6): " main_choice
        
        case $main_choice in
            1)
                check_prerequisites
                ;;
            2)
                check_prerequisites
                install_dependencies
                setup_environment
                ;;
            3)
                build_frontend
                ;;
            4)
                show_deployment_options
                ;;
            5)
                health_check
                ;;
            6)
                print_status "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid choice"
                exit 1
                ;;
        esac
        ;;
    *)
        echo "Usage: $0 [check|install|build|deploy|health]"
        echo ""
        echo "Commands:"
        echo "  check   - Check prerequisites"
        echo "  install - Install dependencies and setup environment"
        echo "  build   - Build frontend for production"
        echo "  deploy  - Deploy application"
        echo "  health  - Run health check"
        echo ""
        echo "Run without arguments for interactive mode"
        exit 1
        ;;
esac

print_status "Script completed successfully!"
