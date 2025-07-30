# GitHub Actions Workflows

This repository uses GitHub Actions for automated code quality checks and deployment.

## Workflows

### 1. Code Quality & Tests (`.github/workflows/lint.yml`)

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch

**Jobs:**
- **Backend Lint & Test**: Runs ESLint, Prettier, and tests for the backend
- **Frontend Lint & Test**: Runs ESLint, Prettier, tests, and builds the frontend
- **Quality Gate**: Ensures all quality checks pass

**What it checks:**
- ✅ Code linting (ESLint)
- ✅ Code formatting (Prettier)
- ✅ Unit tests
- ✅ Build process
- ✅ Test coverage

### 2. Deploy (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Jobs:**
- **Deploy to Production**: Builds and deploys the application

## Local Development Commands

### Backend
```bash
cd backend

# Install dependencies
npm install

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Check code formatting
npm run format:check

# Format code
npm run format

# Start development server
npm run dev
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Check code formatting
npm run format:check

# Format code
npm run format

# Run tests
npm test

# Build for production
npm run build

# Start development server
npm start
```

## Code Quality Standards

### ESLint Rules
- No unused variables (except those prefixed with `_`)
- Prefer `const` over `let/var`
- Use template literals instead of string concatenation
- Single quotes for strings
- Semicolons required
- 2-space indentation

### Prettier Formatting
- Single quotes
- Semicolons
- 2-space indentation
- Trailing commas in multiline structures
- Line length: 80 characters

## Status Badges

Add these to your main README.md:

```markdown
![Code Quality](https://github.com/umesh-khatiwada/Task-Manager-application/workflows/Code%20Quality%20&%20Tests/badge.svg)
![Deploy](https://github.com/umesh-khatiwada/Task-Manager-application/workflows/Deploy/badge.svg)
```

## Pre-commit Hooks (Optional)

Consider setting up pre-commit hooks to run linting locally:

```bash
# Install husky
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run format:check"
```
