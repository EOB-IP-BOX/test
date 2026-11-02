import { expect, test } from '@playwright/test'
import {
  openOeGrants,
  openWalletHome,
  resetHubStorage,
  viewPackForSubject,
} from './helpers/hub'

test.describe('LETZZ test hub grant pack smoke', () => {
  test.beforeEach(async ({ page }) => {
    await resetHubStorage(page)
  })

  test('OE View pack shows step-up gate and Path B probe honesty', async ({ page }) => {
    await openOeGrants(page)
    await expect(page.getByRole('heading', { name: 'Grants' })).toBeVisible()

    await viewPackForSubject(page, 'Taylor Swift')
    const gate = page.getByTestId('grant-pack-step-up-gate')
    await expect(gate).toBeVisible()
    await expect(gate).toContainText('STEP_UP_DENIED')

    const pathB = page.getByTestId('grant-pack-path-b-probe')
    await pathB.getByRole('button', { name: 'Run WebAuthn probe' }).click()

    const probeResult = page.locator(
      '[data-testid="webauthn-probe-webauthn_unavailable"], [data-testid="webauthn-probe-webauthn_verify_not_wired"]',
    )
    await expect(probeResult).toBeVisible()
    await expect(probeResult).toContainText(/never unlocks|does not unlock|not wired|Path A/i)
  })

  test('Wallet loopback approve unlocks pack preview on OE Grants', async ({ page, context }) => {
    await openOeGrants(page)
    await viewPackForSubject(page, 'Oprah Winfrey')
    const gate = page.getByTestId('grant-pack-step-up-gate')
    await expect(gate).toBeVisible()

    const walletTab = await context.newPage()
    await openWalletHome(walletTab)
    const inbox = walletTab.getByTestId('wallet-step-up-inbox')
    await expect(inbox).toBeVisible()
    await inbox.getByRole('button', { name: /^Approve step-up/i }).click()

    await expect(page.getByTestId('grant-pack-preview')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByTestId('grant-pack-preview')).toContainText('DEMO permission pack')
    await expect(gate).toHaveCount(0)
    await walletTab.close()
  })

  test('Revoked grant shows GRANT_REVOKED on View pack', async ({ page }) => {
    await openOeGrants(page)
    await viewPackForSubject(page, 'Elon Musk')
    const error = page.getByTestId('grant-pack-error')
    await expect(error).toBeVisible()
    await expect(error).toContainText('GRANT_REVOKED')
  })

  test('Revoke granted row before step-up shows GRANT_REVOKED not stale gate', async ({ page }) => {
    await openOeGrants(page)
    const row = page.locator('.work-row').filter({ hasText: 'Oprah Winfrey' })
    await row.getByRole('button', { name: 'Revoke' }).click()
    await row.getByRole('button', { name: 'View pack' }).click()

    const error = page.getByTestId('grant-pack-error')
    await expect(error).toBeVisible()
    await expect(error).toContainText('GRANT_REVOKED')
    await expect(page.getByTestId('grant-pack-step-up-gate')).toHaveCount(0)
  })
})
