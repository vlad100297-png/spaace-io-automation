// @ts-check
import { expect, test } from '@playwright/test';
import HomePage from './pageObjects/home.page.js';

test.describe('Home page - Connect Wallet button', () => {
  test('Open base url and click Connect Wallet', async ({ page }) => {
    const home = await HomePage.init(page);
    await home.navigate();
    await home.connectWalletButton.click();
    await home.dialog.waitFor({ state: 'visible', timeout: 5000 });
    await home.agreeAndProcedButton.click();
    await expect(home.goToYourWalletBox).toBeVisible();
  });
});
