import { test, expect } from '@playwright/test';
import { LoginPage  } from './LoginPage';
import { SetupPage } from './SetupPage';

test.describe('login feature', () => {
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).goto();
  });
  
  test.afterEach(async ({ page }) => {
    await new LoginPage(page).logout('Logout');
  });

  test('should login with username and password', async ({ page }) => {

    const loginPage = new LoginPage(page);
  
    //Fill the usename and password inputs and press the button
    await loginPage.loginUsernamePassword('kobor.levente', 'bookMonkeyBeerShirtFood9', 'Login');
  
    //Make sure the user successfully loged in
    await loginPage.expectLogin('Kanban board configuration');
  });
  
  test('should login with api key', async ({ page }) => {
    const loginPage = new LoginPage(page);
  
    //Fill the api key input with the api key
    await loginPage.loginApiKey('975aad20b8ee01cda1527d3daa53074594572365', 'Login');
  
    //Make sure the user successfully loged in
    await loginPage.expectLogin('Kanban board configuration');
  });
});

test.describe('setup feature', () => {

  test.beforeEach(async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.loginUsernamePassword('kobor.levente', 'bookMonkeyBeerShirtFood9', 'Login');
  });

  test('select the project', async ({ page }) => {
    const setupPage = new SetupPage(page);
  
    //Wait to load the setup page
    await Promise.all([
      page.waitForNavigation({ url: 'http://localhost:8080/setup' })
    ]);
  
    //Select the project by searching for it
    /*await setupPage.selectProject('the', 'the cool kanban board');

    await setupPage.selectQuery('version 1');

    await setupPage.proceedToNextPage('Proceed');*/

    await setupPage.setupConfiguration ('the', 'the cool kanban board', 'version 1', 'Proceed');

    await setupPage.expectKanban('version 1');
  });
});