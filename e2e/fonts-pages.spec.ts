import { expect, test } from '@playwright/test'
import { enterDemoHub } from './helpers/hub'

test.describe('LETZZ test hub GitHub Pages assets', () => {
  test('IBM Plex bundled font URLs resolve on base path', async ({ page, request, baseURL }) => {
    const base = baseURL ?? 'https://eob-ip-box.github.io/test/'
    await enterDemoHub(page, '/choose')
    const stylesheet = page.locator('link[rel="stylesheet"][href*="assets/"]')
    await expect(stylesheet).toHaveCount(1)
    const cssHref = await stylesheet.getAttribute('href')
    expect(cssHref).toBeTruthy()
    const cssUrl = new URL(cssHref!, base).toString()
    const cssText = await (await request.get(cssUrl)).text()
    expect(cssText).toMatch(/IBM Plex Sans/)
    const fontMatch = cssText.match(/url\(([^)]+\.woff2[^)]*)\)/)
    expect(fontMatch?.[1]).toBeTruthy()
    const fontUrl = new URL(fontMatch![1].replace(/["']/g, ''), base).toString()
    const fontRes = await request.get(fontUrl)
    expect(fontRes.status(), `font fetch ${fontUrl}`).toBe(200)
  })
})
