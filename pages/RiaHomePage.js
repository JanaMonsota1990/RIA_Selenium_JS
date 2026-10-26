const { By, Key, until } = require('selenium-webdriver');
const config = require('../config/config');
const BasePage = require('./BasePage');

const RIA_URL = 'https://www.riamoneytransfer.com/';

class RiaHomePage extends BasePage {
  amountForm = By.id('amount-form');
  amountFrom = By.id('amount-from');
  amountTo = By.id('amount-to');
  amountError = By.id('amount-error');
  destinationButton = By.css('button[aria-label="Select Destination"]');
  receiveCurrency = By.xpath("//p[normalize-space()='They receive']/following::button[@data-slot='dialog-trigger'][1]/span");
  destinationOption = (country) =>
    By.xpath(`//div[@role='dialog'][@data-state='open']//button[@role='option'][.//span[normalize-space()='${country}']]`);
  currencyOption = (currency) =>
    By.xpath(`//div[@role='dialog'][@data-state='open']//div[@aria-hidden='false']//button[.//*[normalize-space()='${currency}']]`);
  cookiePreferences = By.xpath("//button[normalize-space()='Cookie preferences']");
  acceptAllCookies = By.xpath("//button[normalize-space()='Accept All']");

  async acceptCookies() {
    let preferences;
    try {
      preferences = await this.driver.wait(until.elementLocated(this.cookiePreferences), config.timeout);
    } catch (error) {
      if (error.name !== 'TimeoutError') throw error;
      return;
    }
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
    await this.waitForAmountToSettle(value);
  }

  async waitForAmountToSettle(expected) {
    await this.driver.wait(
      async () => (await this.getAmountFrom()).replace(/,/g, '') === String(expected).replace(/,/g, ''),
      config.timeout
    );

    // The quote recalculates asynchronously: wait until "They receive" stops changing.
    let previous = await this.getAmountTo();
    let stableSince = Date.now();
    await this.driver.wait(async () => {
      const current = await this.getAmountTo();
      if (current !== previous) {
        previous = current;
        stableSince = Date.now();
        return false;
      }
      return Date.now() - stableSince >= 500;
    }, config.timeout);
  }

  async getAmountError() {
    return this.getText(this.amountError);
  }

  async isAmountErrorDisplayed() {
    const errors = await this.driver.findElements(this.amountError);
    for (const error of errors) {
      if (await error.isDisplayed()) return true;
    }
    return false;
  }

  async getAmountTo() {
    return (await this.find(this.amountTo)).getAttribute('value');
  }

  async selectDestination(country, currency) {
    await this.click(this.destinationButton);
    await this.click(this.destinationOption(country));
    await this.click(this.currencyOption(currency));
  }

  async getReceiveCurrency() {
    return this.getText(this.receiveCurrency);
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
