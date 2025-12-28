# React Native Mobile App

Bare React Native application for Ubuntu Network.

## Setup

### Prerequisites

1. **Node.js** (v18+)
2. **React Native development environment**
   - Follow the official guide: https://reactnative.dev/docs/environment-setup
   - Choose "React Native CLI Quickstart" (not Expo)
   - Select your OS and target platform (Android/iOS)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **iOS Setup (macOS only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

### Running the App

#### Android

```bash
npm run android
```

#### iOS (macOS only)

```bash
npm run ios
```

### Configuration

Update the API URL in [src/services/api/apiClient.ts](src/services/api/apiClient.ts):

```typescript
const API_BASE_URL = 'http://your-api-url:3000/api';
```

For Android emulator, use:
- `http://10.0.2.2:3000/api` (Android emulator accessing localhost)

For iOS simulator, use:
- `http://localhost:3000/api`

## Features Implemented

- ✅ Welcome screen
- ✅ Phone number input and formatting
- ✅ OTP request flow
- ✅ OTP verification screen
- ✅ API integration

## Next Steps

- [ ] Implement secure token storage
- [ ] Add photo verification flow
- [ ] Build user profile screens
- [ ] Implement vouching UI
- [ ] Add activity management screens
- [ ] Integrate Signal Protocol for E2E messaging

## Architecture

Following clean architecture principles:
- **Screens** - UI components (presentation layer)
- **Services** - API clients and business logic
- **Navigation** - React Navigation setup
- **Types** - TypeScript interfaces and types
