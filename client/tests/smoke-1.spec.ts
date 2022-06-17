import { test, expect } from '@playwright/test';
import { LoginPage  } from './LoginPage';

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