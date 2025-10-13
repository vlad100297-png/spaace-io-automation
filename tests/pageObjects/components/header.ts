import { Locator, type Page } from "@playwright/test";

/**
 * Represents the global header component of the application.
 */
class Header {
    readonly page: Page;
    readonly headerContainer: Locator;
    readonly logoLink: Locator;
    readonly sellNowLink: Locator;
    readonly collectionsLink: Locator;
    readonly rewardsDropdown: Locator;
    readonly referralsLink: Locator;
    readonly battlePassLink: Locator;
    readonly ogRewardsLink: Locator;
    readonly stakingLink: Locator;
    readonly cashbackLink: Locator;
    readonly searchInput: Locator;
    readonly connectWalletButton: Locator;
    readonly mobileSearchButton: Locator;
    readonly mobileMenuButton: Locator;
    readonly bannerText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.headerContainer = page.locator('header.sticky');
        this.logoLink = this.headerContainer.locator('a[href="/"]').first();
        
        // Navigation Links
        this.sellNowLink = this.headerContainer.getByRole('list').getByText('Sell Now')
        this.collectionsLink = this.headerContainer.getByRole('list').getByText('Collections');
        this.rewardsDropdown = this.headerContainer.getByRole('list').getByText('Rewards', { exact: true }).locator('..').first();
        
        // Rewards Dropdown Items (assuming the dropdown is open or can be opened)
        this.referralsLink = this.headerContainer.getByRole('link', { name: 'Referrals' });
        this.battlePassLink = this.headerContainer.getByRole('link', { name: 'Battle Pass' }).first();
        this.ogRewardsLink = this.headerContainer.getByRole('link', { name: 'OG Rewards' });
        this.stakingLink = this.headerContainer.getByRole('link', { name: 'Staking' });
        this.cashbackLink = this.headerContainer.getByRole('link', { name: 'Cashback' });

        // Search and Buttons
        this.searchInput = this.headerContainer.getByPlaceholder('Search collections');
        this.connectWalletButton = this.headerContainer.getByRole('button', { name: 'Connect Wallet' });
        
        // Mobile/Tablet Buttons (using specific classes for visibility)
        this.mobileSearchButton = this.headerContainer.locator('div.9inch\\:hidden').filter({ has: page.locator('svg[viewBox="0 0 24 24"]').first() });
        this.mobileMenuButton = this.headerContainer.locator('div.block.lg\\:hidden').filter({ has: page.locator('svg[viewBox="0 0 24 24"]').last() });

        // Beta Banner
        this.bannerText = this.headerContainer.getByText('Check your wallet for OG')
    }
    
    /**
     * Clicks the Rewards dropdown to open/close it.
     */
    async clickRewardsDropdown() {
        await this.rewardsDropdown.click();
    }
}

export default Header;