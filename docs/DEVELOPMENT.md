# Development Environment Setup

Complete guide to set up Ubuntu Network development environment.

## System Requirements

### All Platforms
- Node.js 18.x or later
- npm 9.x or later
- Git
- Code editor (VS Code recommended)

### macOS (iOS development)
- Xcode 14+ (from App Store)
- Xcode Command Line Tools: `xcode-select --install`
- CocoaPods: `sudo gem install cocoapods`

### Windows (Android development)
- Android Studio
- Java Development Kit (JDK) 11 or 17
- Environment variables properly set

### Linux (Android development)
- Android SDK
- Java Development Kit (JDK) 11 or 17

## Quick Start (All Platforms)

### 1. Clone Repository
```bash
git clone git@github.com:KhumaloAugustine/ubuntu-network-app.git
cd ubuntu-network-app
```

### 2. Install Root Dependencies
```bash
npm install
```

### 3. Backend Setup
```bash
cd api

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
nano .env  # or use your editor
```

### 4. Database Setup

#### Using PostgreSQL locally
```bash
# macOS (Homebrew)
brew install postgresql@15
brew services start postgresql@15
createdb ubuntu_network
psql ubuntu_network

# Linux (apt)
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb ubuntu_network

# Windows (download installer)
# https://www.postgresql.org/download/windows/
# Use pgAdmin to create database
```

#### Using Docker (Recommended)
```bash
# Start PostgreSQL container
docker run -d \
  --name ubuntu-network-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ubuntu_network \
  -p 5432:5432 \
  postgres:15
```

### 5. Verify API Setup
```bash
cd api
npm run start:dev

# In another terminal
curl http://localhost:3000/api/v1/health
# Should return: { "status": "ok", ... }
```

### 6. Mobile Setup

#### Common (All Platforms)
```bash
cd ../mobile
npm install

# Verify installation
npm run type-check
npm run lint
```

#### macOS & iOS
```bash
# Install CocoaPods dependencies
cd ios
pod install
cd ..

# Start Metro bundler
npm start

# In another terminal, run iOS
npm run ios
```

#### Windows/Linux & Android
```bash
# Set environment variables
# Windows (PowerShell):
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH = "C:\Program Files\Java\jdk-17\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"

# Linux/macOS (bash):
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH

# Start Metro bundler
npm start

# In another terminal, run Android
npm run android
```

## Environment Configuration

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ubuntu_network

# JWT
JWT_SECRET=dev-secret-change-in-production
JWT_EXPIRES_IN=7d

# Twilio (optional for dev)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+27xxxxxxxxx

# Application
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:8081,http://localhost:3000

# Security
ENCRYPTION_KEY=dev-encryption-key-32-bytes-long-minimum
```

### API Base URL (.env or config)
Mobile app needs to know API endpoint:

**Development:**
```
API_BASE_URL=http://localhost:3000/api/v1  (Android emulator)
API_BASE_URL=http://10.0.2.2:3000/api/v1   (Genymotion)
API_BASE_URL=http://localhost:3000/api/v1  (Physical device on same network)
```

**Staging/Production:**
```
API_BASE_URL=https://api.staging.ubuntu-network.com/api/v1
API_BASE_URL=https://api.ubuntu-network.com/api/v1
```

## IDE Setup (VS Code)

### Recommended Extensions
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatter
- **Thunder Client** or **REST Client** - API testing
- **TypeScript Vue Plugin** - TypeScript support
- **React Native Tools** - RN debugging
- **ES7+ React/Redux/React-Native snippets** - Code snippets

### Workspace Settings (.vscode/settings.json)
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Launch Configurations (.vscode/launch.json)
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "API Debug",
      "program": "${workspaceFolder}/api/src/main.ts",
      "preLaunchTask": "tsc: build - api",
      "outFiles": ["${workspaceFolder}/api/dist/**/*.js"]
    }
  ]
}
```

## Common Development Tasks

### Start All Services
```bash
# Terminal 1: API
cd api && npm run start:dev

# Terminal 2: Metro bundler
cd mobile && npm start

# Terminal 3: Run app
cd mobile && npm run android
# or
npm run ios
```

### Code Quality Checks
```bash
# Lint
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# Run tests
npm run test

# With coverage
npm run test:cov
```

### Database Operations
```bash
# View database
psql -U postgres -d ubuntu_network

# List tables
\dt

# Backup database
pg_dump -U postgres ubuntu_network > backup.sql

# Restore database
psql -U postgres ubuntu_network < backup.sql
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/my-feature

# Commit with message
git commit -m "feat(auth): add SMS OTP verification"

# Push to GitHub
git push origin feature/my-feature

# Create pull request on GitHub
```

## Debugging

### Backend (Node.js)
```bash
# Start with debugger
node --inspect-brk api/dist/main.js

# Chrome DevTools: chrome://inspect
```

### Mobile (React Native)
```bash
# Open debugger menu
# iOS: Cmd+D
# Android: Cmd+M (macOS) or Ctrl+M (Windows/Linux)

# Select "Debug JS Remotely"
# Browser DevTools will open at http://localhost:8081/debugger-ui
```

### API Testing
Use Thunder Client (built into VS Code):
```
POST http://localhost:3000/api/v1/auth/request-otp
Content-Type: application/json

{
  "phone": "0821234567"
}
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process
# macOS/Linux
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
lsof -i :8081 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### npm Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
# macOS: brew services list
# Linux: sudo systemctl status postgresql
# Windows: Services -> PostgreSQL

# Verify credentials in .env
# Verify database exists
psql -U postgres -l
```

### TypeScript Errors
```bash
# Rebuild TypeScript
npm run build

# Check configuration
cat tsconfig.json

# Verify all imports use correct paths
```

### React Native Module not Found
```bash
# Reset cache and reinstall
npm start -- --reset-cache

# Clear watchman (macOS)
watchman watch-del-all

# Rebuild native code
cd android && ./gradlew clean && cd ..
npm run android
```

## Performance Tips

- Use React DevTools Profiler
- Enable Metro bundler debug mode
- Use `React.memo()` for expensive components
- Optimize images (use webp format)
- Lazy load screens with `React.lazy()`

## Security Setup

### Pre-commit Hooks
```bash
# Install husky
npm install husky --save-dev
npx husky install

# Create hook
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
```

### Secrets Management
- Never commit `.env` files
- Use `.env.example` for templates
- In CI/CD, inject secrets via environment variables
- Use secret management services for production

## Next Steps

1. ✅ Set up environment
2. ✅ Start API: `cd api && npm run start:dev`
3. ✅ Start Mobile: `cd mobile && npm start && npm run android`
4. 📖 Read [CONTRIBUTING.md](./CONTRIBUTING.md)
5. 📖 Read [API README](./api/README.md)
6. 📖 Read [Mobile README](./mobile/README.md)
7. 🔍 Explore codebase and existing patterns
8. 💻 Start contributing!

## Getting Help

- Check existing GitHub issues
- Ask in GitHub discussions
- Read documentation files
- Contact maintainers for security issues

---

**You're all set! Happy coding! 🚀**
