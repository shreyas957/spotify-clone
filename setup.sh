#!/bin/bash

# Spotify Clone Quick Setup Script
echo "🎵 Setting up Spotify Clone..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check prerequisites
echo "Checking prerequisites..."

if command_exists node; then
    NODE_VERSION=$(node --version)
    print_status "Node.js is installed: $NODE_VERSION"
else
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_status "npm is installed: $NPM_VERSION"
else
    print_error "npm is not installed"
    exit 1
fi

if command_exists java; then
    JAVA_VERSION=$(java --version | head -n 1)
    print_status "Java is installed: $JAVA_VERSION"
else
    print_error "Java is not installed. Please install JDK 17+ from https://adoptium.net/"
    exit 1
fi

if command_exists mvn; then
    MVN_VERSION=$(mvn --version | head -n 1)
    print_status "Maven is installed: $MVN_VERSION"
else
    print_error "Maven is not installed. Please install Maven from https://maven.apache.org/"
    exit 1
fi

if command_exists docker; then
    DOCKER_VERSION=$(docker --version)
    print_status "Docker is installed: $DOCKER_VERSION"
else
    print_error "Docker is not installed. Please install Docker from https://www.docker.com/"
    exit 1
fi

# Check for Docker Compose
if docker compose version >/dev/null 2>&1; then
    COMPOSE_VERSION=$(docker compose version)
    print_status "Docker Compose is available: $COMPOSE_VERSION"
elif command_exists docker-compose; then
    COMPOSE_VERSION=$(docker-compose --version)
    print_status "Docker Compose is available: $COMPOSE_VERSION"
else
    print_error "Docker Compose is not available"
    exit 1
fi

echo ""
echo "📦 Setting up backend services..."

# Setup backend environment
cd spotify-microservices

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        print_warning "Copying .env.example to .env. Please update with your API keys."
        cp .env.example .env
    else
        print_warning "Creating .env file. Please update with your API keys."
        cat > .env << 'EOF'
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
OLLAMA_BASE_URL=http://localhost:11434

# Service Configuration
EUREKA_SERVICE_HOSTNAME=localhost
EUREKA_DEFAULT_ZONE_URL=http://localhost:8761/eureka/

# Database Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Service Hosts
USER_SERVICE_HOST=http://localhost:8001
AUTH_SERVICE_HOST=http://localhost:8002
MUSIC_SERVICE_HOST=http://localhost:8003
WISHLIST_SERVICE_HOST=http://localhost:8004
AI_LLM_CHAT_SERVICE_HOST=http://localhost:8005

# Frontend Configuration
FRONTEND_URL=http://localhost:4300

# Database Configuration
MYSQL_ROOT_PASSWORD=12345
MYSQL_DATABASE=user
EOF
    fi
else
    print_status ".env file already exists"
fi

# Validate Docker Compose configuration
if docker compose config --quiet >/dev/null 2>&1; then
    print_status "Docker Compose configuration is valid"
else
    print_error "Docker Compose configuration has issues"
fi

echo ""
echo "🌐 Setting up frontend..."

# Setup frontend
cd ../spotify-angular-frontend

if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
else
    print_status "Frontend dependencies already installed"
fi

echo ""
echo "🚀 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update spotify-microservices/.env with your API keys"
echo "   - Spotify API keys from https://developer.spotify.com/"
echo "   - Gemini API key from https://makersuite.google.com/"
echo ""
echo "2. Start the application:"
echo "   cd spotify-microservices && docker compose up -d"
echo "   cd ../spotify-angular-frontend && npm start"
echo ""
echo "3. Access the application:"
echo "   - Frontend: http://localhost:4300"
echo "   - API Gateway: http://localhost:9090"
echo "   - Eureka Dashboard: http://localhost:8761"
echo ""
echo "For more details, see the README.md file."