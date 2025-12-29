# Architecture & Design

## System Overview

Ubuntu Network is a safety-first community platform built on a layered architecture:

```
┌─────────────────────────────────────────────────────────┐
│              Mobile (React Native)                       │
│  - SMS OTP Authentication                              │
│  - Photo Verification with Daily Codes                 │
│  - Activity Browsing & Requests                        │
│  - Real-time Session Monitoring                        │
│  - Panic Button & Emergency Alerts                     │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS + TLS
┌─────────────────────▼───────────────────────────────────┐
│              API Gateway & Auth                          │
│  - JWT Token Management                                │
│  - Rate Limiting                                       │
│  - Request Validation                                  │
└─────────────────────┬───────────────────────────────────┘
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
┌───▼───┐      ┌─────▼──────┐    ┌────▼─────┐
│Auth   │      │Core        │    │Real-time │
│Module │      │Services    │    │Service   │
└───────┘      └────────────┘    └──────────┘
    │                 │                 │
    └─────────────────┼─────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
    ┌───▼────┐   ┌───▼────┐   ┌───▼────┐
    │Database│   │Cache   │   │Storage │
    │(PG)    │   │(Redis) │   │(S3)    │
    └────────┘   └────────┘   └────────┘

```

## Layered Architecture

### 1. Presentation Layer (Mobile)
- React Native with bare workflow (maximum control)
- TypeScript strict mode
- Component-based UI architecture
- Service locator pattern for dependency injection

### 2. API Layer (NestJS)
- REST endpoints with OpenAPI documentation
- Authentication/Authorization middleware
- Input validation (class-validator)
- Error handling & exceptions
- Audit logging

### 3. Business Logic Layer
- Domain services (Auth, Activities, Vouching)
- Business rule enforcement
- Transaction management
- Pattern detection for safety

### 4. Data Access Layer
- Repository pattern for data abstraction
- Query builders for complex queries
- Database migrations
- Encryption for sensitive data

### 5. Infrastructure Layer
- Database (PostgreSQL)
- Cache (Redis)
- File storage (S3)
- External APIs (Twilio, Signal)
- Logging & monitoring

## SOLID Principles Implementation

### Single Responsibility Principle (SRP)
Each class has one reason to change:
```
❌ Bad: UserService handles auth, validation, and database
✅ Good:
   - AuthService: authentication logic
   - UserValidationService: validation rules
   - UserRepository: data access
```

### Open/Closed Principle (OCP)
Classes are open for extension, closed for modification:
```typescript
// Base strategy
interface OtpStrategy {
  sendOtp(phone: string, otp: string): Promise<void>;
}

// Extensions
class TwilioOtpStrategy implements OtpStrategy { }
class MockOtpStrategy implements OtpStrategy { }  // Testing
```

### Liskov Substitution Principle (LSP)
Subclasses must be substitutable for parent classes:
```typescript
interface Activity {
  start(): Promise<void>;
  end(): Promise<void>;
}

// All implementations must honor the contract
```

### Interface Segregation Principle (ISP)
Clients shouldn't depend on interfaces they don't use:
```typescript
// ❌ Fat interface
interface User {
  authenticate();
  createActivity();
  vouch();
  adminActions();
}

// ✅ Segregated interfaces
interface Authenticable { authenticate(); }
interface ActivityCreator { createActivity(); }
interface Vounder { vouch(); }
interface Administrator { adminActions(); }
```

### Dependency Inversion Principle (DIP)
Depend on abstractions, not concrete implementations:
```typescript
// ❌ Depends on concrete class
class AuthService {
  constructor(private otpService: TwilioOtpService) { }
}

// ✅ Depends on abstraction
class AuthService {
  constructor(private otpService: IOtpService) { }
}
```

## DRY (Don't Repeat Yourself) Patterns

### 1. Shared DTOs
```
common/dtos/
├── PaginationDTO.ts
├── ResponseDTO.ts
├── ErrorDTO.ts
└── TimestampedDTO.ts
```

### 2. Reusable Guards & Interceptors
```
common/guards/
├── JwtAuthGuard.ts
├── RoleGuard.ts
└── ThrottleGuard.ts

common/interceptors/
├── LoggingInterceptor.ts
├── TransformInterceptor.ts
└── ErrorInterceptor.ts
```

### 3. Base Classes
```typescript
// All entities inherit common fields
abstract class BaseEntity {
  id: UUID;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UUID;
}
```

### 4. Utility Functions
Centralized in `common/utils/`:
- Encryption/Decryption
- Phone number formatting
- GPS validation
- Date/time operations

## Database Design

### Core Entities
```
Users
├── Tier 1: Basic (browsing only)
├── Tier 2: Verified Helper
├── Tier 3: Trusted Mentor
└── Tier 4: Community Guardian

Activities
├── Request → Approval → Active → Completed
├── Location verification
├── Time-boxing enforcement
└── Participant tracking

Vouches
├── One-directional (A vouches for B)
├── Relationship metadata
└── Confidence scoring

SafeLocations
├── GPS coordinates
├── Verification status
├── Safety features
└── Operating hours
```

### Security Measures
- AES-256 encryption at application layer
- PII in separate encrypted columns
- Immutable audit logs
- Role-based access control (RBAC)
- Data retention policies

## Authentication & Authorization

### Authentication Flow
1. User requests OTP with phone number
2. Twilio sends SMS to South Africa +27 number
3. User verifies OTP within 5 minutes
4. Server creates JWT token (device-bound)
5. Subsequent requests include token in Authorization header

### Authorization Strategy
```
TIER 1 (Basic)
├── Browse public helpers
└── Browse public activities

TIER 2 (Verified Helper)
├── All TIER 1 permissions
├── Create activities/mentor listings
├── Receive vouch requests
└── Participate in non-youth activities

TIER 3 (Trusted Mentor)
├── All TIER 2 permissions
├── Work with youth (with dual approval)
├── Vouch for others
└── Approve activity requests

TIER 4 (Community Guardian)
├── All TIER 3 permissions
├── Pause suspicious activities
├── Approve safe locations
├── Access to flagged incidents
└── Safety council decision-making
```

## Error Handling Strategy

### Hierarchical Exception System
```
BaseException
├── ValidationException (400)
├── AuthenticationException (401)
├── AuthorizationException (403)
├── NotFoundException (404)
├── ConflictException (409)
└── InternalServerException (500)
```

### Error Response Format
```json
{
  "error": {
    "code": "AUTH_INVALID_OTP",
    "message": "OTP is invalid or expired",
    "timestamp": "2025-01-01T12:00:00Z",
    "traceId": "req-12345"
  }
}
```

## Testing Strategy

### Unit Tests
- Services & utilities (100% coverage)
- Business logic isolation
- Mocked external dependencies

### Integration Tests
- API endpoints with real DB
- Auth flow validation
- Data consistency

### E2E Tests
- Mobile app flows
- Full user journeys
- Safety mechanisms verification

## Security Considerations

### PII Protection
- Encrypt phone numbers, IDs, addresses
- Minimal data collection
- Secure key storage (KMS)
- Data retention policies

### Communication Security
- HTTPS/TLS for all API calls
- End-to-end encryption for sensitive messaging (Signal Protocol)
- Encrypted caching locally

### Access Control
- Principle of least privilege
- Role-based permissions
- Activity-based audit logging
- Regular security audits

## Monitoring & Observability

### Metrics
- API response times
- Error rates by endpoint
- Activity completion success rate
- OTP delivery success rate
- Session duration patterns

### Logging
- Structured JSON logs
- Correlation IDs for request tracing
- Sensitive data masking
- Centralized log aggregation

### Alerting
- High error rates
- OTP delivery failures
- Unusual access patterns
- Database performance issues

## Deployment Strategy

### Environments
- **Dev**: Local development with mocks
- **Staging**: Full integration testing
- **Production**: Secure, scaled deployment

### CI/CD Pipeline
- GitHub Actions
- Automated testing
- Code quality checks
- Security scanning
- Automated deployments

## Future Enhancements

1. **Machine Learning**
   - Pattern detection for safety risks
   - Skill matching algorithm
   - Community trust scoring

2. **Advanced Features**
   - Barter/trade system
   - Resource marketplace
   - Community event management
   - Mobile wallet integration

3. **Scaling**
   - Multi-community support
   - API federation
   - Microservices architecture
   - Global expansion support
