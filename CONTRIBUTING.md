# Contributing to Spotify Clone

Thank you for your interest in contributing to the Spotify Clone project! We welcome contributions from developers of all skill levels.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Issue Guidelines](#issue-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project adheres to a Code of Conduct that we expect all contributors to follow. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/spotify-clone.git
   cd spotify-clone
   ```
3. **Add the original repository** as upstream:
   ```bash
   git remote add upstream https://github.com/shreyas957/spotify-clone.git
   ```
4. **Set up the development environment** following the [README setup instructions](README.md#-quick-start)

## Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create and checkout feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

Before submitting, ensure all tests pass:

```bash
# Frontend tests
cd spotify-angular-frontend
npm run lint
npm run build

# Backend tests
cd spotify-microservices
mvn test -f spotify-user-service/pom.xml
# Test other services as needed

# Integration tests with Docker
docker compose up -d
# Test the application manually
```

### 4. Commit Your Changes

Use conventional commit messages:

```bash
git add .
git commit -m "feat: add music search functionality"

# Other examples:
# git commit -m "fix: resolve authentication bug"
# git commit -m "docs: update API documentation"
# git commit -m "test: add unit tests for user service"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Project Structure

### Frontend (Angular)
```
spotify-angular-frontend/
├── src/
│   ├── app/
│   │   ├── features/           # Feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── music/         # Music features
│   │   │   ├── profile/       # User profile
│   │   │   └── wishlist/      # Wishlist management
│   │   ├── shared/            # Shared components
│   │   └── core/              # Core services
│   ├── assets/                # Static assets
│   └── environments/          # Environment configs
```

### Backend (Spring Boot)
```
spotify-microservices/
├── spotify-config-server/      # Configuration service
├── spotify-eureka-server/      # Service discovery
├── spotify-api-gateway/        # API Gateway
├── spotify-auth-service/       # Authentication service
├── spotify-user-service/       # User management
├── spotify-music-service/      # Music operations
├── spotify-wishlist-service/   # Wishlist management
└── spotify-ai-chat-server/     # AI chat service
```

## Coding Standards

### Frontend (Angular/TypeScript)

- **ESLint**: Follow the ESLint configuration in `eslint.config.js`
- **Formatting**: Use Prettier for consistent formatting
- **Naming Conventions**:
  - Components: PascalCase (`UserProfileComponent`)
  - Services: PascalCase with Service suffix (`AuthService`)
  - Variables/Methods: camelCase (`getUserProfile`)
  - Constants: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

### Backend (Java/Spring Boot)

- **Java Style**: Follow Google Java Style Guide
- **Naming Conventions**:
  - Classes: PascalCase (`UserService`)
  - Methods: camelCase (`findUserById`)
  - Constants: UPPER_SNAKE_CASE (`DEFAULT_PAGE_SIZE`)
- **Annotations**: Use Spring Boot annotations appropriately
- **Documentation**: Add JavaDoc for public methods

### General Guidelines

- Write self-documenting code with meaningful names
- Keep methods and classes focused (Single Responsibility Principle)
- Use dependency injection where appropriate
- Handle errors gracefully with proper exception handling
- Write unit and integration tests for new functionality

## Testing Guidelines

### Frontend Testing

```bash
cd spotify-angular-frontend

# Run unit tests (when available)
npm run test

# Run e2e tests (when available)  
npm run e2e

# Lint code
npm run lint
```

### Backend Testing

```bash
cd spotify-microservices

# Run unit tests for a service
mvn test -f spotify-user-service/pom.xml

# Run integration tests
mvn verify -f spotify-user-service/pom.xml
```

### Test Coverage

- Aim for at least 70% test coverage for new code
- Write both unit tests and integration tests
- Test happy paths and error scenarios
- Mock external dependencies in unit tests

## Submitting Changes

### Before Submitting

- [ ] Code follows project coding standards
- [ ] All tests pass locally
- [ ] Changes are well documented
- [ ] Commit messages follow conventional format
- [ ] No merge conflicts with main branch
- [ ] Changes are focused and atomic

### Pull Request Checklist

- [ ] Descriptive title and clear description
- [ ] References relevant issues (if any)
- [ ] Screenshots for UI changes
- [ ] Updated documentation (if needed)
- [ ] Tests added for new functionality
- [ ] Backwards compatibility considered

## Issue Guidelines

### Reporting Bugs

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (OS, browser, Node/Java versions)
- **Screenshots or logs** (if applicable)
- **Minimal reproduction case** (if possible)

### Feature Requests

For feature requests, provide:

- **Clear description** of the proposed feature
- **Use case** and business justification
- **Proposed implementation** (if you have ideas)
- **Alternatives considered**
- **Additional context** or mockups

### Issue Labels

We use labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `frontend` - Frontend-related issue
- `backend` - Backend-related issue

## Pull Request Process

### 1. Review Process

- Maintainers will review PRs within 48-72 hours
- Address feedback promptly and professionally
- Be prepared to make changes based on review comments
- Keep discussions focused and constructive

### 2. Merge Requirements

- At least one approving review from a maintainer
- All CI checks must pass
- No merge conflicts
- Branch should be up to date with main

### 3. After Merge

- Your branch will be deleted automatically
- Update your local repository:
  ```bash
  git checkout main
  git pull upstream main
  git branch -d feature/your-feature-name
  ```

## Development Environment Setup

### Prerequisites

Ensure you have the required tools:

- **Node.js** (v18+)
- **Java** (JDK 17+)
- **Maven** (v3.6+)
- **Docker** & **Docker Compose** (v20+)
- **Git**

### IDE Recommendations

- **Frontend**: VS Code with Angular Language Service
- **Backend**: IntelliJ IDEA or Eclipse with Spring Tools

### Useful Extensions/Plugins

**VS Code Extensions:**
- Angular Language Service
- ESLint
- Prettier
- GitLens
- Thunder Client (for API testing)

**IntelliJ IDEA Plugins:**
- Spring Boot
- Docker
- Database Navigator

## Getting Help

If you need help with contributing:

1. **Check existing issues** and documentation
2. **Ask questions** in GitHub Discussions
3. **Join our community** (if applicable)
4. **Contact maintainers** via GitHub issues

## Recognition

Contributors will be recognized in:

- The project's contributor list
- Release notes for significant contributions
- Special recognition for first-time contributors

---

Thank you for contributing to Spotify Clone! Your efforts help make this project better for everyone. 🎵