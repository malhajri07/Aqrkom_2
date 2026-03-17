# Aqarkom E2E Tests

Playwright E2E tests for the Aqarkom web app.

## Setup

```bash
# Install browsers (Chromium only - smaller download)
pnpm test:e2e:install

# Or install all browsers (Chrome, Firefox, WebKit)
pnpm test:e2e:install:all
```

## Run

```bash
# Run all E2E tests (starts dev server automatically)
pnpm test:e2e

# Run with UI
pnpm test:e2e:ui
```

## Browser install fails (ENOTFOUND)

If you see `getaddrinfo ENOTFOUND cdn.playwright.dev`:

1. **Different network** — Try from home, mobile hotspot, or disable VPN
2. **Chromium only** — `pnpm test:e2e:install` downloads one browser instead of three
3. **Docker** — Use Playwright's image (browsers pre-installed). Start the app on host first (`pnpm dev`), then:

   ```bash
   docker run -v $(pwd):/app -w /app \
     -e CI=1 -e BASE_URL=http://host.docker.internal:5173 \
     mcr.microsoft.com/playwright:v1.48.0-noble pnpm test:e2e
   ```
