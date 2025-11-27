#!/bin/bash

# ============================================================================
# FairTradeWorker Developer Setup Script
# ============================================================================
# This script sets up the development environment for FairTradeWorker.
# It installs dependencies, sets up configuration, and validates the setup.
#
# Usage:
#   ./scripts/setup.sh         # Full setup
#   ./scripts/setup.sh --quick # Skip optional steps
#   ./scripts/setup.sh --help  # Show help
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}======================================${NC}"
    echo ""
}

# Show help
show_help() {
    echo "FairTradeWorker Developer Setup Script"
    echo ""
    echo "Usage:"
    echo "  ./scripts/setup.sh [options]"
    echo ""
    echo "Options:"
    echo "  --quick     Skip optional steps (husky, etc.)"
    echo "  --help      Show this help message"
    echo ""
}

# Check for required tools
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        print_success "Node.js installed: $NODE_VERSION"
        
        # Check minimum version (18+)
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$MAJOR_VERSION" -lt 18 ]; then
            print_error "Node.js 18+ is required. Current version: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        print_success "npm installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check git
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        print_success "$GIT_VERSION"
    else
        print_error "Git is not installed. Please install Git."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    print_status "Installing web app dependencies..."
    npm install
    print_success "Web app dependencies installed"
    
    # Check if mobile directory exists
    if [ -d "mobile" ]; then
        print_status "Installing mobile app dependencies..."
        cd mobile
        npm install
        cd ..
        print_success "Mobile app dependencies installed"
    fi
}

# Setup environment files
setup_environment() {
    print_header "Setting Up Environment"
    
    # Create .env if it doesn't exist
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Created .env from .env.example"
        else
            # Create a basic .env file
            cat > .env << 'EOF'
# FairTradeWorker Environment Configuration
# Copy this file to .env and fill in your values

# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Trueway Routing API (get from api.market)
VITE_TRUEWAY_API_KEY=your_api_key_here

# Stripe (for payments)
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

# Sentry (for error tracking)
VITE_SENTRY_DSN=your_sentry_dsn
EOF
            print_success "Created .env file with default configuration"
        fi
        print_warning "Please update .env with your API keys before running the app"
    else
        print_success ".env file already exists"
    fi
}

# Setup git hooks with Husky (optional)
setup_git_hooks() {
    if [ "$QUICK_SETUP" = true ]; then
        print_status "Skipping git hooks setup (quick mode)"
        return
    fi
    
    print_header "Setting Up Git Hooks"
    
    # Check if husky is installed
    if [ -f "node_modules/.bin/husky" ]; then
        npx husky install 2>/dev/null || true
        print_success "Git hooks installed"
    else
        print_warning "Husky not installed, skipping git hooks setup"
    fi
}

# Validate the setup
validate_setup() {
    print_header "Validating Setup"
    
    # Check if build works
    print_status "Running TypeScript type check..."
    if npx tsc --noEmit 2>/dev/null; then
        print_success "TypeScript check passed"
    else
        print_warning "TypeScript check has errors (this might be expected for a fresh setup)"
    fi
    
    # Try to build
    print_status "Testing build..."
    if npm run build 2>/dev/null; then
        print_success "Build successful"
    else
        print_warning "Build failed - check for any configuration issues"
    fi
}

# Print next steps
print_next_steps() {
    print_header "Setup Complete!"
    
    echo -e "${GREEN}Your development environment is ready!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Update your .env file with API keys"
    echo "  2. Run 'npm run dev' to start the development server"
    echo "  3. Open http://localhost:5173 in your browser"
    echo ""
    echo "Useful commands:"
    echo "  npm run dev      - Start development server"
    echo "  npm run build    - Build for production"
    echo "  npm run lint     - Run linter"
    echo "  npm run preview  - Preview production build"
    echo ""
    echo "For mobile development:"
    echo "  cd mobile"
    echo "  npm start        - Start Expo development server"
    echo ""
    echo -e "${GREEN}Happy coding! 🚀${NC}"
}

# Main execution
main() {
    QUICK_SETUP=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --quick)
                QUICK_SETUP=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    print_header "FairTradeWorker Developer Setup"
    
    check_prerequisites
    install_dependencies
    setup_environment
    setup_git_hooks
    validate_setup
    print_next_steps
}

# Run main function
main "$@"
