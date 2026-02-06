# Spaace IO Automation

Playwright-based end-to-end tests for the Spaace.

Prerequisites
- Node.js 18+ and npm

Install dependencies
```bash
npm install
```

Install Playwright browsers (Linux may require system deps)
```bash
npx playwright install
# or, if missing system libraries on Linux or CI:
npx playwright install --with-deps
```

Run tests
- Run all tests (headless):
```bash
npm test
```
- Run headed (visible) browsers:
```bash
npm run test:headed
```
- Run Playwright debug mode:
```bash
npm run test:debug
```
- Run a single spec file:
```bash
npx playwright test tests/home.spec.ts
```

Open the HTML report
```bash
npm run test:report
```