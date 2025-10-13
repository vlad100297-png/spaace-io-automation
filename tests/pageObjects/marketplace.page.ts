import { Locator, type Page } from "@playwright/test";
import BasePage from "./basePage";
import Header from "./components/header";
import ConnectWalletModal from "./components/connectWalletModal";


class MarketplacePage extends BasePage {
    path: string = '/';
    readonly header: Header;
    readonly modal: ConnectWalletModal;

    constructor(page: Page) {
        super(page);
        this.header = new Header(page)
        this.modal = new ConnectWalletModal(page);
    }

    static async init(page: Page) {
        return new MarketplacePage(page);
    }
}

export default MarketplacePage;
