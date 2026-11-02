import { expect, test } from '@playwright/test'
import { enterDemoHub, resetHubStorage } from './helpers/hub'

test.describe('LETZZ test hub Documents and Packages', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

  test.beforeEach(async ({ page }) => {
    await resetHubStorage(page)
  })

  test('Documents inspect, verify hash, and blocked download honesty', async ({ page }) => {
    await enterDemoHub(page, '/wallet/documents')
    await expect(page.getByRole('heading', { name: 'Documents' })).toBeVisible()

    const list = page.getByTestId('wallet-documents-list')
    await expect(list).toBeVisible()

    const firstRow = list.locator('.work-row').first()
    const hashText = await firstRow.locator('.hash-chip').first().textContent()
    expect(hashText?.trim().length).toBeGreaterThan(10)

    await firstRow.getByRole('button', { name: 'Inspect' }).click()
    const detail = page.getByTestId('wallet-document-detail')
    await expect(detail).toBeVisible()

    await detail.getByRole('button', { name: 'Download PDF (blocked)' }).click()
    const verifyResult = page.getByTestId('wallet-document-verify-result')
    await expect(verifyResult).toContainText(/Blocked|no vault bytes/i)

    await page.locator('#verify-hash').fill(hashText?.trim() ?? '')
    await detail.getByRole('button', { name: 'Run verify-only check' }).click()
    await expect(verifyResult).toContainText(/Index match|DEMO/i)
  })

  test('Packages draft assemble, ready, and manifest copy', async ({ page }) => {
    await enterDemoHub(page, '/wallet/packages')
    await expect(page.getByRole('heading', { name: 'Packages' })).toBeVisible()

    await page.getByTestId('wallet-package-create').getByRole('button', { name: 'Create draft' }).click()
    const detail = page.getByTestId('wallet-package-detail')
    await expect(detail).toBeVisible()

    const assembler = page.getByTestId('wallet-package-assembler')
    await expect(assembler).toBeVisible()
    const checks = assembler.locator('input[type="checkbox"]')
    await checks.nth(0).check()
    await checks.nth(1).check()

    await page.getByTestId('wallet-packages-list').getByRole('button', { name: 'Mark ready' }).first().click()
    await expect(page.getByTestId('wallet-packages-list')).toContainText('ready')

    await detail.getByRole('button', { name: 'Copy hash manifest (JSON)' }).click()
    const notice = page.getByTestId('wallet-package-manifest-notice')
    await expect(notice).toContainText(/Manifest copied|hash/i)

    const preview = page.getByTestId('wallet-package-manifest-preview')
    await expect(preview).toContainText('"vaultBytesIncluded": false')
    await expect(preview).toContainText('"model": "hash-only"')
  })

  test('Assistant quick prompt returns non-generative stub', async ({ page }) => {
    await enterDemoHub(page, '/wallet/assistant')
    await expect(page.getByTestId('wallet-assistant-panel')).toBeVisible()

    await page.getByRole('button', { name: 'Summarize pending grants' }).click()
    const thread = page.getByTestId('wallet-assistant-thread')
    await expect(thread).toContainText(/DEMO Concierge|local stub|no GPT/i)
    await expect(thread).toContainText(/pending grant/i)
  })
})
