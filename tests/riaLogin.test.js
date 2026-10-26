const { expect } = require('chai');
const RiaLoginPage = require('../pages/RiaLoginPage');

describe('Ria Login', function () {
  it('login page register, phone or email and password fields are displayed', async function () {
    const riaLoginPage = new RiaLoginPage(this.driver);
    await riaLoginPage.load(); //goes to https://secure.riamoneytransfer.com/login

    await riaLoginPage.allowAllCookiesClick();

    await this.driver.wait(async () => riaLoginPage.isCookieBannerClosed(), 10000);
    expect(await riaLoginPage.isCookieBannerClosed()).to.equal(true);

    expect(await riaLoginPage.isPhoneOrEmailFieldDisplayed()).to.equal(true); //"Phone or email" field is present
    expect(await riaLoginPage.isPasswordFieldDisplayed()).to.equal(true); //"Password" field is present
    expect(await riaLoginPage.isRegisterLinkDisplayed()).to.equal(true); //"Register" link is present
  });
});
