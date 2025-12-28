# Contributing to Ubuntu Network

Thank you for considering contributing to Ubuntu Network! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project follows the Ubuntu philosophy: **"I am because we are."** We are committed to providing a welcoming and safe environment for all contributors.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards others
- Prioritize safety and security in all decisions

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, device, versions)

### Suggesting Features

1. Check existing issues and discussions
2. Create a feature request with:
   - Clear use case
   - How it aligns with safety-first principles
   - Mockups or examples if applicable

### Code Contributions

#### Before You Start

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Set up development environment (see README.md)

#### Code Standards

**Follow these principles strictly:**

1. **SOLID Principles**
   - Single Responsibility: One class/function, one purpose
   - Open/Closed: Extend, don't modify
   - Liskov Substitution: Subtypes must be substitutable
   - Interface Segregation: Small, focused interfaces
   - Dependency Inversion: Depend on abstractions

2. **DRY (Don't Repeat Yourself)**
   - Extract reusable logic
   - Create utility functions
   - Use TypeScript generics

3. **Clean Code**
   - Meaningful names
   - Small functions (<20 lines)
   - Clear comments for complex logic
   - Type everything (TypeScript strict mode)

4. **Security First**
   - Never log sensitive data
   - Validate all inputs
   - Encrypt PII
   - Follow least privilege principle

#### Code Style

**TypeScript:**
```typescript
// ✅ Good
export class OtpService {
  private readonly OTP_EXPIRY_MS = 5 * 60 * 1000;

  public generateOtp(phone: string): string {
    // Clear, typed, single responsibility
  }
}

// ❌ Bad
export class Service {
  genOTP(p: any) {
    // Unclear name, no types, too generic
  }
}
```

**Naming Conventions:**
- Classes: `PascalCase`
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Interfaces: `PascalCase` (no `I` prefix)
- Files: `kebab-case.ts`

#### Testing

- Write unit tests for all business logic
- Integration tests for API endpoints
- E2E tests for critical flows
- Minimum 80% code coverage

```bash
# Run tests
npm test

# Run with coverage
npm run test:cov
```

#### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add photo verification endpoint
fix: resolve OTP expiry issue
docs: update API documentation
test: add tests for vouch service
refactor: extract OTP logic to service
chore: update dependencies
```

#### Pull Request Process

1. **Before submitting:**
   - Run tests: `npm test`
   - Run linter: `npm run lint`
   - Update documentation
   - Add/update tests

2. **PR Description:**
   - Reference related issue: `Closes #123`
   - Describe changes clearly
   - Include screenshots for UI changes
   - List breaking changes

3. **Review Process:**
   - At least 1 approval required
   - All checks must pass
   - Address review feedback promptly

### Project Structure

```
ubuntu-network-app/
├── mobile/           # React Native app
│   └── src/
│       ├── screens/  # UI screens
│       ├── services/ # API clients, business logic
│       └── types/    # TypeScript types
├── api/              # NestJS backend
│   └── src/
│       ├── auth/     # Authentication module
│       ├── users/    # User management
│       └── ...       # Feature modules
├── docs/             # Documentation
└── infra/            # Infrastructure configs
```

### Development Workflow

1. **Pick an issue** or create one
2. **Assign yourself** to avoid duplicate work
3. **Create branch**: `feature/issue-123-description`
4. **Develop** following code standards
5. **Test** thoroughly
6. **Commit** with clear messages
7. **Push** and create PR
8. **Address** review feedback
9. **Merge** after approval

### Security

**Report security vulnerabilities privately:**
- Email: [security contact - to be added]
- Do NOT create public issues for security bugs

**Security checklist for PRs:**
- [ ] No secrets in code
- [ ] Input validation implemented
- [ ] Authentication/authorization checked
- [ ] SQL injection prevented
- [ ] XSS prevention in place
- [ ] CSRF tokens used

## Community

- **Discussions:** Use GitHub Discussions for questions
- **Issues:** Track bugs and features
- **Pull Requests:** Submit code changes

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Open a discussion or reach out to maintainers.

---

**Thank you for helping make communities safer! 🤝**
