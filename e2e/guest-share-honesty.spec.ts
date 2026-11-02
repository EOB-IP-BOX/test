import { expect, test } from '@playwright/test'
import { enterDemoHub, resetHubStorage } from './helpers/hub'

const DEMO_GUEST_SHARE_TOKEN = 'demo-hub-guest-share'
const DEMO_GUEST_DOCUMENT_ID = 'demo-hub-guest-doc-001'

test.describe('Guest share honesty (Codex 4.3, demo hub)', () => {
  test.beforeEach(async ({ page }) => {
    await resetHubStorage(page)
  })

  test('open desk lists hash metadata and Check download returns download_not_available', async ({
    page,
  }) => {
    await enterDemoHub(page, `/guest/${encodeURIComponent(DEMO_GUEST_SHARE_TOKEN)}`)

    await expect(page.getByRole('heading', { name: 'One-time share opened' })).toBeVisible()
    await expect(page.getByText(/does not mirror wallet vault bytes/i)).toBeVisible()
    await expect(page.getByText('Shared items (hash metadata only)', { exact: true })).toBeVisible()
    await expect(page.locator('li').filter({ hasText: DEMO_GUEST_DOCUMENT_ID })).toBeVisible()
    await expect(page.getByText('Honesty: download_not_available')).toBeVisible()
    await expect(page.getByText(/Document materialization is hash-metadata/i)).toBeVisible()

    await page.getByRole('button', { name: 'Check download availability' }).click()
    await expect(page.getByText(/^download_not_available:/)).toBeVisible({ timeout: 15_000 })
  })

  test('register?from=guest-share is an honest gate without Cognito signup', async ({ page }) => {
    await enterDemoHub(page, '/register?from=guest-share')

    await expect(page.getByRole('heading', { name: 'Create LETZZ Wallet' })).toBeVisible()
    await expect(page.getByText('No instant web signup')).toBeVisible()
    await expect(
      page.getByText(/Cognito-backed registration and hosted wallet provisioning are not available/i),
    ).toBeVisible()
    await expect(page.getByText(/does not mint a LETZZ Wallet vault on Platform/i)).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Install LETZZ Wallet' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Local Cloud sign in' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to LETZZ home' })).toBeVisible()
  })

  test('guest open CTA navigates to register invite path', async ({ page }) => {
    await enterDemoHub(page, `/guest/${encodeURIComponent(DEMO_GUEST_SHARE_TOKEN)}`)

    await expect(page.getByRole('link', { name: 'Create a LETZZ Wallet account' })).toBeVisible()
    await page.getByRole('link', { name: 'Create a LETZZ Wallet account' }).click()
    await expect(page).toHaveURL(/\/register\?from=guest-share/)
    await expect(page.getByRole('heading', { name: 'Create LETZZ Wallet' })).toBeVisible()
  })
})
