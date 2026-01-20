import { expect, test } from '@playwright/test';
import BatllePassPage from './pageObjects/batllePass.page';

test.describe('market page - Connect Wallet button', () => {
  test('Open base url and click Connect Wallet', async ({ page }) => {
    const market = await BatllePassPage.init(page);
    await market.navigate();
    await market.header.clickConnectWallet();
    await market.modal.waitForOpen();
    expect(await market.modal.isOpen()).toBe(true);
  });
});
