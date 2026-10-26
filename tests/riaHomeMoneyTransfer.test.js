const { expect } = require('chai');
const RiaHomePage = require('../pages/RiaHomePage');

describe('Ria Money Transfer', function () {
  it('navigates to the home page', async function () {
    const riaHomePage = new RiaHomePage(this.driver);
    await riaHomePage.load();

    expect(await riaHomePage.getCurrentUrl()).to.contain('riamoneytransfer.com');
    expect(await riaHomePage.getTitle()).to.match(/ria/i);
  });

  it('changes the amount from 100000 to 25000', async function () {
    const riaHomePage = new RiaHomePage(this.driver);
    await riaHomePage.load();
    await riaHomePage.acceptCookies();

    expect(await riaHomePage.getAmountFrom()).to.equal('100,000'); //waits until 100000 is visible

    await riaHomePage.setAmountFrom(25000);//changes sender amount to 25000
    
    //await this.driver.sleep(3000);
    

    expect((await riaHomePage.getAmountFrom()).replace(/,/g, '')).to.equal('25000');//verifica que el envio sea 25000

    const amountToBefore = await riaHomePage.getAmountTo();
    await riaHomePage.selectDestination('Haiti', 'HTG');//set the receiver country
    await this.driver.wait(async () => (await riaHomePage.getReceiveCurrency()) === 'HTG', 10000);
    expect(await riaHomePage.getReceiveCurrency()).to.equal('HTG');//verify the receiver currency is HTG
    await this.driver.wait(async () => (await riaHomePage.getAmountTo()) !== amountToBefore, 10000);
    expect(await riaHomePage.getAmountTo()).to.not.equal(amountToBefore);//verify the receiver amount changed with the currency
    
    //await this.driver.sleep(3000);
  });

  it('changes the amount from 100000 to 0', async function () {
    const riaHomePage = new RiaHomePage(this.driver);
    await riaHomePage.load();
    await riaHomePage.acceptCookies();

    expect(await riaHomePage.getAmountFrom()).to.equal('100,000'); //waits until the amount from field is loaded and shows 100,000
    await riaHomePage.setAmountFrom(0);//changes the amount to 0

    expect(await riaHomePage.getAmountFrom()).to.equal('0');
    expect(await riaHomePage.getAmountError()).to.equal('Minimum is 1 CLP');//verify the minimum error message

    await riaHomePage.selectDestination('Haiti', 'HTG');//set receiver country
    await this.driver.wait(async () => (await riaHomePage.getReceiveCurrency()) === 'HTG', 10000);
    expect(await riaHomePage.getReceiveCurrency()).to.equal('HTG');//verify receiver currency is HTG
    
    //await this.driver.sleep(3000);
  });

  it('send ....,,,,...,  and shows no error', async function () {
    const riaHomePage = new RiaHomePage(this.driver);
    await riaHomePage.load();
    await riaHomePage.acceptCookies();

    expect(await riaHomePage.getAmountFrom()).to.equal('100,000');
    const amountToBefore = await riaHomePage.getAmountTo();
    await riaHomePage.setAmountFrom('....,,,,...,,,,.'); //set ammount with non numerical characters
    
    await this.driver.sleep(3000);
   
    expect(await riaHomePage.getAmountFrom()).to.equal('....,,,,...,,,,.');//should appear a error message?
    expect(await riaHomePage.getAmountTo()).to.equal(amountToBefore);
    expect(await riaHomePage.isAmountErrorDisplayed()).to.equal(false);

    await riaHomePage.selectDestination('Haiti', 'HTG');//set the receiver country
    await this.driver.wait(async () => (await riaHomePage.getReceiveCurrency()) === 'HTG', 10000);
    expect(await riaHomePage.getReceiveCurrency()).to.equal('HTG');//verify the receiver currency is HTG
    
    await this.driver.sleep(3000);
  });

  
});
