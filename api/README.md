# NestJS API

Backend API for Ubuntu Network platform.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the `api/` directory:
   ```env
   # Server
   PORT=3000
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19000

   # Twilio (South Africa SMS)
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+27xxxxxxxxx
   ```

3. **Run development server:**
   ```bash
   npm run start:dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/request-otp` - Request OTP for phone verification
- `POST /api/auth/verify-otp` - Verify OTP and get auth token

## Architecture

Built with NestJS following:
- **SOLID principles** - each module has single responsibility
- **DRY** - reusable services and utilities
- **Clean code** - typed, documented, testable
- **OOP** - dependency injection, interfaces, abstract classes

## Next Steps

- [ ] Connect to PostgreSQL database
- [ ] Implement JWT authentication
- [ ] Add photo verification endpoints
- [ ] Implement vouching system
- [ ] Add activity management endpoints
