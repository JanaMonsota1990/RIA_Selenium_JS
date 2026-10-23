const { expect } = require('chai');
const RiaHomePage = require('../pages/RiaHomePage');

describe('Ria Money Transfer', function () {
  it('navigates to the home page', async function () {
    const riaHomePage = new RiaHomePage(this.driver);
    await riaHomePage.load();

    expect(await riaHomePage.getCurrentUrl()).to.contain('riamoneytransfer.com');
    expect(await riaHomePage.getTitle()).to.match(/ria/i);
  });

  it('accepts the cookies', async function () {
    const riaHomePage = new RiaHomePage(this.driver);
    await riaHomePage.load();

    await riaHomePage.acceptCookies();

    expect(await riaHomePage.isCookiePanelClosed()).to.equal(true);
  });

  it('changes the amount from 100000 to 25000', async function () {
    const riaHomePage = new RiaHomePage(this.driver);
    await riaHomePage.load();

    expect(await riaHomePage.getAmountFrom()).to.equal('100,000');
    await riaHomePage.setAmountFrom(25000);

    expect((await riaHomePage.getAmountFrom()).replace(/,/g, '')).to.equal('25000');
  });

  
});
