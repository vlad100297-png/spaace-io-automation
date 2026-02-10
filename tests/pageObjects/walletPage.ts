import { type Page } from '@playwright/test';
import { MetaMask } from '@synthetixio/synpress/playwright';
import BasePage from './basePage.js';

/**
 * Page object for wallet-related interactions
 * Provides methods for connecting/disconnecting wallet and handling transactions
 */
class WalletPage extends BasePage {
  private metamask: MetaMask;

  // Selectors for wallet-related UI elements
  // Note: These are generic selectors - adjust based on actual application
  private connectWalletButton = 'button:has-text("Connect Wallet")';
  private walletAddressDisplay = '[data-testid="wallet-address"]';
  private walletBalanceDisplay = '[data-testid="wallet-balance"]';
  private walletMenuButton = '[data-testid="wallet-menu"]';
  private disconnectButton = 'button:has-text("Disconnect")';

  constructor(page: Page, metamask: MetaMask) {
    super(page);
    this.metamask = metamask;
  }

  /**
   * Connect MetaMask wallet to the dApp
   * Clicks the connect button and approves the connection in MetaMask
   */
  async connectWallet() {
    await this.page.locator(this.connectWalletButton).click();
    await this.metamask.connectToDapp();
  }

  /**
   * Disconnect wallet from dApp
   */
  async disconnectWallet() {
    await this.page.locator(this.walletMenuButton).click();
    await this.page.locator(this.disconnectButton).click();
  }

  /**
   * Get displayed wallet address from the UI
   */
  async getWalletAddress(): Promise<string> {
    return (await this.page.locator(this.walletAddressDisplay).textContent()) || '';
  }

  /**
   * Check if wallet is connected by looking for wallet address display
   */
  async isWalletConnected(): Promise<boolean> {
    return await this.page.locator(this.walletAddressDisplay).isVisible();
  }

  /**
   * Check if connect wallet button is visible
   */
  async isConnectButtonVisible(): Promise<boolean> {
    return await this.page.locator(this.connectWalletButton).isVisible();
  }

  /**
   * Approve transaction in MetaMask
   */
  async approveTransaction() {
    await this.metamask.confirmTransaction();
  }

  /**
   * Reject transaction in MetaMask
   */
  async rejectTransaction() {
    await this.metamask.rejectTransaction();
  }

  /**
   * Sign message in MetaMask for authentication
   */
  async signMessage() {
    await this.metamask.confirmSignature();
  }

  /**
   * Reject message signature in MetaMask
   */
  async rejectSignature() {
    await this.metamask.rejectSignature();
  }
}

export default WalletPage;
