# E2E Testing Guide

> **Scope:** Optional setup for generated apps or when you add Playwright to a project.
> This **template repository** does not include `playwright.config` or an E2E GitHub Actions job.
> CI here runs `bun test` only. See [ci-gaps.md](./ci-gaps.md).

This guide covers end-to-end testing with Playwright and integration testing with Vitest.

## Setup

### Install Dependencies

```bash
npm install -D @playwright/test vitest @vitest/ui
```

### Configure Playwright

**playwright.config.ts**

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Configure Vitest

**vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

## E2E Tests (Playwright)

### Authentication Flow

**tests/e2e/auth.spec.ts**

```typescript
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should sign up a new user', async ({ page }) => {
    await page.goto('/auth/signup')

    // Fill signup form
    await page.fill('input[name="email"]', 'newuser@example.com')
    await page.fill('input[name="password"]', 'SecurePassword123!')
    await page.fill('input[name="name"]', 'New User')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for redirect and verify
    await page.waitForURL('/dashboard')
    expect(page.url()).toContain('/dashboard')
  })

  test('should log in an existing user', async ({ page }) => {
    await page.goto('/auth/signin')

    // Fill login form
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'Password123!')

    // Submit form
    await page.click('button[type="submit"]')

    // Verify redirect to dashboard
    await page.waitForURL('/dashboard')
    expect(page.url()).toContain('/dashboard')
  })

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/auth/signin')

    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'WrongPassword')
    await page.click('button[type="submit"]')

    // Wait for error message
    const error = page.locator('text=Invalid credentials')
    await expect(error).toBeVisible()
  })

  test('should log out user', async ({ page, context }) => {
    // Set auth cookie
    await context.addCookies([
      {
        name: 'auth-token',
        value: 'valid-token',
        url: 'http://localhost:3000',
      },
    ])

    await page.goto('/dashboard')

    // Click logout button
    await page.click('button:has-text("Logout")')

    // Verify redirect to login
    await page.waitForURL('/auth/signin')
    expect(page.url()).toContain('/auth/signin')
  })
})
```

### Post Management

**tests/e2e/posts.spec.ts**

```typescript
import { test, expect } from '@playwright/test'

test.describe('Post Management', () => {
  test.beforeEach(async ({ page, context }) => {
    // Set auth cookie before each test
    await context.addCookies([
      {
        name: 'auth-token',
        value: 'valid-token',
        url: 'http://localhost:3000',
      },
    ])
  })

  test('should create a new post', async ({ page }) => {
    await page.goto('/dashboard/posts')

    // Click create button
    await page.click('button:has-text("New Post")')

    // Fill form
    await page.fill('input[name="title"]', 'My First Post')
    await page.fill('textarea[name="content"]', 'This is the content of my post')

    // Submit form
    await page.click('button[type="submit"]')

    // Verify post appears in list
    const postTitle = page.locator('text=My First Post')
    await expect(postTitle).toBeVisible()
  })

  test('should edit a post', async ({ page }) => {
    await page.goto('/dashboard/posts')

    // Click edit button on first post
    await page.click('[data-testid="post-1"] button:has-text("Edit")')

    // Update title
    await page.fill('input[name="title"]', 'Updated Post Title')
    await page.click('button[type="submit"]')

    // Verify update
    const updatedTitle = page.locator('text=Updated Post Title')
    await expect(updatedTitle).toBeVisible()
  })

  test('should delete a post', async ({ page }) => {
    await page.goto('/dashboard/posts')

    const postCount = await page.locator('[data-testid^="post-"]').count()

    // Click delete button on first post
    await page.click('[data-testid="post-1"] button:has-text("Delete")')

    // Confirm deletion
    await page.click('button:has-text("Confirm")')

    // Verify post is removed
    const newCount = await page.locator('[data-testid^="post-"]').count()
    expect(newCount).toBe(postCount - 1)
  })

  test('should publish a post', async ({ page }) => {
    await page.goto('/dashboard/posts')

    // Click publish button
    await page.click('[data-testid="post-1"] button:has-text("Publish")')

    // Verify published state
    const published = page.locator('[data-testid="post-1"] .published-badge')
    await expect(published).toBeVisible()
  })
})
```

### User Settings

**tests/e2e/settings.spec.ts**

```typescript
import { test, expect } from '@playwright/test'

test.describe('User Settings', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'auth-token',
        value: 'valid-token',
        url: 'http://localhost:3000',
      },
    ])
  })

  test('should update profile', async ({ page }) => {
    await page.goto('/settings/profile')

    // Update name
    await page.fill('input[name="name"]', 'Updated Name')

    // Update bio
    await page.fill('textarea[name="bio"]', 'My new bio')

    // Save
    await page.click('button[type="submit"]')

    // Verify success message
    const success = page.locator('text=Profile updated')
    await expect(success).toBeVisible()
  })

  test('should change password', async ({ page }) => {
    await page.goto('/settings/security')

    // Fill password fields
    await page.fill('input[name="currentPassword"]', 'OldPassword123!')
    await page.fill('input[name="newPassword"]', 'NewPassword123!')
    await page.fill('input[name="confirmPassword"]', 'NewPassword123!')

    // Submit
    await page.click('button:has-text("Change Password")')

    // Verify success
    const success = page.locator('text=Password changed')
    await expect(success).toBeVisible()
  })

  test('should manage sessions', async ({ page }) => {
    await page.goto('/settings/sessions')

    // Verify sessions list
    const sessions = page.locator('[data-testid="session-item"]')
    expect(await sessions.count()).toBeGreaterThan(0)

    // Logout from another session
    await page.click('[data-testid="session-item"] button:has-text("Logout")')

    // Confirm
    await page.click('button:has-text("Confirm")')

    // Verify removed
    const newCount = await page.locator('[data-testid="session-item"]').count()
    expect(newCount).toBeGreaterThan(0)
  })
})
```

### Navigation & Pages

**tests/e2e/navigation.spec.ts**

```typescript
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate to all public pages', async ({ page }) => {
    const publicPages = ['/', '/about', '/pricing', '/contact']

    for (const pagePath of publicPages) {
      await page.goto(pagePath)
      expect(page.url()).toContain(pagePath)
      await expect(page).toHaveTitle(/.*/)
    }
  })

  test('should redirect unauthenticated users from protected pages', async ({ page }) => {
    await page.goto('/dashboard')

    // Should redirect to signin
    await page.waitForURL('/auth/signin')
    expect(page.url()).toContain('/auth/signin')
  })

  test('should have working navigation menu', async ({ page }) => {
    await page.goto('/')

    // Click products link
    await page.click('nav >> text=Products')
    expect(page.url()).toContain('/products')

    // Click pricing link
    await page.click('nav >> text=Pricing')
    expect(page.url()).toContain('/pricing')

    // Click contact link
    await page.click('nav >> text=Contact')
    expect(page.url()).toContain('/contact')
  })
})
```

### API Integration

**tests/e2e/api-integration.spec.ts**

```typescript
import { test, expect } from '@playwright/test'

test.describe('API Integration', () => {
  test('should load posts from API', async ({ page }) => {
    await page.goto('/posts')

    // Wait for API call
    await page.waitForResponse(
      (response) => response.url().includes('/api/posts') && response.status() === 200,
    )

    // Verify posts are rendered
    const posts = page.locator('[data-testid^="post-"]')
    expect(await posts.count()).toBeGreaterThan(0)
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept API calls and return error
    await page.route('/api/posts', (route) => {
      route.abort('failed')
    })

    await page.goto('/posts')

    // Verify error message
    const error = page.locator('text=Failed to load posts')
    await expect(error).toBeVisible()
  })
})
```

## Integration Tests (Vitest)

### Unit Tests

**tests/unit/validators.test.ts**

```typescript
import { describe, it, expect } from 'vitest'
import { emailSchema, passwordSchema, usernameSchema } from '@/lib/validation'

describe('Validators', () => {
  describe('emailSchema', () => {
    it('should validate correct email', () => {
      const result = emailSchema.safeParse('user@example.com')
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = emailSchema.safeParse('invalid-email')
      expect(result.success).toBe(false)
    })
  })

  describe('passwordSchema', () => {
    it('should validate strong password', () => {
      const result = passwordSchema.safeParse('SecurePassword123!')
      expect(result.success).toBe(true)
    })

    it('should reject weak password', () => {
      const result = passwordSchema.safeParse('weak')
      expect(result.success).toBe(false)
    })
  })

  describe('usernameSchema', () => {
    it('should validate correct username', () => {
      const result = usernameSchema.safeParse('john_doe')
      expect(result.success).toBe(true)
    })

    it('should reject username with special chars', () => {
      const result = usernameSchema.safeParse('john@doe')
      expect(result.success).toBe(false)
    })
  })
})
```

### Component Tests

**tests/unit/components.test.ts**

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

describe('Components', () => {
  describe('Button', () => {
    it('should render button', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByText('Click me')).toBeTruthy()
    })

    it('should handle click events', async () => {
      const onClick = vitest.fn()
      render(<Button onClick={onClick}>Click me</Button>)
      screen.getByText('Click me').click()
      expect(onClick).toHaveBeenCalledOnce()
    })
  })

  describe('Card', () => {
    it('should render card with content', () => {
      render(
        <Card>
          <h3>Test Card</h3>
        </Card>,
      )
      expect(screen.getByText('Test Card')).toBeTruthy()
    })
  })
})
```

### Hook Tests

**tests/unit/hooks.test.ts**

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

describe('Hooks', () => {
  describe('useLocalStorage', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('should initialize with default value', () => {
      const { result } = renderHook(() => useLocalStorage('test', 'default'))
      const [value] = result.current
      expect(value).toBe('default')
    })

    it('should update value', () => {
      const { result } = renderHook(() => useLocalStorage('test', ''))

      act(() => {
        const [, setValue] = result.current
        setValue('new value')
      })

      const [value] = result.current
      expect(value).toBe('new value')
    })

    it('should persist to localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('test', ''))

      act(() => {
        const [, setValue] = result.current
        setValue('persisted')
      })

      expect(localStorage.getItem('test')).toBe(JSON.stringify('persisted'))
    })
  })
})
```

## Running Tests

### Run All E2E Tests

```bash
npm run test:e2e
```

### Run Specific E2E Test

```bash
npm run test:e2e -- auth.spec.ts
```

### Run Tests in UI Mode

```bash
npm run test:e2e -- --ui
```

### Run Integration Tests

```bash
npm run test:integration
```

### Run All Tests

```bash
npm run test
```

## Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed",
    "test:integration": "vitest run tests/integration"
  }
}
```

## Best Practices

✅ Use `test.beforeEach` for setup
✅ Use descriptive test names
✅ Test user flows, not implementation details
✅ Use `data-testid` for selectors
✅ Keep tests isolated and independent
✅ Mock external APIs
✅ Use fixtures for common setup
✅ Run tests in CI/CD pipeline
✅ Aim for 80%+ coverage on critical paths
✅ Test happy paths and error cases

## CI/CD Integration

**.github/workflows/test.yml**

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:integration

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Debugging Tips

1. **Use `page.pause()`** to pause execution
2. **Use `--debug` flag** for interactive debugging
3. **Use `--headed` flag** to see browser
4. **Check screenshots** in `test-results/`
5. **Check traces** for detailed network/console logs
