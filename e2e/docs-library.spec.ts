import { expect, test } from '@playwright/test'
import { enterDemoHub, hashPath } from './helpers/hub'

test.describe('partner documentation library', () => {
  test('chooser offers docs and HTML briefs open after Alma', async ({ page }) => {
    // Clear once only. Do not use addInitScript: static docs HTML reads sessionStorage
    // and a per-navigation clear would lock the gate after leaving the SPA.
    await page.goto(hashPath('/'))
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await enterDemoHub(page, '/choose')
    await expect(page.getByTestId('chooser-docs')).toBeVisible()
    await page.getByTestId('chooser-docs').click()
    await expect(page).toHaveURL(/#\/docs/)
    await expect(page.getByRole('heading', { name: 'Business documentation' })).toBeVisible()

    await page.getByTestId('docs-link-software').click()
    await page.waitForURL(/docs\/software\.html/)
    await expect(page.getByRole('heading', { name: 'How the software works' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'For everyone' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'For builders' })).toBeVisible()
    await page.getByRole('button', { name: 'For builders' }).click()
    await expect(page.getByRole('heading', { name: 'Architecture for builders' })).toBeVisible()
  })

  test('business HTML requires unlocked session', async ({ page }) => {
    await page.goto(hashPath('/'))
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await page.goto('./docs/business.html')
    await expect(page.getByTestId('docs-session-gate')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Open demo gate' })).toBeVisible()
  })

  test('business HTML opens after Alma via docs library', async ({ page }) => {
    await page.goto(hashPath('/'))
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await enterDemoHub(page, '/docs')
    await page.getByTestId('docs-link-business').click()
    await page.waitForURL(/docs\/business\.html/)
    await expect(page.getByRole('heading', { name: 'How the business works' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Business thesis' })).toBeVisible()
  })
})
