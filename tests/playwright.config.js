// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  use: {
    browserName: 'chromium',
    headless: false,
    actionTimeout: 10000
  },
};

module.exports = config;