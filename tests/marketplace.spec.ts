import { expect, test } from '@playwright/test';
import MarketplacePage from './pageObjects/marketplace.page';

test.describe('Marketplace Page: Header and Wallet Connection', () => {
  let marketplacePage: MarketplacePage;

  // Before each test, initialize the page object and navigate to the base URL.
  test.beforeEach(async ({ page }) => {
    marketplacePage = new MarketplacePage(page);
    await marketplacePage.navigate();
  });

  // --- Header Tests ---

  test('should display all essential header elements', async () => {
    await expect(marketplacePage.header.headerContainer).toBeVisible();
    await expect(marketplacePage.header.logoLink).toBeVisible();
    await expect(marketplacePage.header.sellNowLink).toBeVisible();
    await expect(marketplacePage.header.collectionsLink).toBeVisible();
    await expect(marketplacePage.header.rewardsDropdown).toBeVisible();
    await expect(marketplacePage.header.searchInput).toBeVisible();
    await expect(marketplacePage.header.connectWalletButton).toBeVisible();
    await expect(marketplacePage.header.bannerText).toBeVisible();
  });

  test('should open the rewards dropdown and show all links on click', async () => {
    await marketplacePage.header.clickRewardsDropdown();
    await expect(marketplacePage.header.referralsLink).toBeVisible();
    await expect(marketplacePage.header.battlePassLink).toBeVisible();
    await expect(marketplacePage.header.ogRewardsLink).toBeVisible();
    await expect(marketplacePage.header.stakingLink).toBeVisible();
    await expect(marketplacePage.header.cashbackLink).toBeVisible();
  });

  // --- Connect Wallet Modal Tests ---
  test('should open the Connect Wallet modal when the connect button is clicked', async () => {
    // Click the button in the header to trigger the modal.
    await marketplacePage.header.connectWalletButton.click();
    
    // Wait for the modal to appear and verify its state.
    await marketplacePage.modal.waitForOpen();
    expect(await marketplacePage.modal.isOpen()).toBe(true);
    await marketplacePage.modal.agreeAndProcedButton.click();
    await expect(marketplacePage.modal.title).toBeVisible();
  });

  test('Connect Wallet modal should display all wallet options and the info section', async () => {
    await marketplacePage.header.connectWalletButton.click();
    await marketplacePage.modal.waitForOpen();
    await marketplacePage.modal.agreeAndProcedButton.click();

    // Verify all wallet provider buttons are visible.
    [
      "Rainbow",
      "Coinbase Wallet",
      "MetaMask",
      "WalletConnect",
      "Rabby Wallet",
      "Phantom"
    ].forEach(async (wallet) => {
      await expect(marketplacePage.modal.page.getByRole('button', { name: wallet })).toBeVisible();
    });

    // Verify the "What is a Wallet?" section elements are visible.
    await expect(marketplacePage.modal.whatIsAWalletTitle).toBeVisible();
    await expect(marketplacePage.modal.getAWalletButton).toBeVisible();
    await expect(marketplacePage.modal.learnMoreLink).toBeVisible();
  });

  test('should close the Connect Wallet modal when the close icon is clicked', async () => {
    // First, open the modal to test the close functionality.
    await marketplacePage.header.connectWalletButton.click();
    await marketplacePage.modal.waitForOpen();
    expect(await marketplacePage.modal.isOpen()).toBe(true);

    // Click the close icon.
    await marketplacePage.modal.close();

    // Assert that the modal is no longer visible.
    await expect(marketplacePage.modal.dialog).not.toBeVisible();
    expect(await marketplacePage.modal.isOpen()).toBe(false);
  });

  [
    "Rainbow",
    "Coinbase Wallet",
    "MetaMask",
    "WalletConnect",
    //"Rabby Wallet",
    //"Phantom"
  ].forEach((wallet) => {
    test(`should show a QR connection code when ${wallet} wallet is selected`, async () => {
      await marketplacePage.header.connectWalletButton.click();
      await marketplacePage.modal.waitForOpen();
      await marketplacePage.modal.agreeAndProcedButton.click();

      // Click the MetaMask button.
      await marketplacePage.modal.page.getByRole('button', { name: wallet }).click();

      // Wait for the QR code prompt to appear.
      const text = wallet === "WalletConnect" ? 'Scan with your phone' : `Scan with ${wallet}`;
      await marketplacePage.modal.page.getByText(text).waitFor();
      await expect(marketplacePage.modal.page.getByText(text)).toBeVisible();
    })
  });
});