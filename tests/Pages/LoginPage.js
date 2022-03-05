const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {

    async at() {
        await expect(page.locator('input#api-token')).toBeVisible();
        await expect(page.locator('button:has-text("Bejelentkezés")')).toBeVisible();
    }

    async goto() {
        await page.goto('http://localhost:8080/');
    }

    async login(apiKey) {
        await page.locator('input#api-token').fill(apiKey);
        await page.locator('button:has-text("Bejelentkezés")').click();
    }

    async errorPopupMessageIsDisplayed() {
        await expect(page.locator('#errorToast')).toBeVisible();
    }
}