import { expect, Locator, Page } from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class LoginPage extends AbstractPage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly apiKeyLink: Locator;
    readonly apiKeyInput: Locator;
    readonly loginButton: Locator;
    readonly logoutButton: Locator;

    constructor(readonly page: Page) {
        super(page, '/', page.locator('button:has-text("api key")'));
        this.usernameInput = page.locator('[aria-label="Username"]');
        this.passwordInput = page.locator('[aria-label="Password"]');
        this.apiKeyLink = page.locator('button:has-text("api key")');
        this.apiKeyInput = page.locator('[aria-label="api key"]');
        this.loginButton = page.locator('button:has-text("Login")');
        this.logoutButton = page.locator('button:has-text("Logout")');
    }

    async logout(button) {
        await this.logoutButton.click(button);
    }

    async loginUsernamePassword(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async loginApiKey(apikey) {
        await this.apiKeyInput.fill(apikey);
        await this.loginButton.click();
    }

}