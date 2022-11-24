import { expect, Locator, Page } from '@playwright/test';

export class SetupPage {
    readonly projectSelector: Locator;
    readonly querySelector: Locator;
    readonly proceedButton: Locator;
    readonly projectText: Locator;
    readonly queryText: Locator;
    readonly kanbanTitle: Locator;

    constructor (readonly page: Page) {
        this.projectSelector = page.locator('[aria-label="Project"]');
        this.querySelector = page.locator('[aria-label="Query"]');
        this.proceedButton = page.locator('button:has-text("Proceed")');
        this.projectText = page.locator('span:has-text("the cool kanban board")');
        this.queryText = page.locator('span:has-text("version 1")');
        this.kanbanTitle = page.locator('h1:has-text("version 1")');
    }

    /*async selectProject(project, option) {
        await this.projectSelector.fill(option);
        await this.projectSelector.click(project);
        await this.projectText.click();
    }

    async selectQuery(query) {
        await this.querySelector.click(query);
        await this.queryText.click();
    }

    async proceedToNextPage(button) {
        await this.proceedButton.click(button);
    }*/

    async setupConfiguration (project, option, query, button) {
        await this.projectSelector.fill(option);
        await this.projectSelector.click(project);
        await this.projectText.click();

        await this.querySelector.click(query);
        await this.queryText.click();

        await this.proceedButton.click(button);
    }

    async expectKanban(title) {
        await expect(this.kanbanTitle).toHaveText(title);
    }

}