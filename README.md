# 🎵 Spotify Clone - Full Stack Music Streaming Application

> A comprehensive full-stack music streaming platform built with Angular and Spring Boot microservices, featuring AI-powered recommendations and real-time music streaming.

[![Frontend: Angular](https://img.shields.io/badge/Frontend-Angular%2020-red?style=flat-square&logo=angular)](https://angular.io/)
[![Backend: Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.5.4-brightgreen?style=flat-square&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![Database: MySQL](https://img.shields.io/badge/Database-MySQL-blue?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Containerization: Docker](https://img.shields.io/badge/Container-Docker-blue?style=flat-square&logo=docker)](https://www.docker.com/)

## 📋 Table of Contents

- [🏗️ Architecture Overview](#️-architecture-overview)
- [✨ Features](#-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Configuration](#️-configuration)
- [🏃‍♂️ Running the Application](#️-running-the-application)
- [📚 API Documentation](#-api-documentation)
- [🔧 Development](#-development)
- [🐳 Docker Deployment](#-docker-deployment)
- [🤝 Contributing](#-contributing)
- [❓ Troubleshooting](#-troubleshooting)
- [📄 License](#-license)

## 🏗️ Architecture Overview

This Spotify clone follows a **microservices architecture** with a clear separation between frontend and backend services:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Angular 20)                    │
│                        Port: 4300                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────────┐
│                   API Gateway (Spring Boot)                │
│                        Port: 9090                          │
└─┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┘
  │         │         │         │         │         │
┌─▼──┐ ┌───▼──┐ ┌────▼──┐ ┌───▼───┐ ┌───▼────┐ ┌──▼────┐
│User│ │ Auth │ │ Music │ │Wishlist│ │AI Chat │ │Config │
│8001│ │ 8002 │ │ 8003  │ │  8004  │ │  8005  │ │ 8888  │
└────┘ └──────┘ └───────┘ └────────┘ └────────┘ └───────┘
  │         │         │         │         │         │
┌─▼─────────▼─────────▼─────────▼─────────▼─────────▼───┐
│           Infrastructure Layer                        │
│  MySQL │ MongoDB │ Redis │ Kafka │ Eureka │ Zookeeper│
└───────────────────────────────────────────────────────┘
```

### Core Components

- **Frontend**: Angular-based SPA with modern UI/UX
- **API Gateway**: Routes requests and handles authentication
- **Microservices**: Modular backend services for different domains
- **Service Discovery**: Eureka server for service registration
- **Configuration**: Centralized config server
- **Data Layer**: Multiple databases for different data types
- **Message Queue**: Kafka for asynchronous communication

## ✨ Features

### 🎧 Core Music Features
- **Music Streaming**: Integration with Spotify Web API for real-time music streaming
- **Search & Browse**: Search for songs, artists, and albums
- **Playlists**: Create and manage personal playlists
- **Recently Played**: Track and display listening history
- **Progress Control**: Interactive progress bar with auto-advance

### 👤 User Management
- **Authentication**: Secure user registration and login
- **Profile Management**: Edit user profiles and preferences
- **User Dashboard**: Personalized music dashboard

### 💝 Smart Features
- **Wishlist**: Save and manage favorite tracks
- **AI Recommendations**: Machine learning-powered music recommendations
- **AI Chat**: Intelligent music assistant powered by Gemini AI and Ollama LLM
- **Real-time Updates**: Live updates using WebSocket connections

### 🎯 Advanced Capabilities
- **Microservices Architecture**: Scalable and maintainable service design
- **Event-Driven**: Kafka-based messaging for loose coupling
- **Caching**: Redis for improved performance
- **Monitoring**: Service health monitoring with Eureka
- **Containerization**: Full Docker support for easy deployment

## 🛠️ Technology Stack

### Frontend
- **Framework**: Angular 20.2.1
- **Build Tool**: Vite 5.4.2
- **Language**: TypeScript 5.9.2
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React
- **Linting**: ESLint 9.9.1

### Backend
- **Framework**: Spring Boot 3.5.4
- **Language**: Java
- **Build Tool**: Maven
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Configuration**: Spring Cloud Config

### Databases
- **MySQL**: User and authentication data
- **MongoDB**: Wishlist and document storage  
- **Redis**: Caching and session storage

### Infrastructure
- **Message Queue**: Apache Kafka with Zookeeper
- **Containerization**: Docker & Docker Compose
- **Service Mesh**: Spring Cloud

### External APIs
- **Spotify Web API**: Music streaming and metadata
- **Google Gemini AI**: Advanced AI recommendations
- **Ollama LLM**: Local language model for chat

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **Java** (JDK 17+)
- **Maven** (v3.6+)
- **Docker** & **Docker Compose** (v20+)
- **Git**

### External Service Accounts
You'll also need accounts and API keys for:
- [Spotify Developer Account](https://developer.spotify.com/) - for music streaming
- [Google AI Studio](https://makersuite.google.com/) - for Gemini AI API
- Ollama (optional) - for local LLM capabilities

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

Run the setup script for automated environment setup:

```bash
# Clone the repository
git clone https://github.com/shreyas957/spotify-clone.git
cd spotify-clone

# Run the setup script
./setup.sh

# Follow the on-screen instructions
```

### Option 2: Manual Setup

### 2. Set Up Environment Variables
Create a `.env` file in the `spotify-microservices` directory:

```bash
cd spotify-microservices
cp .env.example .env  # Create from template if available
```

Edit `.env` with your configuration:
```env
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key
OLLAMA_BASE_URL=http://localhost:11434

# Service Configuration
EUREKA_SERVICE_HOSTNAME=localhost
EUREKA_DEFAULT_ZONE_URL=http://localhost:8761/eureka/

# Database Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Service Hosts (for local development)
USER_SERVICE_HOST=http://localhost:8001
AUTH_SERVICE_HOST=http://localhost:8002
MUSIC_SERVICE_HOST=http://localhost:8003
WISHLIST_SERVICE_HOST=http://localhost:8004
AI_LLM_CHAT_SERVICE_HOST=http://localhost:8005

# Frontend Configuration
FRONTEND_URL=http://localhost:4300
```

### 3. Build and Run with Docker (Recommended)

```bash
# Navigate to microservices directory
cd spotify-microservices

# Build all Docker images
docker compose build

# Start all services
docker compose up -d

# Check service status
docker compose ps
```

### 4. Start Frontend Development Server

```bash
# Navigate to frontend directory
cd ../spotify-angular-frontend

# Install dependencies
npm install

# Start development server
npm run start

# Application will be available at http://localhost:4300
```

### 5. Access the Application

- **Frontend**: http://localhost:4300
- **API Gateway**: http://localhost:9090
- **Eureka Dashboard**: http://localhost:8761

## ⚙️ Configuration

### Frontend Configuration

The Angular frontend configuration is managed through:
- `spotify-angular-frontend/src/environments/` - Environment-specific settings
- `spotify-angular-frontend/vite.config.ts` - Build configuration
- `spotify-angular-frontend/tailwind.config.js` - Styling configuration

### Backend Configuration

Each microservice has its own configuration:
- **Config Server**: Centralized configuration management
- **Service-specific**: `application.yml` files in each service
- **Docker**: Environment variables in `docker-compose.yaml`

### Database Setup

The application uses multiple databases:

1. **MySQL** (Primary user data):
   ```sql
   CREATE DATABASE user;
   CREATE DATABASE auth; 
   CREATE DATABASE music;
   ```

2. **MongoDB** (Document storage):
   ```javascript
   use wishlist;
   ```

3. **Redis** (Caching):
   - No initial setup required

## 🏃‍♂️ Running the Application

### Development Mode

For local development with hot-reload:

1. **Start Infrastructure Services**:
   ```bash
   cd spotify-microservices
   docker compose up -d mysql mongodb redis kafka zookeeper
   ```

2. **Start Config Server**:
   ```bash
   cd spotify-config-server
   mvn spring-boot:run
   ```

3. **Start Eureka Server**:
   ```bash
   cd ../spotify-eureka-server
   mvn spring-boot:run
   ```

4. **Start Individual Services** (in separate terminals):
   ```bash
   # API Gateway
   cd spotify-api-gateway && mvn spring-boot:run

   # User Service  
   cd spotify-user-service && mvn spring-boot:run

   # Auth Service
   cd spotify-auth-service && mvn spring-boot:run

   # Music Service
   cd spotify-music-service && mvn spring-boot:run

   # Wishlist Service
   cd spotify-wishlist-service && mvn spring-boot:run

   # AI Chat Service
   cd spotify-ai-chat-server && mvn spring-boot:run
   ```

5. **Start Frontend**:
   ```bash
   cd spotify-angular-frontend
   npm run start
   ```

### Production Mode

For production deployment:

1. **Build Frontend**:
   ```bash
   cd spotify-angular-frontend
   npm run build
   ```

2. **Deploy with Docker**:
   ```bash
   cd spotify-microservices
   docker compose up -d --build
   ```

## 📚 API Documentation

### Service Endpoints

| Service | Port | Health Check | Description |
|---------|------|--------------|-------------|
| Config Server | 8888 | `/actuator/health` | Configuration management |
| Eureka Server | 8761 | `/` | Service discovery |
| API Gateway | 9090 | `/actuator/health` | Request routing |
| User Service | 8001 | `/actuator/health` | User management |
| Auth Service | 8002 | `/actuator/health` | Authentication |
| Music Service | 8003 | `/actuator/health` | Music operations |
| Wishlist Service | 8004 | `/actuator/health` | Wishlist management |
| AI Chat Service | 8005 | `/actuator/health` | AI-powered chat |

### Postman Collections

API documentation is available via Postman collections in `spotify-microservices/postman-api-collection/`:

- `Auth Service.postman_collection.json`
- `User Service.postman_collection.json`
- `Music Service.postman_collection.json`
- `Wishlist-Service.postman_collection.json`
- `AI Chat Service.postman_collection.json`

Import these collections into Postman for comprehensive API testing.

### Key API Endpoints

#### Authentication
```
POST /api/auth/register - User registration
POST /api/auth/login - User login
POST /api/auth/refresh - Token refresh
```

#### Music
```
GET /api/music/search - Search tracks/artists/albums
GET /api/music/track/{id} - Get track details
GET /api/music/recommendations - Get AI recommendations
```

#### User
```
GET /api/user/profile - Get user profile
PUT /api/user/profile - Update user profile
GET /api/user/recently-played - Get listening history
```

#### Wishlist
```
GET /api/wishlist - Get user wishlist
POST /api/wishlist/add - Add track to wishlist
DELETE /api/wishlist/{trackId} - Remove from wishlist
```

## 🔧 Development

### Frontend Development

```bash
cd spotify-angular-frontend

# Install dependencies
npm install

# Start development server (recommended)
npm run start

# Alternative: Use Angular CLI directly
npx ng serve --host 0.0.0.0 --port 4300

# Run linting
npm run lint

# Build for production (using Angular CLI)
npx ng build

# Alternative build (may have configuration issues)
npm run build

# Preview production build
npm run preview
```

### Backend Development

```bash
cd spotify-microservices

# Build all services
mvn clean compile -f spotify-user-service/pom.xml
mvn clean compile -f spotify-auth-service/pom.xml
# ... repeat for other services

# Run tests
mvn test -f spotify-user-service/pom.xml

# Create Docker images
mvn spring-boot:build-image -f spotify-user-service/pom.xml
```

### Code Style Guidelines

- **Frontend**: ESLint configuration in `eslint.config.js`
- **Backend**: Standard Java conventions with Spring Boot best practices
- **Commits**: Use conventional commit format (`feat:`, `fix:`, `docs:`, etc.)

### Adding New Features

1. **Frontend**: Add components in `src/app/features/`
2. **Backend**: Create new microservices or extend existing ones
3. **Database**: Update migrations and models
4. **API**: Update Postman collections
5. **Documentation**: Update this README

## 🐳 Docker Deployment

### Build Images

```bash
cd spotify-microservices

# Build all service images
docker compose build

# Or build individual services
docker build -t spotify-user-service ./spotify-user-service
```

### Environment Configuration

For different environments, copy and modify the docker-compose file:

```bash
cp docker-compose.yaml docker-compose.prod.yaml
# Edit production configurations
```

### Monitoring

Check service health and logs:

```bash
# View all service logs
docker compose logs -f

# View specific service logs
docker compose logs -f user-service

# Check service status
docker compose ps

# Scale services
docker compose up -d --scale user-service=3
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Write clean, well-documented code
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Test your changes thoroughly before submitting

### Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, etc.)
- Relevant logs or screenshots

## ❓ Troubleshooting

### Common Issues

#### Frontend Issues

**Port 4300 already in use**:
```bash
# Find and kill process using port 4300
lsof -ti:4300 | xargs kill -9
# Or use different port
ng serve --port 4301
```

**Dependencies not installing**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Environment configuration errors**:
```bash
# Ensure all required environment URLs are configured
# Check src/environments/environment.ts and environment.prod.ts
# Add missing API URLs:
# - aiApiUrl: for AI chat service
# - musicApiUrl: for music service  
# - wishlistApiUrl: for wishlist service
```

#### Backend Issues

**Service not registering with Eureka**:
- Verify Eureka server is running on port 8761
- Check network connectivity between services
- Verify `EUREKA_DEFAULT_ZONE_URL` environment variable

**Database connection issues**:
```bash
# Check if database containers are running
docker compose ps mysql mongodb redis

# View database logs
docker compose logs mysql
```

**Port conflicts**:
- Verify no other services are using required ports
- Update port mappings in `docker-compose.yaml` if needed

#### Docker Issues

**Build failures**:
```bash
# Clean Docker system
docker system prune -a

# Rebuild without cache
docker compose build --no-cache
```

**Memory issues**:
- Increase Docker Desktop memory allocation
- Add resource limits to `docker-compose.yaml`

### Getting Help

1. Check existing [GitHub Issues](https://github.com/shreyas957/spotify-clone/issues)
2. Review this troubleshooting section
3. Check service logs for specific error messages
4. Create a new issue with detailed information

### Logs and Debugging

```bash
# View all service logs
docker compose logs -f

# View specific service logs  
docker compose logs -f [service-name]

# Check service health
curl http://localhost:8001/actuator/health

# Monitor Eureka dashboard
open http://localhost:8761
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- **Spotify Web API** for music streaming capabilities
- **Spring Boot** and **Angular** communities for excellent frameworks
- **Docker** for containerization platform
- **Google Gemini AI** and **Ollama** for AI capabilities

---

## 📞 Contact & Support

- **Repository**: [shreyas957/spotify-clone](https://github.com/shreyas957/spotify-clone)
- **Issues**: [GitHub Issues](https://github.com/shreyas957/spotify-clone/issues)
- **Discussions**: [GitHub Discussions](https://github.com/shreyas957/spotify-clone/discussions)

---

<div align="center">
  <p>⭐ If you found this project helpful, please give it a star!</p>
  <p>Made with ❤️ by the Spotify Clone community</p>
</div>