import { type Page } from "@playwright/test"

class BasePage {
  page: Page;
  path: string = '/';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific path relative to baseURL or full URL
   * @param {string} path
   */
  async navigate(path?: string) {
    await this.page.goto(path ?? this.path);
  }
}

export default BasePage;