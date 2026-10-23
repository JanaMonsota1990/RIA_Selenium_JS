const { By, Key, until } = require('selenium-webdriver');
const config = require('../config/config');
const BasePage = require('./BasePage');

const RIA_URL = 'https://www.riamoneytransfer.com/';

class RiaHomePage extends BasePage {
  amountForm = By.id('amount-form');
  amountFrom = By.id('amount-from');
  cookiePreferences = By.xpath("//button[normalize-space()='Cookie preferences']");
  acceptAllCookies = By.xpath("//button[normalize-space()='Accept All']");

  async acceptCookies() {
    const preferences = await this.driver.wait(until.elementLocated(this.cookiePreferences), config.timeout);
    await this.driver.executeScript('arguments[0].click();', preferences);
    await this.click(this.acceptAllCookies);
  }

  async isCookiePanelClosed() {
    const buttons = await this.driver.findElements(this.acceptAllCookies);
    for (const button of buttons) {
      if (await button.isDisplayed()) return false;
    }
    return true;
  }

  async setAmountFrom(value) {
    const input = await this.find(this.amountFrom);
    await input.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
    await input.sendKeys(String(value));
  }

  async getAmountFrom() {
    return (await this.find(this.amountFrom)).getAttribute('value');
  }

  async load() {
    await this.driver.get(RIA_URL);
    await this.driver.wait(async () => !/just a moment/i.test(await this.driver.getTitle()), 30000);
  }

  async hoverAmountForm() {
    const element = await this.find(this.amountForm);
    await this.driver.executeScript('arguments[0].scrollIntoView({ block: "center" });', element);
    await this.driver.actions({ async: true }).move({ origin: element }).perform();
    return element;
  }

  async isHovered(element) {
    return this.driver.executeScript('return arguments[0].matches(":hover");', element);
  }

  async getTitle() {
    return this.driver.getTitle();
  }
}

module.exports = RiaHomePage;
