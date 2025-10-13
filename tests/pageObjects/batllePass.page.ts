import { type Page } from "@playwright/test";
import BasePage from "./basePage";
import Header from "./components/header";
import ConnectWalletModal from "./components/connectWalletModal";


class BatllePassPage extends BasePage {
    path: string = '/battle-pass/home';
    readonly header: Header;
    readonly modal: ConnectWalletModal;

    constructor(page: Page) {
        super(page);
        this.header = new Header(page);
        this.modal = new ConnectWalletModal(page);
    }

    static async init(page: Page) {
        return new BatllePassPage(page);
    }
}

export default BatllePassPage; 