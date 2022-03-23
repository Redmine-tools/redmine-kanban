//import { baseUrl, apiKey } from './config';

const { test, expect } = require('@playwright/test');

const baseUrl = "http://localhost:8080/";

test('login with API key', async ({ page }) => {
  await page.goto(baseUrl);

  // Expect a title "to contain" a substring.
  await expect(page.locator('h1')).toHaveText('Login');

  // Expect an attribute "to be strictly equal" to the value.
  const apiKeyInputField = page.locator('xpath=/html/body/div/div/section/form/div/label[3]/div/div/div[1]/input');
  await expect(apiKeyInputField).toHaveAttribute('name', 'api-token');

  await apiKeyInputField.type('975aad20b8ee01cda1527d3daa53074594572365');

  const loginBtn = page.locator('button:has-text("Login")');
  await loginBtn.click();
  // Expect some text to be visible on the page.
  //await expect(page.locator('text=Introduction').first()).toBeVisible();
});