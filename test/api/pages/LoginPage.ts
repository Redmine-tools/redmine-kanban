import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly apiKeyLink: Locator;
    readonly apiKeyInput: Locator;
    readonly loginButton: Locator;
    readonly setupTitle: Locator;
    readonly logoutButton: Locator;

    constructor(readonly page: Page) {
        this.usernameInput = page.locator('[aria-label="Username"]');
        this.passwordInput = page.locator('[aria-label="Password"]');
        this.apiKeyLink = page.locator('button:has-text("api key")');
        this.apiKeyInput = page.locator('[aria-label="api key"]');
        this.loginButton = page.locator('button:has-text("Login")');
        this.setupTitle = page.locator('h1:has-text("Kanban board configuration")');
        this.logoutButton = page.locator('button:has-text("Logout")');
    }

    async goto() {
        await this.page.goto('/');
    }

    async logout(button) {
        await this.logoutButton.click(button);
    }

    async loginUsernamePassword(username, password, button) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click(button);
    }

    async loginApiKey(apikey, button) {
        await this.apiKeyInput.fill(apikey);
        await this.loginButton.click(button);
    }

    async expectLogin(title) {
        await expect(this.setupTitle).toHaveText(title);
    }

}