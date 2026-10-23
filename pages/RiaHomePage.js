const BasePage = require('./BasePage');

const RIA_URL = 'https://www.riamoneytransfer.com/';

class RiaHomePage extends BasePage {
  async load() {
    await this.driver.get(RIA_URL);
  }

  async getTitle() {
    return this.driver.getTitle();
  }
}

module.exports = RiaHomePage;
