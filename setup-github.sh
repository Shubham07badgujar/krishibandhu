#!/bin/bash

# 🚀 KrishiBandhu GitHub Deployment Setup Script
echo "🌾 KrishiBandhu GitHub Deployment Setup"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if git is installed
check_git() {
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    print_status "Git is installed"
}

# Check if gh CLI is installed
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        print_warning "GitHub CLI not found. You can install it for easier repository management."
        echo "Visit: https://cli.github.com/"
        return 1
    fi
    print_status "GitHub CLI is installed"
    return 0
}

# Initialize git repository
init_git_repo() {
    print_header "Initializing Git Repository"
    
    if [ -d ".git" ]; then
        print_status "Git repository already initialized"
    else
        git init
        print_status "Git repository initialized"
    fi
    
    # Add .gitignore if not exists
    if [ ! -f ".gitignore" ]; then
        print_status "Creating .gitignore file"
        # .gitignore is already created by the script
    fi
}

# Setup GitHub repository
setup_github_repo() {
    print_header "Setting up GitHub Repository"
    
    echo "Enter your GitHub username:"
    read -r GITHUB_USERNAME
    
    if [ -z "$GITHUB_USERNAME" ]; then
        print_error "GitHub username is required"
        exit 1
    fi
    
    echo "Enter repository name (default: krishibandhu):"
    read -r REPO_NAME
    REPO_NAME=${REPO_NAME:-krishibandhu}
    
    # Check if GitHub CLI is available for easier setup
    if check_gh_cli; then
        echo "Do you want to create the repository using GitHub CLI? (y/n)"
        read -r use_gh_cli
        
        if [ "$use_gh_cli" = "y" ]; then
            gh repo create "$REPO_NAME" --public --description "Agricultural Support Platform for farmers"
            print_status "Repository created using GitHub CLI"
        fi
    else
        print_warning "Please create the repository manually on GitHub:"
        echo "1. Go to https://github.com/new"
        echo "2. Repository name: $REPO_NAME"
        echo "3. Description: Agricultural Support Platform for farmers"
        echo "4. Set to Public or Private as needed"
        echo "5. Don't initialize with README (we have one)"
        echo ""
        echo "Press Enter when you've created the repository..."
        read -r
    fi
    
    # Add remote origin
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git" 2>/dev/null || {
        git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
        print_status "Updated remote origin URL"
    }
}

# Initial commit and push
initial_push() {
    print_header "Making Initial Commit"
    
    # Add all files
    git add .
    
    # Check if there are changes to commit
    if git diff --staged --quiet; then
        print_warning "No changes to commit"
    else
        git commit -m "Initial commit: KrishiBandhu Agricultural Platform

- Complete agricultural support platform
- React frontend with modern UI
- Express.js backend with MongoDB
- Features: Weather, Government Schemes, Loans, Crop Health, AI Assistant
- GitHub Actions workflows for automated deployment
- Docker support for containerized deployment
- Comprehensive documentation"
        
        print_status "Initial commit created"
    fi
    
    # Set main branch
    git branch -M main
    
    # Push to GitHub
    print_status "Pushing to GitHub..."
    if git push -u origin main; then
        print_status "Successfully pushed to GitHub!"
        echo "🌐 Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    else
        print_error "Failed to push to GitHub. Please check your credentials and repository setup."
        exit 1
    fi
}

# Setup GitHub Pages
setup_github_pages() {
    print_header "Setting up GitHub Pages"
    
    echo "GitHub Pages setup instructions:"
    echo "1. Go to https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
    echo "2. Under 'Source', select 'GitHub Actions'"
    echo "3. The workflow will automatically deploy your frontend"
    echo ""
    echo "Your site will be available at:"
    echo "https://$GITHUB_USERNAME.github.io/$REPO_NAME"
    echo ""
    echo "Do you want to open GitHub repository settings now? (y/n)"
    read -r open_settings
    
    if [ "$open_settings" = "y" ]; then
        if command -v open &> /dev/null; then
            open "https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
        else
            print_status "Please manually open: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
        fi
    fi
}

# Setup repository secrets
setup_secrets() {
    print_header "Setting up Repository Secrets"
    
    echo "You need to add the following secrets to your GitHub repository:"
    echo ""
    echo "🔑 Required Secrets:"
    echo "1. VITE_BACKEND_URL - Your backend API URL"
    echo "2. VITE_GOOGLE_CLIENT_ID - Google OAuth client ID"
    echo ""
    echo "🚀 For Vercel deployment (optional):"
    echo "3. VERCEL_TOKEN - Your Vercel account token"
    echo "4. ORG_ID - Your Vercel organization ID"
    echo "5. PROJECT_ID_BACKEND - Backend project ID from Vercel"
    echo "6. PROJECT_ID_FRONTEND - Frontend project ID from Vercel"
    echo ""
    echo "🐳 For server deployment (optional):"
    echo "7. HOST - Server IP address"
    echo "8. USERNAME - Server username"
    echo "9. KEY - SSH private key"
    echo ""
    echo "To add secrets:"
    echo "1. Go to https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/secrets/actions"
    echo "2. Click 'New repository secret'"
    echo "3. Add each secret with its value"
    echo ""
    echo "Do you want to open the secrets page now? (y/n)"
    read -r open_secrets
    
    if [ "$open_secrets" = "y" ]; then
        if command -v open &> /dev/null; then
            open "https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/secrets/actions"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/secrets/actions"
        else
            print_status "Please manually open: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/secrets/actions"
        fi
    fi
}

# Setup Vercel integration
setup_vercel() {
    print_header "Setting up Vercel Integration"
    
    if ! command -v vercel &> /dev/null; then
        echo "Do you want to install Vercel CLI? (y/n)"
        read -r install_vercel
        
        if [ "$install_vercel" = "y" ]; then
            npm install -g vercel
            print_status "Vercel CLI installed"
        else
            print_warning "Skipping Vercel setup. You can install it later with: npm install -g vercel"
            return
        fi
    fi
    
    echo "Vercel setup options:"
    echo "1. Deploy backend to Vercel"
    echo "2. Deploy frontend to Vercel"  
    echo "3. Both"
    echo "4. Skip for now"
    echo ""
    read -p "Choose option (1-4): " vercel_option
    
    case $vercel_option in
        1)
            deploy_backend_vercel
            ;;
        2)
            deploy_frontend_vercel
            ;;
        3)
            deploy_backend_vercel
            deploy_frontend_vercel
            ;;
        4)
            print_status "Skipping Vercel setup"
            ;;
        *)
            print_warning "Invalid option, skipping Vercel setup"
            ;;
    esac
}

deploy_backend_vercel() {
    print_status "Deploying backend to Vercel..."
    cd server
    
    # Login to Vercel if not already logged in
    vercel whoami > /dev/null 2>&1 || vercel login
    
    # Deploy
    vercel --prod
    
    print_status "Backend deployed to Vercel"
    print_status "Note down the deployment URL and project ID for GitHub secrets"
    
    cd ..
}

deploy_frontend_vercel() {
    print_status "Deploying frontend to Vercel..."
    cd krishibandhu-client
    
    # Login to Vercel if not already logged in
    vercel whoami > /dev/null 2>&1 || vercel login
    
    # Deploy
    vercel --prod
    
    print_status "Frontend deployed to Vercel"
    print_status "Note down the deployment URL and project ID for GitHub secrets"
    
    cd ..
}

# Main deployment summary
deployment_summary() {
    print_header "Deployment Summary"
    
    echo "🎉 Your KrishiBandhu project is now set up on GitHub!"
    echo ""
    echo "📋 What's been set up:"
    echo "✅ Git repository initialized"
    echo "✅ Code pushed to GitHub"
    echo "✅ GitHub Actions workflows configured"
    echo "✅ Deployment configurations ready"
    echo ""
    echo "🔗 Your URLs:"
    echo "📧 Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo "🌐 GitHub Pages: https://$GITHUB_USERNAME.github.io/$REPO_NAME"
    echo "⚡ Actions: https://github.com/$GITHUB_USERNAME/$REPO_NAME/actions"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Configure repository secrets (if not done already)"
    echo "2. Enable GitHub Pages in repository settings"
    echo "3. Push changes to trigger automatic deployment"
    echo ""
    echo "🚀 Available Deployment Options:"
    echo "• GitHub Pages (Frontend only)"
    echo "• Vercel (Full-stack)"
    echo "• Docker containers"
    echo "• Traditional VPS"
    echo ""
    echo "📚 Documentation:"
    echo "• GITHUB_DEPLOYMENT.md - Complete GitHub deployment guide"
    echo "• DEPLOYMENT_GUIDE.md - All deployment options"
    echo "• DEPLOYMENT_CHECKLIST.md - Step-by-step checklist"
    echo ""
    print_status "Happy coding! 🌾"
}

# Main script execution
main() {
    print_header "KrishiBandhu GitHub Deployment Setup"
    
    # Check prerequisites
    check_git
    
    # Setup process
    init_git_repo
    setup_github_repo
    initial_push
    setup_github_pages
    setup_secrets
    
    # Optional Vercel setup
    echo "Do you want to set up Vercel deployment now? (y/n)"
    read -r setup_vercel_now
    
    if [ "$setup_vercel_now" = "y" ]; then
        setup_vercel
    fi
    
    # Final summary
    deployment_summary
}

# Run main function
main "$@"
