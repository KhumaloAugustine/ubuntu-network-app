# Ubuntu Network — Digital Community Safety Platform

A safety-first community connection platform built with React Native (mobile) and NestJS (backend). This monorepo follows clean code principles: OOP, SOLID, DRY, and maintainability.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- For mobile: Android Studio / Xcode
- For API: PostgreSQL

### Installation

```bash
# Clone the repository
git clone git@github.com:KhumaloAugustine/ubuntu-network-app.git
cd ubuntu-network-app

# Install dependencies (npm workspaces)
npm install

# API: Start development server
cd api && npm run start:dev

# Mobile: Follow React Native setup (separate terminal)
cd mobile && npm start
```

## Project Structure

```
ubuntu-network-app/
├── api/                  # NestJS backend
│   ├── src/
│   │   ├── common/       # Shared utilities, DTOs, guards, interceptors
│   │   ├── auth/         # Authentication module
│   │   ├── users/        # Users module
│   │   ├── activities/   # Activities/sessions module
│   │   ├── vouch/        # Vouching system
│   │   ├── locations/    # Safe locations
│   │   ├── database/     # DB configuration, migrations
│   │   └── main.ts
│   └── package.json
├── mobile/               # React Native (bare)
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   ├── navigation/
│   │   ├── utils/
│   │   └── App.tsx
│   └── package.json
├── docs/                 # Architecture, design decisions
├── infra/                # Infrastructure, env examples
└── package.json          # Root workspace config
```

## Architecture Principles

### SOLID Principles Applied
- **S**ingle Responsibility: Each module/class has one reason to change
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Implementations are substitutable
- **I**nterface Segregation: Small, focused interfaces
- **D**ependency Inversion: Depend on abstractions, not concretions

### DRY (Don't Repeat Yourself)
- Shared logic in `common/` directory
- Reusable services and utilities
- Configuration centralization

### Clean Code
- Clear naming conventions
- Small, focused functions
- Comprehensive error handling
- Type safety (TypeScript strict mode)

## Development Workflow

### API Development
```bash
cd api
npm run start:dev     # Hot reload
npm run build         # Production build
npm run test          # Run tests
npm run lint          # ESLint
```

### Mobile Development
```bash
cd mobile
npm start             # Metro bundler
npm run android       # Android device/emulator
npm run ios          # iOS device/simulator
```

## Security

- AES-256 encryption for PII
- End-to-End messaging (Signal Protocol)
- Device binding
- Role-Based Access Control (RBAC)
- Audit logging
- Environment variable protection

## Configuration

Create `.env` files in `api/` and `infra/`:
- `infra/twilio.example.env` → Fill with Twilio credentials
- API `.env` for database, JWT secrets, etc.

## License

MIT License © 2025 KhumaloAugustine

## Contact

For issues, questions: Augustine Khumalo
