import { expect, test } from '@playwright/test'
import { DEMO_PASSWORD, enterDemoHub, hashPath } from './helpers/hub'

test.describe('Static gate and honesty reloads', () => {
  test('Alma unlocks the static Pages URL gate', async ({ page }) => {
    await page.goto(hashPath('/'))
    await expect(page.getByTestId('demo-hub-password-gate')).toBeVisible()
    await page.locator('#pw').fill(DEMO_PASSWORD)
    await page.getByRole('button', { name: 'Enter demo hub' }).click()
    await page.waitForURL(/#\/choose/)
    await expect(page.getByTestId('hub-static-url')).toContainText('eob-ip-box.github.io/test')
    await expect(page.getByTestId('hub-static-password')).toHaveText('Alma')
    await expect(page.getByTestId('hub-nov-2026-sync')).toBeVisible()
  })

  test('Wallet Home loopback re-read commits a stamp', async ({ page }) => {
    await enterDemoHub(page, '/wallet/home')
    await page.getByTestId('wallet-home-loopback-reload-button').click()
    await expect(page.getByTestId('wallet-home-loopback-stamp')).toBeVisible()
  })

  test('OE Screening and Organisations honesty reloads work', async ({ page }) => {
    await enterDemoHub(page, '/oe/screening')
    await page.getByTestId('oe-screening-job-detail-reload-button').click()
    await expect(page.getByTestId('oe-screening-job-detail-reload-note')).toContainText('replaced')

    await page.goto(hashPath('/oe/organisations'))
    await page.getByTestId('oe-organisation-detail-reload-button').click()
    await expect(page.getByTestId('oe-organisation-detail-reload-note')).toContainText('replaced')
  })
})
