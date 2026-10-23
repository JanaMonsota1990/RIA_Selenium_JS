const fs = require('fs');
const path = require('path');
const { createDriver } = require('../utils/driverFactory');

exports.mochaHooks = {
  async beforeEach() {
    this.driver = await createDriver();
  },

  async afterEach() {
    if (this.currentTest.state === 'failed') {
      const dir = path.join(__dirname, '..', 'screenshots');
      fs.mkdirSync(dir, { recursive: true });
      const image = await this.driver.takeScreenshot();
      const name = this.currentTest.title.replace(/\W+/g, '_');
      fs.writeFileSync(path.join(dir, `${name}.png`), image, 'base64');
    }
    await this.driver.quit();
  },
};
