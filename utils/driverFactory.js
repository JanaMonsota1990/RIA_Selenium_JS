const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const config = require('../config/config');

async function createDriver() {
  const chromeOptions = new chrome.Options();
  const firefoxOptions = new firefox.Options();
  if (config.headless) {
    chromeOptions.addArguments('--headless=new');
    firefoxOptions.addArguments('-headless');
  }

  const driver = await new Builder()
    .forBrowser(config.browser)
    .setChromeOptions(chromeOptions)
    .setFirefoxOptions(firefoxOptions)
    .build();

  await driver.manage().window().maximize();
  return driver;
}

module.exports = { createDriver };
