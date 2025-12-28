# Ubuntu Network — Digital Community Safety Platform

Monorepo (mobile + api) scaffold for the UBUNTU NETWORK project. This initial commit includes a bare React Native (TypeScript) app skeleton, a minimal NestJS API skeleton, CI workflow, and documentation.

## Quick start (developer)

1. **Clone:**
   ```bash
   git clone git@github.com:KhumaloAugustine/ubuntu-network-app.git
   cd ubuntu-network-app
   ```

2. **Install root dependencies (uses npm workspaces):**
   ```bash
   npm install
   ```

3. **Mobile (bare React Native)** - follow React Native docs for native setup (Android/iOS). See `/mobile/README.md`

4. **API:**
   ```bash
   cd api
   npm install
   npm run start:dev
   ```

## Project Structure

```
ubuntu-network-app/
├── mobile/          # React Native mobile app
├── api/             # NestJS backend API
├── docs/            # Architecture and design docs
├── infra/           # Infrastructure config and examples
└── .github/         # CI/CD workflows
```

## Principles

Clean code, OOP, SOLID, DRY, readable, maintainable, scalable, secure.

## License

MIT

## Contact

KhumaloAugustine
