import { test, expect } from './fixtures/index'
import { ai } from '@zerostep/playwright'

test('AI login test', async ({ page }) => {
  await page.goto('/');
  await ai('Click Connect Wallet', { page, test })
  await ai('Click Get a Wallet', { page, test })
  await ai('Select one of the wallet options', { page, test })
})
