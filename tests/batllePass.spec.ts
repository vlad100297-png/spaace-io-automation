import { expect, test } from '@playwright/test';
import BatllePassPage from './pageObjects/batllePass.page';

test.describe('market page - Connect Wallet button', () => {
  test('Open base url and click Connect Wallet', async ({ page }) => {
    const market = await BatllePassPage.init(page);
    await market.navigate();
    await market.header.connectWalletButton.click();
    await market.modal.waitForOpen();
    await market.modal.agreeAndProcedButton.click();
    await expect(market.modal.isOpen()).toBe(true);

    //await market.dialog.waitFor({ state: 'visible', timeout: 5000 });
    //await market.agreeAndProcedButton.click();
    //await expect(market.goToYourWalletBox).toBeVisible();
  });
});