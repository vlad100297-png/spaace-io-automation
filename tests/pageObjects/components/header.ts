import { Locator, type Page } from "@playwright/test";
import ConnectWalletModal from "./connectWalletModal";

/**
 * Represents the global header component of the application.
 */
class Header {
    readonly page: Page;
    readonly headerContainer: Locator;
    readonly logoLink: Locator;
    readonly myItemsLink: Locator;
    readonly collectionsLink: Locator;
    readonly rewardsDropdown: Locator;
    readonly referralsLink: Locator;
    readonly battlePassLink: Locator;
    readonly chestsLink: Locator;
    readonly stakingLink: Locator;
    readonly cashbackLink: Locator;
    readonly searchInput: Locator;
    readonly connectWalletButton: Locator;
    readonly mobileSearchButton: Locator;
    readonly mobileMenuButton: Locator;
    readonly betaBadge: Locator;

    constructor(page: Page) {
        this.page = page;
        this.headerContainer = page.locator('header#header');
        this.logoLink = this.headerContainer.locator('button .baseLogo__logo').first();
        
        // Navigation Links
        this.myItemsLink = this.headerContainer.getByRole('list').getByText('My items');
        this.collectionsLink = this.headerContainer.getByRole('list').getByText('Collections');
        this.rewardsDropdown = this.headerContainer.getByRole('list').getByText('Rewards', { exact: true }).first();
        
        // Rewards Dropdown Items (assuming the dropdown is open or can be opened)
        this.referralsLink = this.headerContainer.getByRole('link', { name: 'Referrals' });
        this.battlePassLink = this.headerContainer.getByRole('link', { name: 'Battle Pass' }).first();
        this.chestsLink = this.headerContainer.getByRole('link', { name: 'Chests' });
        this.stakingLink = this.headerContainer.getByRole('link', { name: 'Staking' });
        this.cashbackLink = this.headerContainer.getByRole('link', { name: 'Cashback' });

        // Search and Buttons
        this.searchInput = this.headerContainer.getByPlaceholder('Search collections');
        this.connectWalletButton = this.headerContainer.getByRole('button', { name: 'Connect Wallet' });
        
        // Mobile/Tablet Buttons (using specific classes for visibility)
        this.mobileSearchButton = this.headerContainer.locator('div.9inch\\:hidden').filter({ has: page.locator('svg[viewBox="0 0 24 24"]').first() });
        this.mobileMenuButton = this.headerContainer.locator('div.block.lg\\:hidden').filter({ has: page.locator('svg[viewBox="0 0 24 24"]').last() });

        // Beta Badge
        this.betaBadge = this.headerContainer.getByText('beta', { exact: true });
    }
    
    /**
     * Clicks the Rewards dropdown to open/close it.
     */
    async clickRewardsDropdown() {
        await this.rewardsDropdown.click();
    }

    async clickConnectWallet() {
        await this.connectWalletButton.click();
        const connectWalletModal = new ConnectWalletModal(this.page);
        await connectWalletModal.acceptTosModal();
    }
}

export default Header;
