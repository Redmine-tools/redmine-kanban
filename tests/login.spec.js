const { test } = require('@playwright/test');
const { LoginPage } = require('./Pages/LoginPage');
const { SelectProjectPage } = require('./Pages/SelectProjectPage');
var config = require('./config.json');

test('Successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(config.apiKey);

  const selectProjectPage = new SelectProjectPage(page);
  await selectProjectPage.at();
  await selectProjectPage.checkName(config.userName);
});