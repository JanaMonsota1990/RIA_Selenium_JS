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

    expect(await riaHomePage.getAmountFrom()).to.equal('100,000'); //espera a que el campo de monto de envio este cargado y se vean los 100000
    await riaHomePage.setAmountFrom(25000);//cambia el monto de envio a 25000
    
    //await this.driver.sleep(3000);
    

    expect((await riaHomePage.getAmountFrom()).replace(/,/g, '')).to.equal('25000');//verifica que el envio sea 25000

    await riaHomePage.selectDestination('Haiti', 'HTG');//set el pais receptor 
    await this.driver.wait(async () => (await riaHomePage.getReceiveCurrency()) === 'HTG', 10000);
    expect(await riaHomePage.getReceiveCurrency()).to.equal('HTG');//verifica que el receptor sea HTG
    
    //await this.driver.sleep(3000);
  });

  it('changes the amount from 100000 to 0', async function () {
    const riaHomePage = new RiaHomePage(this.driver);
    await riaHomePage.load();
    await riaHomePage.acceptCookies();

    expect(await riaHomePage.getAmountFrom()).to.equal('100,000'); //espera a que el campo de monto de envio este cargado y se vean los 100000
    await riaHomePage.setAmountFrom(0);//cambia el monto de envio a 0

    expect(await riaHomePage.getAmountFrom()).to.equal('0');
    expect(await riaHomePage.getAmountError()).to.equal('Minimum is 1 CLP');//verifica el mensaje de error del minimo

    await riaHomePage.selectDestination('Haiti', 'HTG');//set el pais receptor 
    await this.driver.wait(async () => (await riaHomePage.getReceiveCurrency()) === 'HTG', 10000);
    expect(await riaHomePage.getReceiveCurrency()).to.equal('HTG');//verifica que el receptor sea HTG
    
    //await this.driver.sleep(3000);
  });

  it('send ....,,,,...,  and shows no error', async function () {
    const riaHomePage = new RiaHomePage(this.driver);
    await riaHomePage.load();
    await riaHomePage.acceptCookies();

    expect(await riaHomePage.getAmountFrom()).to.equal('100,000');
    const amountToBefore = await riaHomePage.getAmountTo();
    await riaHomePage.setAmountFrom('....,,,,...,,,,.');
    
    await this.driver.sleep(3000);
   
    expect(await riaHomePage.getAmountFrom()).to.equal('....,,,,...,,,,.');
    expect(await riaHomePage.getAmountTo()).to.equal(amountToBefore);
    expect(await riaHomePage.isAmountErrorDisplayed()).to.equal(false);

    await riaHomePage.selectDestination('Haiti', 'HTG');//set el pais receptor 
    await this.driver.wait(async () => (await riaHomePage.getReceiveCurrency()) === 'HTG', 10000);
    expect(await riaHomePage.getReceiveCurrency()).to.equal('HTG');//verifica que el receptor sea HTG
    
    await this.driver.sleep(3000);
  });

  
});
