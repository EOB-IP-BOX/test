import { expect, test } from '@playwright/test'
import { enterDemoHub, resetHubStorage } from './helpers/hub'

test.describe('LETZZ test hub Data Subject, Concierge, case pack', () => {
  test.beforeEach(async ({ page }) => {
    await resetHubStorage(page)
  })

  test('Data Subject life-store grant simulation and byte gate', async ({ page }) => {
    await enterDemoHub(page, '/wallet/data-subject')
    await expect(page.getByTestId('data-subject-honesty')).toContainText(/device|Platform index/i)
    await expect(page.getByTestId('life-source-index-progress-life-health')).toBeVisible()
    await page.getByTestId('life-source-life-vault').click()
    await page.getByTestId('data-subject-simulate-grant').click()
    await expect(page.getByTestId('life-source-grant-life-vault')).toContainText('Lux Compliance Demo OE')
    await page.getByRole('button', { name: 'Try open vault bytes' }).click()
    await expect(page.getByTestId('data-subject-byte-gate')).toContainText(/platform_vault_bytes_blocked|vault bytes/i)
  })

  test('Concierge local_degraded when local stub off', async ({ page }) => {
    await enterDemoHub(page, '/wallet/settings')
    await page.getByLabel('Local Concierge stub (rule-based, no GPT)').uncheck()
    await page.goto('#/wallet/assistant')
    await expect(page.getByTestId('concierge-banner-local_degraded')).toContainText(/local_degraded/i)
    await page.getByRole('button', { name: 'Summarize pending grants' }).click()
    await expect(page.getByTestId('wallet-assistant-thread')).toContainText(/local_degraded/i)
  })

  test('Concierge paywall_required and server_unreachable for heavy prompt', async ({ page }) => {
    await enterDemoHub(page, '/wallet/settings')
    await page.getByLabel('Simulated paywalled server heavy (honest gates only)').check()
    await page.goto('#/wallet/assistant')
    await expect(page.getByTestId('concierge-banner-paywall_required')).toContainText(/paywall_required/i)

    await page.getByLabel('Message Concierge (DEMO)').fill('Run a GPT heavy analysis on my vault')
    await page.getByRole('button', { name: /Send/i }).click()
    await expect(page.getByTestId('wallet-assistant-thread')).toContainText(/server_unreachable/i)
  })

  test('OE cases list View pack deep-links to case pack gate', async ({ page }) => {
    await enterDemoHub(page, '/oe/cases')
    await expect(page.getByTestId('oe-cases-list')).toBeVisible()
    await page.getByTestId('case-list-view-pack-case-008').click()
    await expect(page.getByTestId('grant-pack-step-up-gate')).toBeVisible()
  })

  test('OE case detail View case pack after grant approve and step-up', async ({ page }) => {
    await enterDemoHub(page, '/oe/cases/case-008')
    await expect(page.getByTestId('case-linked-grant')).toContainText('grant-3')
    await page.getByTestId('case-view-pack').click()
    await expect(page.getByTestId('grant-pack-step-up-gate')).toBeVisible()

    await page.goto('#/wallet/home')
    const inbox = page.getByTestId('wallet-step-up-inbox')
    await expect(inbox).toBeVisible()
    await inbox.getByRole('button', { name: /^Approve step-up/i }).click()

    await page.goto('#/oe/cases/case-008')
    await page.getByTestId('case-view-pack').click()
    await expect(page.getByTestId('case-pack-preview')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByTestId('case-pack-preview')).toContainText('DEMO permission pack')
  })

  test('OE case with pending linked grant shows hint', async ({ page }) => {
    await enterDemoHub(page, '/oe/cases/case-014')
    await expect(page.getByTestId('case-pack-pending-hint')).toContainText(/pending/i)
    await expect(page.getByTestId('case-view-pack')).toHaveCount(0)
  })

  test('OE subject mirrors wallet life-store grants and indexing hint', async ({ page }) => {
    await enterDemoHub(page, '/oe/subjects/sub-bond')
    await expect(page.getByTestId('oe-subject-life-store-sync')).toContainText(/Platform does not build/i)
    await expect(page.getByTestId('oe-life-grant-life-calendar')).toContainText('Lux Compliance Demo OE')
    await expect(page.getByTestId('oe-subject-indexing-hint')).toContainText(/Device indexing/i)
  })
})
