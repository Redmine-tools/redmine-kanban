const { BeforeAll, Before, AfterAll, After } = require("@cucumber/cucumber");
const { chromium } = require('playwright');
const fs = require('fs')
var path = require('path');

BeforeAll(async () => {
    global.browser = await chromium.launch({ headless: false });
});

AfterAll(async () => {
    await global.browser.close();
});

Before(async (scenario) => {
    global.context = await global.browser.newContext();
    global.page = await global.context.newPage();
});

After(async () => {
    await global.page.close();
    //global.context.close();
});
