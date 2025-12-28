# Ubuntu Network - Architecture & Design

## System Overview

**Ubuntu Network** is a Safety-First Community Connection Platform that enables verified community members to connect, share skills, and support each other through a multi-tiered verification and oversight system.

### Core Principle
> "Trust is built, not assumed." - Every connection goes through community verification. Safety is our highest priority.

## Technology Stack

### Mobile Application
- **Framework:** React Native (Bare workflow)
- **Language:** TypeScript
- **Navigation:** React Navigation
- **State Management:** React Context (planned: Redux or Zustand)
- **HTTP Client:** Axios
- **Security:** 
  - Local encrypted storage (SQLCipher - planned)
  - Signal Protocol for E2E messaging (planned)

### Backend API
- **Framework:** NestJS
- **Language:** TypeScript
- **Architecture:** Modular, microservices-ready
- **Database:** PostgreSQL (planned)
- **Caching:** Redis (planned)
- **SMS:** Twilio (South Africa +27)
- **Authentication:** JWT with device binding (planned)

### Infrastructure
- **CI/CD:** GitHub Actions
- **Hosting:** Cloud-agnostic (GCP/AWS/Azure ready)
- **Monitoring:** Prometheus + Grafana (planned)
- **Logging:** Structured logging with audit trails

## Core Principles

### 1. SOLID Principles
- **Single Responsibility:** Each module, service, and class has one well-defined purpose
- **Open/Closed:** Extensible without modifying existing code
- **Liskov Substitution:** Interfaces are substitutable
- **Interface Segregation:** No client depends on methods it doesn't use
- **Dependency Inversion:** Depend on abstractions, not concretions

### 2. DRY (Don't Repeat Yourself)
- Reusable services and utilities
- Shared types and interfaces
- Common validation logic

### 3. Clean Code
- Self-documenting code with clear naming
- Comprehensive documentation
- Type safety with TypeScript
- Unit and integration tests

## Security Architecture

### Four-Layer Protection System

#### Layer 1: Verification Wall
1. Phone number verification (SMS OTP)
2. Photo verification with daily code
3. Community vouching system (3 vouches from Tier 3+ users)
4. Background declaration review

#### Layer 2: Activity Safeguards
- Dual approval for youth interactions (parent + guardian)
- "Three-Eyes" rule (no one-on-one with minors)
- Safe zone enforcement
- Time-boxed sessions
- GPS check-in/check-out

#### Layer 3: Real-Time Monitoring
- Session GPS tracking
- Panic button
- Regular check-in prompts
- Communication logging
- Pattern detection

#### Layer 4: Community Oversight
- Monthly safety reviews
- Annual re-verification
- Transparent reporting
- Community Guardian powers

## User Tier System

### Tier 1: Basic User (Green)
- SMS verification only
- Can browse and request services
- Cannot offer services

### Tier 2: Verified Helper (Blue)
- 3 Tier 3 vouches + ID verification
- Can offer services
- Cannot work with minors alone

### Tier 3: Trusted Mentor (Gold)
- Community Council interview + background check
- Can work with youth (with oversight)
- Can vouch for others

### Tier 4: Community Guardian (Purple)
- Elected by community
- Can pause activities
- Safety oversight authority

## Data Security

### Encryption
- **PII:** AES-256 encryption
- **Messages:** End-to-end encryption (Signal Protocol)
- **Storage:** Encrypted database columns
- **Transport:** TLS 1.3

### Authentication
- Two-factor: Phone + PIN
- Device binding
- Session timeout (15 minutes)
- Token rotation

### Audit Logging
- Immutable logs (append-only)
- Every action logged with user, timestamp, location
- 7-year retention for safety incidents
- Access controls for log viewing

## Next Steps

### Phase 1: Foundation (Completed)
- ✅ Project scaffold
- ✅ SMS authentication flow
- ✅ Basic mobile UI

### Phase 2: Core Features (In Progress)
- [ ] PostgreSQL database integration
- [ ] User profile management
- [ ] Photo verification system
- [ ] Vouching system
- [ ] Safe locations database

### Phase 3: Expansion (Planned)
- [ ] Activity request/approval flow
- [ ] GPS monitoring
- [ ] Panic button implementation
- [ ] Signal Protocol integration
- [ ] Guardian dashboard
- [ ] Pattern detection
- [ ] Community reporting

## References

- [System Design Document](../README.md)
- [API Documentation](../api/README.md)
- [Mobile App Documentation](../mobile/README.md)
- [Signal Protocol](https://signal.org/docs/)
- [Twilio SMS API](https://www.twilio.com/docs/sms)
