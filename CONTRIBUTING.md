# Contributing to Ubuntu Network

We welcome contributions that help build a safer community. Please follow these guidelines.

## Code of Conduct

- Be respectful and inclusive
- No discrimination, harassment, or hostile behavior
- All voices matter
- Report issues privately to maintainers

## Before You Start

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Read this entire guide
4. Ensure your dev environment is set up correctly (see Setup section)

## Development Guidelines

### Clean Code Standards

We follow SOLID principles and clean code practices:

#### Single Responsibility Principle (SRP)
- Each class/function has ONE reason to change
- Services handle business logic
- Components handle UI
- Utils handle reusable operations

```typescript
// ❌ BAD: Multiple responsibilities
class UserService {
  async getUser() { }
  async validateInput() { }
  async sendEmail() { }
  async logErrors() { }
}

// ✅ GOOD: Single responsibility
class UserService {
  async getUser() { }
}

class ValidationService {
  validateInput() { }
}

class EmailService {
  async sendEmail() { }
}

class LogService {
  logErrors() { }
}
```

#### Dependency Inversion Principle (DIP)
- Depend on abstractions, not concrete implementations
- Use interfaces for contracts
- Inject dependencies

```typescript
// ❌ BAD: Direct dependency
class AuthService {
  private api = new ApiService();
}

// ✅ GOOD: Injected/singleton
class AuthService {
  constructor(private api: IApiService) { }
}
```

#### DRY (Don't Repeat Yourself)
- Extract common logic to utils
- Create reusable components
- Share business logic via services

### Naming Conventions

```typescript
// Services: verb + Service
class AuthService { }
class ValidationService { }

// Utils: PascalCase + Util
class PhoneUtil { }
class DateUtil { }

// Components: PascalCase
function UserProfile() { }
function ActivityCard() { }

// Hooks: use + CamelCase
function useAuth() { }
function useActivity() { }

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const OTP_EXPIRY_MINUTES = 5;
```

### TypeScript Requirements

- Use **strict mode** always
- Define all types explicitly
- No `any` types unless absolutely necessary
- Use interfaces for public APIs

```typescript
// ✅ GOOD
interface User {
  id: string;
  phone: string;
  tier: UserTier;
}

async function getUser(id: string): Promise<User | null> {
  // Implementation
}

// ❌ BAD
async function getUser(id: any): any {
  // Implementation
}
```

### Error Handling

All errors should be typed and descriptive:

```typescript
// ✅ GOOD: Custom exceptions with context
throw new ValidationException('Invalid phone number', {
  field: 'phone',
  value: phone,
  expected: '+27XXXXXXXXX'
});

// ❌ BAD: Generic errors
throw new Error('Invalid input');
```

### Testing Requirements

Write tests for:
- **Services**: Unit tests (100% coverage expected)
- **Utilities**: Unit tests (100% coverage)
- **Components**: Integration tests + snapshot tests
- **API flows**: E2E tests

```bash
npm run test        # Run tests once
npm run test:watch  # Watch mode
npm run test:cov    # Coverage report
```

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactor (no behavior change)
- `style`: Code style changes
- `test`: Test additions/updates
- `docs`: Documentation
- `chore`: Build, dependencies, etc.

**Examples:**
```
feat(auth): implement SMS OTP verification
fix(activities): resolve GPS check-in timeout
refactor(vouch): simplify tier assignment logic
docs(readme): add setup instructions
```

### PR Process

1. **Before opening PR:**
   - Run `npm run lint` - must pass
   - Run `npm run test` - must pass
   - Run `npm run type-check` - must pass
   - Rebase on latest main

2. **PR Description should include:**
   - What problem this solves
   - How to test it
   - Any breaking changes
   - Screenshots (if UI change)

3. **Review Process:**
   - At least 2 approvals required
   - All conversations resolved
   - CI/CD checks passing

4. **Before Merge:**
   - Squash commits if multiple
   - Update related documentation
   - Ensure commits follow format

## Architecture Overview

### Backend (NestJS)
```
api/
├── common/          # Shared utilities, DTOs, filters
├── auth/            # Authentication logic
├── users/           # User management
├── activities/      # Activity/session logic
├── vouch/           # Vouching system
├── locations/       # Safe locations
└── database/        # ORM, migrations, entities
```

**Key Pattern: Services handle business logic, controllers handle HTTP**

```typescript
// UserController: HTTP handler
@Controller('users')
export class UserController {
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}

// UserService: Business logic
@Injectable()
export class UserService {
  async findById(id: string): Promise<User> {
    // Implementation
  }
}
```

### Mobile (React Native)
```
mobile/src/
├── screens/         # Full-screen components
├── components/      # Reusable UI components
├── services/        # Business logic & API
├── utils/           # Utility functions
├── types/           # TypeScript types
└── hooks/           # Custom React hooks
```

**Key Pattern: Screens compose services + components**

```typescript
// Screen uses service + components
function ActivityListScreen() {
  const { activities, loading } = useActivityService();
  return activities.map(a => <ActivityCard activity={a} />);
}

// Service handles API calls
const { activities } = await activityService.getActivities();

// Component just renders
function ActivityCard({ activity }) {
  return <View><Text>{activity.name}</Text></View>;
}
```

## Common Tasks

### Adding a New API Endpoint

1. **Create Entity** (if needed)
   ```typescript
   // database/entities/my-entity.ts
   @Entity('my_table')
   export class MyEntity { }
   ```

2. **Create Module**
   ```typescript
   // my-feature/my-feature.module.ts
   @Module({
     imports: [TypeOrmModule.forFeature([MyEntity])],
     controllers: [MyController],
     providers: [MyService],
   })
   export class MyFeatureModule { }
   ```

3. **Create Service**
   ```typescript
   // my-feature/my-feature.service.ts
   @Injectable()
   export class MyService {
     async getData(): Promise<MyEntity[]> { }
   }
   ```

4. **Create Controller**
   ```typescript
   // my-feature/my-feature.controller.ts
   @Controller('my-feature')
   export class MyController {
     @Get()
     async getAll() {
       return this.myService.getData();
     }
   }
   ```

5. **Add Tests**
   ```typescript
   // my-feature/my-feature.service.spec.ts
   describe('MyService', () => {
     it('should fetch data', async () => {
       const result = await service.getData();
       expect(result).toBeDefined();
     });
   });
   ```

### Adding a New Screen

1. **Create Screen Component**
   ```typescript
   // mobile/src/screens/MyScreen.tsx
   export function MyScreen({ navigation }) {
     return <SafeAreaView><Text>My Screen</Text></SafeAreaView>;
   }
   ```

2. **Add to Navigation**
   ```typescript
   // mobile/src/navigation/RootNavigator.tsx
   <Stack.Screen name="My" component={MyScreen} />
   ```

3. **Add Tests**
   ```typescript
   // mobile/src/screens/MyScreen.test.tsx
   describe('MyScreen', () => {
     it('renders correctly', () => {
       const { getByText } = render(<MyScreen />);
       expect(getByText('My Screen')).toBeTruthy();
     });
   });
   ```

## Performance Checklist

Before committing:

- [ ] No console.logs left (except DEV)
- [ ] No unused imports
- [ ] No unused variables
- [ ] Proper TypeScript types everywhere
- [ ] Functions are small (<20 lines preferred)
- [ ] Comments explain WHY, not WHAT
- [ ] DRY principle followed
- [ ] No nested callbacks (use async/await)
- [ ] Error handling implemented
- [ ] Tests pass and cover edge cases

## Security Checklist

- [ ] No hardcoded secrets
- [ ] PII encrypted where needed
- [ ] Input validation on all APIs
- [ ] SQL injection prevention (ORM used)
- [ ] CORS properly configured
- [ ] Auth guards on protected routes
- [ ] Audit logging for sensitive actions
- [ ] Error messages don't leak info

## Documentation

Every public function/class should have JSDoc:

```typescript
/**
 * Validate South African phone number
 * @param phone Raw phone number (e.g., 0821234567 or +27821234567)
 * @returns true if valid format
 * @throws ValidationException if invalid
 */
export function isValidPhone(phone: string): boolean { }
```

## Setup Issues?

Common problems and solutions:

### Build failures
```bash
# Clear cache
npm run clean
npm install

# Rebuild
npm run build
```

### Port already in use
```bash
# Port 3000 (API)
lsof -i :3000 | grep node | awk '{print $2}' | xargs kill -9

# Port 8081 (Metro)
lsof -i :8081 | grep node | awk '{print $2}' | xargs kill -9
```

### Module not found
```bash
# Check paths in tsconfig
# Ensure all imports use correct path aliases
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Questions?

1. Check existing docs and issues
2. Ask in GitHub discussions
3. Contact maintainers privately for security issues

## License

By contributing, you agree your code will be licensed under MIT.

---

**Thank you for contributing to Ubuntu Network! 🙌**
