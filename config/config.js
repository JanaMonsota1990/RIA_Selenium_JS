require('dotenv').config();

module.exports = {
  baseUrl: process.env.BASE_URL || 'https://www.riamoneytransfer.com',
  browser: process.env.BROWSER || 'chrome',
  headless: process.env.HEADLESS === 'true',
  timeout: 10000,
};
