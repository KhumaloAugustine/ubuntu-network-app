# Ubuntu Network - Mobile App

React Native (bare workflow) mobile app for Ubuntu Network community safety platform.

## Architecture

The mobile app follows clean architecture principles:

```
src/
├── screens/           # UI screens (OTP, onboarding, home, activities, etc.)
├── components/        # Reusable UI components
├── services/          # Business logic & API calls
│   ├── api.service.ts # Centralized API client
│   └── storage.service.ts # Local storage management
├── utils/             # Utility functions
│   ├── phone.util.ts  # Phone formatting
│   ├── validation.util.ts # Input validation
│   └── device.util.ts # Device utilities
├── types/             # TypeScript type definitions
├── hooks/             # Custom React hooks
├── navigation/        # React Navigation setup
└── App.tsx           # Root component
```

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development)
- React Native CLI

### Installation

```bash
# Install dependencies
npm install

# Android setup
npm run android

# iOS setup (macOS only)
npm run ios

# Or start Metro bundler separately
npm start
```

### Project Structure Details

#### Screens
- **OnboardingScreen**: SMS OTP verification
- **PhotoVerificationScreen**: Camera + daily code verification
- **HomeScreen**: Main navigation hub
- **ActivitiesScreen**: Browse/manage activities
- **VouchScreen**: Community vouching system
- **ProfileScreen**: User profile & tier information

#### Services
- **ApiService**: Centralized axios client with interceptors
- **StorageService**: AsyncStorage wrapper for secure local storage
- **AuthService**: Authentication state management
- **LocationService**: GPS tracking & validation

#### Utils
- **PhoneUtil**: South African phone number formatting
- **ValidationUtil**: Input validation (OTP, email, etc.)
- **DeviceUtil**: Device ID generation & retrieval
- **EncryptionUtil**: Local data encryption

## Key Features

### 1. Authentication Flow
```
SMS OTP Request → Verify OTP → JWT Token → Store Locally → Auto-refresh
```

### 2. Photo Verification
```
Camera → Capture with Daily Code → Upload → Server Verification → Status
```

### 3. Real-time Monitoring
```
Activity Start → GPS Check-in → Periodic Check-ins → Activity End → GPS Check-out
```

### 4. Panic Button
```
Press Button → Immediate GPS → Alert Community Guardians → Auto-call Emergency Contacts
```

### 5. End-to-End Encrypted Messaging
- Uses libsignal (Signal Protocol)
- Keys stored in secure enclave / keystore
- Server has no access to plaintext

## Clean Code Principles Applied

### Single Responsibility Principle
- Each service has one reason to change
- Screens manage UI, services manage logic

### Dependency Injection
```typescript
// ❌ Bad: Direct dependency
const service = new ApiService();

// ✅ Good: Injected/singleton
import apiService from '@services/api.service';
```

### Interface Segregation
```typescript
// ✅ Small, focused interfaces
interface IAuthService {
  requestOtp(phone: string): Promise<void>;
  verifyOtp(phone: string, otp: string): Promise<AuthToken>;
}
```

### DRY (Don't Repeat Yourself)
- Utility functions for common operations
- Reusable components
- Custom hooks for logic sharing

### Type Safety
- Strict TypeScript configuration
- Complete type coverage
- Validated inputs

## API Integration

### Configuration

```typescript
// BaseURL configured for development
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Auto-adds JWT token to requests
// Handles 401 errors (token expiration)
```

### Making API Calls

```typescript
// Service-based
import apiService from '@services/api.service';

const result = await apiService.requestOtp('+27821234567');
const auth = await apiService.verifyOtp(phone, otp, deviceId);

// Or use hooks (preferred)
const { data, loading, error } = useAuth();
```

## Local Storage (Encrypted)

```typescript
import StorageService from '@services/storage.service';

// Store sensitive data encrypted
await StorageService.setSecure('authToken', token);
const token = await StorageService.getSecure('authToken');
```

## Testing

### Unit Tests

```bash
npm run test
npm run test:watch
```

### Type Checking

```bash
npm run type-check
```

## Development Workflow

### 1. Create a New Screen

```typescript
// src/screens/MyScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';

export function MyScreen() {
  return (
    <SafeAreaView>
      <Text>My Screen</Text>
    </SafeAreaView>
  );
}
```

### 2. Add a Service

```typescript
// src/services/my.service.ts
class MyService {
  async doSomething(): Promise<Result> {
    // Logic here
  }
}

export default new MyService();
```

### 3. Use Service in Component

```typescript
import myService from '@services/my.service';

function MyComponent() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    myService.doSomething().then(setResult);
  }, []);

  return <Text>{result}</Text>;
}
```

## Debugging

### Metro Bundler
```bash
npm start
```

### Chrome DevTools
- Press `Cmd+D` (macOS) or `Ctrl+M` (Android)
- Select "Debug JS Remotely"

### React Native Debugger
```bash
npm install -g react-native-debugger
react-native-debugger
```

## Performance Optimization

- Lazy load screens with React.lazy()
- Memoize expensive computations with useMemo
- Use FlatList for long lists instead of ScrollView
- Optimize re-renders with React.memo

## Security Considerations

### PII Protection
- Encrypt phone numbers locally
- Never log sensitive data
- Use HTTPS for all API calls
- Device pin for authentication

### Storage
- AsyncStorage for non-sensitive data
- Encrypted storage for tokens & keys
- Clear sensitive data on logout

### Network
- Certificate pinning
- Request/response signing
- Timeout protection

## Navigation Structure

```
Root Navigator
├── Onboarding Stack (not authenticated)
│   ├── RequestOtpScreen
│   ├── VerifyOtpScreen
│   └── PhotoVerificationScreen
└── App Stack (authenticated)
    ├── HomeScreen
    ├── ActivitiesStack
    │   ├── ActivitiesScreen
    │   └── ActivityDetailScreen
    ├── VouchStack
    └── ProfileStack
```

## Troubleshooting

### Metro Bundler Issues
```bash
# Reset cache
npm start -- --reset-cache

# Kill bundler process
lsof -i :8081 | grep node | awk '{print $2}' | xargs kill -9
```

### Build Issues
```bash
# Android
cd android && ./gradlew clean && cd ..
npm run android

# iOS
cd ios && rm -rf Pods Podfile.lock && cd ..
npx react-native setup:ios-pods
npm run ios
```

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Keep components small and focused
3. Use proper TypeScript types
4. Write unit tests
5. Follow clean code principles
6. Submit PR with description

## Resources

- [React Native Docs](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Ubuntu Network API Docs](../api/README.md)

## License

MIT

## Support

Open an issue or contact the team for help.
