import type { Page } from '@playwright/test'

export const DEMO_PASSWORD = 'Alma'

/** HashRouter paths (leading slash, no hash prefix). */
export function hashPath(route: string): string {
  const normalized = route.startsWith('/') ? route : `/${route}`
  return `#${normalized}`
}

export async function resetHubStorage(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
}

export async function enterDemoHub(page: Page, route = '/choose'): Promise<void> {
  await page.goto(hashPath('/'))
  const gate = page.getByTestId('demo-hub-password-gate')
  const password = gate.locator('#pw')
  if (await gate.isVisible().catch(() => false)) {
    await password.fill(DEMO_PASSWORD)
    await page.getByRole('button', { name: 'Enter demo hub' }).click()
    await page.waitForURL(/#\/choose/)
  }
  if (route !== '/choose' && route !== '/') {
    await page.goto(hashPath(route))
  }
}

export async function openOeGrants(page: Page): Promise<void> {
  await enterDemoHub(page, '/oe/grants')
}

export async function openWalletHome(page: Page): Promise<void> {
  await enterDemoHub(page, '/wallet/home')
}

export async function viewPackForSubject(page: Page, subjectLabel: string): Promise<void> {
  const row = page.locator('.work-row').filter({ hasText: subjectLabel })
  await row.getByRole('button', { name: 'View pack' }).click()
}
