import { Locator, type Page } from "@playwright/test";

/**
 * Page object for the Connect Wallet modal.
 *
 * The modal presents a list of wallet options to connect with,
 * as well as an informational section about what a wallet is.
 */
class ConnectWalletModal {
    readonly page: Page;
    readonly dialog: Locator; // dialog element with role=dialog
    readonly cancelButton: Locator; // "Cancel" button
    readonly agreeAndProcedButton: Locator; // "Agree and proceed" button
    readonly closeIcon: Locator; // svg close icon (clickable)
    readonly title: Locator;

    // "What is a Wallet?" Section
    readonly whatIsAWalletTitle: Locator;
    readonly getAWalletButton: Locator;
    readonly learnMoreLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // The modal is a dialog element.
        // FIX: Changed the name from 'Connect a Wallet' to 'Connect Wallet' to match the updated UI.
        this.dialog = page.getByRole('dialog');

        // "Cancel" button at the bottom of the modal
        this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });

        // "Agree and proceed" button at the bottom of the modal
        this.agreeAndProcedButton = this.dialog.getByRole('button', { name: 'Agree And Proceed' });

        // Close icon is a button with aria-label="Close"
        this.closeIcon = this.dialog.locator('.absolute > path');

        // Main title of the modal
        this.title = this.dialog.getByText('Connect a Wallet' );

        // --- "What is a Wallet?" Section ---
        this.whatIsAWalletTitle = this.dialog.getByText('What is a Wallet?' );
        this.getAWalletButton = this.dialog.getByRole('button', { name: 'Get a Wallet' });
        this.learnMoreLink = this.dialog.getByRole('link', { name: 'Learn More' });
    }

    /** Waits for the modal to be visible/open */
    async waitForOpen(timeout = 5000) {
        await this.dialog.waitFor({ state: 'visible', timeout });
    }

    /** Returns true if the modal is currently open/visible */
    async isOpen() {
        return await this.dialog.isVisible();
    }

    /** Click the close icon (top-right) */
    async close() {
        await this.closeIcon.click();
    }
}

export default ConnectWalletModal;