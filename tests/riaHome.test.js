const { expect } = require('chai');
const RiaHomePage = require('../pages/RiaHomePage');

describe('Ria Money Transfer', function () {
  it('navigates to the home page', async function () {
    const riaHomePage = new RiaHomePage(this.driver);
    await riaHomePage.load();

    expect(await riaHomePage.getCurrentUrl()).to.contain('riamoneytransfer.com');
    expect(await riaHomePage.getTitle()).to.match(/ria/i);
  });
});
