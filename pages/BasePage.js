const { until } = require('selenium-webdriver');
const config = require('../config/config');

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async open(path = '') {
    await this.driver.get(`${config.baseUrl}${path}`);
  }

  async find(locator) {
    const element = await this.driver.wait(until.elementLocated(locator), config.timeout);
    await this.driver.wait(until.elementIsVisible(element), config.timeout);
    return element;
  }

  async click(locator) {
    const element = await this.find(locator);
    await element.click();
  }

  async type(locator, text) {
    const element = await this.find(locator);
    await element.clear();
    await element.sendKeys(text);
  }

  async getText(locator) {
    return (await this.find(locator)).getText();
  }

  async isDisplayed(locator) {
    try {
      return await (await this.find(locator)).isDisplayed();
    } catch {
      return false;
    }
  }

  async getCurrentUrl() {
    return this.driver.getCurrentUrl();
  }
}

module.exports = BasePage;
