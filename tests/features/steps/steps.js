const { Given, When, Then } = require("@cucumber/cucumber");
const { LoginPage } = require("../../Pages/LoginPage");
const loginPage = new LoginPage();
var config = require('../../config.json');

Given("the login page is loaded", async () => {
  await loginPage.goto();
  await loginPage.at();
});

When("user {string} logs in", async (userName) => {
  var user = config.users.filter(function (item) { return item.userName == userName })[0];
  await loginPage.login(user.apiKey);
});

When("a user with wrong API key logs in", async () => {
  await loginPage.login("0000");
});

Then('a login error message appears', async () => {
  await loginPage.errorPopupMessageIsDisplayed();
});