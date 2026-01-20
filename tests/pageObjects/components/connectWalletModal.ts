import { Locator, type Page } from "@playwright/test";

/**
 * Page object for the Connect Wallet modal.
 */
class ConnectWalletModal {
    readonly page: Page;
    readonly dialog: Locator;
    readonly cancelButton: Locator;
    readonly closeIcon: Locator;
    readonly title: Locator;
    readonly tosDialog: Locator;
    readonly tosCancelButton: Locator;
    readonly tosAgreeButton: Locator;

    // "What is a Wallet?" Section
    readonly whatIsAWalletTitle: Locator;
    readonly getAWalletButton: Locator;
    readonly learnMoreLink: Locator;

    constructor(page: Page) {
        this.page = page;

        this.dialog = page.getByRole('dialog', { name: 'Connect a Wallet' });
        this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
        this.closeIcon = this.dialog.getByRole('button', { name: 'Close' });
        this.title = this.dialog.getByText('Connect a Wallet' );

        // Terms of Service modal
        this.tosDialog = page.getByRole('dialog').filter({ hasText: 'Your NFT adventure awaits' });
        this.tosCancelButton = this.tosDialog.getByRole('button', { name: 'Cancel' });
        this.tosAgreeButton = this.tosDialog.getByRole('button', { name: 'Agree and proceed' });
        // --- "What is a Wallet?" Section ---
        this.whatIsAWalletTitle = this.dialog.getByText('What is a Wallet?' );
        this.getAWalletButton = this.dialog.getByRole('button', { name: 'Get a Wallet' });
        this.learnMoreLink = this.dialog.getByRole('link', { name: 'Learn More' });
    }

    async waitForOpen(timeout = 5000) {
        await this.dialog.waitFor({ state: 'visible', timeout });
    }

    async isOpen() {
        return await this.dialog.isVisible();
    }

    async acceptTosModal(timeout = 5000) {
        await this.tosDialog.waitFor({ state: 'visible', timeout });
        await this.tosAgreeButton.click();
        await this.getAWalletButton.waitFor({ state: 'visible' });
    }

    async close() {
        await this.closeIcon.click();
    }
}

export default ConnectWalletModal;
