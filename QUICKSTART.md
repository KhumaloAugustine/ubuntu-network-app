# Ubuntu Network - Setup & Quick Start

## ✅ Setup Complete

Your development environment is ready! Here's what was configured:

### Installed
- ✅ Node.js v24.12.0
- ✅ npm v11.6.2
- ✅ API dependencies (NestJS, Twilio, TypeORM, etc.)
- ✅ `.env` file created in `api/`

### Running
- ✅ API server at **http://localhost:3000/api**
- ✅ OTP authentication endpoints functional

---

## Quick Start

### 1. Start the API Server

```powershell
cd api
npm run start:dev
```

The server will start at `http://localhost:3000/api`.

**Note:** In development mode without real Twilio credentials, OTPs are logged to the console instead of being sent via SMS.

### 2. Configure Twilio (Optional but Recommended)

To send real SMS messages:

1. Sign up at [twilio.com](https://www.twilio.com)
2. Get a South African phone number (+27)
3. Copy your credentials to `api/.env`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+27XXXXXXXXX
```

4. Restart the server

### 3. Test OTP Flow

#### Request OTP:
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/auth/request-otp `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"phone":"+27821234567"}'
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "phone": "+27821234567"
}
```

**Check the server console** for the debug OTP (6 digits), e.g.:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 DEBUG MODE - OTP for +27821234567
🔑 OTP: 456789
⚠️  Configure TWILIO_* env vars for real SMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Verify OTP:
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/auth/verify-otp `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"phone":"+27821234567","otp":"456789"}'
```

**Response:**
```json
{
  "success": true,
  "token": "demo-token-xxxx-xxxx-xxxx-xxxx",
  "user": {
    "userId": "uuid",
    "phone": "+27821234567"
  }
}
```

---

## Mobile App Setup

### Prerequisites

1. **Android Studio** (for Android development)
   - Download: https://developer.android.com/studio
   - Install Android SDK and emulator

2. **Xcode** (for iOS development, macOS only)
   - Download from Mac App Store
   - Install iOS Simulator

3. **React Native environment setup**
   - Follow: https://reactnative.dev/docs/environment-setup
   - Choose "React Native CLI Quickstart"

### Install & Run

```powershell
cd mobile
npm install

# For Android
npm run android

# For iOS (macOS only)
cd ios
pod install
cd ..
npm run ios
```

### Configure API URL

Update `mobile/src/services/api/apiClient.ts`:

- For **Android emulator**: `http://10.0.2.2:3000/api`
- For **iOS simulator**: `http://localhost:3000/api`
- For **physical device**: `http://YOUR_IP:3000/api`

---

## Project Structure

```
ubuntu-network-app/
├── api/                      # NestJS backend
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   │   ├── services/    # OTP, SMS services
│   │   │   ├── dto/         # Data transfer objects
│   │   │   └── *.ts         # Controllers, modules
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env                 # Environment variables
│   └── package.json
├── mobile/                   # React Native app
│   ├── src/
│   │   ├── screens/         # UI screens
│   │   └── services/        # API clients
│   ├── App.tsx
│   └── package.json
├── docs/                     # Documentation
│   ├── ARCHITECTURE.md
│   └── DATABASE.md
└── README.md
```

---

## Development Workflow

### API Development

1. Make changes to `api/src/**/*.ts`
2. Server auto-restarts via `ts-node-dev`
3. Test endpoints with Postman or PowerShell

### Mobile Development

1. Make changes to `mobile/src/**/*.tsx`
2. Hot reload updates the app instantly
3. Use React Native Debugger for debugging

---

## What's Next?

### Immediate Next Steps

1. ✅ **API is running** - OTP flow works
2. 🔄 **Add PostgreSQL** - persistent user storage
3. 🔄 **Photo verification** - camera + upload
4. 🔄 **Vouching system** - community verification
5. 🔄 **Activity management** - request/approval flow

### Planned Features

- Guardian dashboard (web)
- GPS monitoring
- Panic button
- Signal Protocol E2E messaging
- Pattern detection
- Community reporting

---

## Troubleshooting

### API server won't start

```powershell
# Kill existing node processes
Stop-Process -Name node -Force

# Restart
cd api
npm run start:dev
```

### Port 3000 already in use

```powershell
# Find process using port 3000
Get-NetTCPConnection -LocalPort 3000

# Kill it
Stop-Process -Id <PID> -Force

# Or change port in api/.env
PORT=3001
```

### Mobile app can't connect to API

- Android emulator: use `http://10.0.2.2:3000/api`
- iOS simulator: use `http://localhost:3000/api`
- Physical device: ensure phone & computer on same WiFi, use computer's IP

### Dependencies issues

```powershell
# Clear caches and reinstall
cd api
Remove-Item -Recurse -Force node_modules
npm install

cd ../mobile
Remove-Item -Recurse -Force node_modules
npm install
```

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Native Documentation](https://reactnative.dev/)
- [Twilio SMS API](https://www.twilio.com/docs/sms)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Need Help?

- Check [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Open an issue on GitHub
- Review API logs in the server console

---

**Built with ❤️ following SOLID, DRY, and clean code principles.**
