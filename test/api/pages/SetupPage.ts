import { expect, Locator, Page } from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class SetupPage extends AbstractPage {
    readonly projectSelector: Locator;
    readonly querySelector: Locator;
    readonly proceedButton: Locator;

    constructor (page: Page) {
        super(page, '/setup', page.locator('h1:has-text("Kanban board configuration")'));
        this.projectSelector = page.locator('[aria-label="Project"]');
        this.querySelector = page.locator('[aria-label="Query"]');
        this.proceedButton = page.locator('button:has-text("Proceed")');
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

    async setupConfiguration (searchString, option, query) {
        await this.projectSelector.type(searchString);
        await this.page.getByRole('option', { name: option }).click();

        await this.querySelector.click(query);
        await this.page.getByRole('option', { name: query }).click();

        await this.proceedButton.click();
    }

}