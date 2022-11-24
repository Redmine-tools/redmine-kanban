import { test, expect } from '@playwright/test';
import { Munkatars } from '../api/dto/munkatars';
import { LoginPage } from '../api/pages/LoginPage';
import { SetupPage } from '../api/pages/SetupPage';

const tester = new Munkatars('tester001', 'almaALMA01', '68471da69b2bd619f1386555a24395f0ee08d328');


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
    await loginPage.loginUsernamePassword(tester.username, tester.password);
  
    //Make sure the user successfully loged in
    const setupPage = new SetupPage(page)
    await setupPage.at();
  });
  
  test('should login with api key', async ({ page }) => {
    const loginPage = new LoginPage(page);
  
    //Fill the api key input with the api key
    await loginPage.loginApiKey(tester.apiKey);
  
    //Make sure the user successfully loged in
    const setupPage = new SetupPage(page)
    await setupPage.at();
  });
});

test.describe('setup feature', () => {

  test.beforeEach(async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.loginApiKey(tester.apiKey);
  });

  test('select the project', async ({ page }) => {
    const setupPage = new SetupPage(page);
  
    await setupPage.at();

    const queryName = 'version 1';
    await setupPage.setupConfiguration ('the', 'The Cool Kanban Board', queryName);

    await expect(page.getByRole('heading', { name: queryName })).toBeVisible();

  });
});