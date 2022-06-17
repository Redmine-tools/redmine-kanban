import { test, expect } from '@playwright/test';
import { LoginPage  } from './LoginPage';

test.beforeEach(async ({ page }) => {
  await new LoginPage(page).goto();
});

test('should login with username and password', async ({ page }) => {
  const loginPage = new LoginPage(page);

  //Fill the usename and password inputs and press the button
  await loginPage.loginUsernamePassword('kobor.levente', 'bookMonkeyBeerShirtFood9', 'Login');

  //Make sure the user successfully loged in
  await loginPage.expectLogin('Kanban board configuration');
});