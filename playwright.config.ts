import { defineConfig, devices } from '@playwright/test'

const useLocal = process.env.PLAYWRIGHT_USE_LOCAL === '1'
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ??
  (useLocal ? 'http://127.0.0.1:4173/test/' : 'https://eob-ip-box.github.io/test/')

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'off',
    video: 'off',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: useLocal
    ? {
        command: 'npm run preview -- --host 127.0.0.1 --port 4173',
        url: 'http://127.0.0.1:4173/test/',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
})
