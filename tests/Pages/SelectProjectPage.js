const { expect } = require('@playwright/test');

exports.SelectProjectPage = class SelectProjectPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.nameLabel = page.locator('div.info > span.large-text');
    }

    async at() {
        await expect(this.nameLabel).toBeVisible();
    }

    async checkName(name) {
        await expect(this.nameLabel).toHaveText(name);
    }
}