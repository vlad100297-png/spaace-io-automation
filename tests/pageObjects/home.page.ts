import { Locator, type Page } from "@playwright/test";
import BasePage from "./basePage";


class HomePage extends BasePage {
    path: string = '/';

    connectWalletButton: Locator = this.page.getByRole('button', { name: 'Connect Wallet' });
    dialog: Locator = this.page.getByRole('dialog');
    agreeAndProcedButton: Locator = this.page.getByRole('button', { name: 'Agree and proceed' });
    goToYourWalletBox: Locator = this.page.getByText('Please go to your wallet and sign');

    constructor(page: Page) {
        super(page);
    }

    static async init(page: Page) {
        return new HomePage(page);
    }
}

export default HomePage;
