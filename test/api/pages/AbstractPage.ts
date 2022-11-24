import { expect, Locator, Page } from '@playwright/test';

export class AbstractPage {

    readonly page: Page;
    readonly url?: string;
    readonly atChecker?: Locator;

    constructor(pageInit: Page, urlInit?: string, atChecker?: Locator) {
        this.page = pageInit;
        this.url = urlInit;
        this.atChecker = atChecker
    }

    async goto() {
        if (this.url) {
            await this.page.goto(this.url);
        }
    }

    async at() {
        if (this.url) {
            await expect(this.page).toHaveURL(this.url);
        }
        if (this.atChecker) {
            await expect(this.atChecker).toBeVisible();
        }
    }

}