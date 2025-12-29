# Ubuntu Network - API

NestJS backend for Ubuntu Network community safety platform.

## Architecture Highlights

- **Clean Code**: SOLID principles, DRY, type-safe TypeScript
- **Layered**: Presentation → Business Logic → Data Access → Infrastructure
- **Modular**: Feature-based structure with clear separation of concerns
- **Secure**: AES-256 encryption, JWT auth, comprehensive audit logging
- **Testable**: Dependency injection, mockable services, unit & integration tests

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Set up database
npm run typeorm:migration:generate -- -n Initial
npm run typeorm:migration:run

# Start development server
npm run start:dev
```

### API Health Check

```bash
curl http://localhost:3000/api/v1/health
```

## Project Structure

```
src/
├── auth/              # Authentication (OTP, JWT)
│   ├── dto/          # Data transfer objects
│   ├── services/     # Auth business logic
│   └── strategies/   # Passport strategies
├── users/             # User management
├── activities/        # Activity/session management
├── vouch/            # Vouching system
├── locations/        # Safe locations
├── database/         # TypeORM setup, entities
├── common/           # Shared utilities
│   ├── dtos/        # Common DTOs
│   ├── exceptions/  # Custom exceptions
│   ├── filters/     # Global error handling
│   ├── guards/      # Auth guards
│   ├── interceptors/ # Request/response processing
│   └── utils/       # Utility functions
├── app.module.ts     # Root module
└── main.ts          # Entry point
```

## Key Features

### Authentication
- SMS OTP verification (Twilio)
- JWT token generation
- Device binding
- Automatic token refresh

### SOLID Principles
- **SRP**: Each service has one responsibility
- **OCP**: Open for extension, closed for modification
- **LSP**: Implementations are substitutable
- **ISP**: Small, focused interfaces
- **DIP**: Depend on abstractions, not concretions

### Error Handling
Hierarchical exception system with detailed error codes:
```
BaseException
├── ValidationException (400)
├── AuthenticationException (401)
├── AuthorizationException (403)
├── NotFoundException (404)
├── ConflictException (409)
└── InternalServerException (500)
```

### Utilities
- **Encryption**: AES-256-GCM for PII
- **Phone**: South African number validation & formatting
- **GPS**: Distance calculation, radius validation

## API Endpoints

### Authentication
- `POST /api/v1/auth/request-otp` - Request OTP via SMS
- `POST /api/v1/auth/verify-otp` - Verify OTP and get JWT

### Users
- `GET /api/v1/users/:id` - Get user profile
- `PUT /api/v1/users/:id` - Update profile (protected)

### (Coming soon)
- Activities management
- Vouching system
- Safe locations
- Safety dashboard

## Scripts

```bash
npm run start:dev    # Development server with hot reload
npm run build        # Production build
npm run lint         # ESLint
npm run format       # Prettier
npm run test         # Jest unit tests
npm run test:cov     # Coverage report
```

## Configuration

Create `.env` file (copy from `.env.example`):

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=ubuntu_network

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+27xxxxxxxxx

# Application
NODE_ENV=development
PORT=3000
```

## Security Notes

- All PII encrypted at application layer
- JWT tokens device-bound
- Audit logging for all operations
- Rate limiting on sensitive endpoints
- CORS configured per environment
- Input validation with class-validator
- SQL injection prevention via TypeORM ORM

## Testing

```bash
# Run unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### Environment Variables

Production `.env` should include:
- Secure DB credentials
- Strong JWT_SECRET
- Production Twilio credentials
- NODE_ENV=production
- CORS_ORIGIN for frontend domain

## Contributing

1. Follow SOLID principles
2. Write unit tests for new features
3. Keep services focused (SRP)
4. Use dependency injection
5. Validate all inputs
6. Document complex logic

## License

MIT

## Support

For issues or questions, open a GitHub issue or contact the team.
