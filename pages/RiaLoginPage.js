const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

const LOGIN_URL = 'https://secure.riamoneytransfer.com/login';

class RiaLoginPage extends BasePage {
  allowAllCookies = By.xpath("//button[normalize-space()='Allow all cookies']");
  phoneOrEmailField = By.css('input[autocomplete="username"]');
  passwordField = By.css('input[type="password"][autocomplete="current-password"]');
  registerLink = By.css('a[href="/registration"]');

  async isRegisterLinkDisplayed() {
    return this.isDisplayed(this.registerLink);
  }

  async isPhoneOrEmailFieldDisplayed() {
    return this.isDisplayed(this.phoneOrEmailField);
  }

  async isPasswordFieldDisplayed() {
    return this.isDisplayed(this.passwordField);
  }

  async load() {
    await this.driver.get(LOGIN_URL);
  }

  async allowAllCookiesClick() {
    await this.click(this.allowAllCookies);
  }

  async isCookieBannerClosed() {
    const buttons = await this.driver.findElements(this.allowAllCookies);
    for (const button of buttons) {
      if (await button.isDisplayed()) return false;
    }
    return true;
  }
}

module.exports = RiaLoginPage;
