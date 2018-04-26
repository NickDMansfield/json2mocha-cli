require('chromedriver');
var webdriver = require('selenium-webdriver');
const assert = require('assert');
const test = require('selenium-webdriver/testing');
const until = webdriver.until;



var driver = new webdriver.Builder().
   withCapabilities(webdriver.Capabilities.chrome()).
   build();
test.describe('Searches google - loaded from a json file', function () {
  test.it('search google', function() {
    driver.sleep(750);
    driver.get('http://google.com');
    driver.sleep(750);
    driver.findElement(webdriver.By.name('q')).sendKeys('npm json2mocha');
    driver.sleep(750);
    driver.findElement(webdriver.By.name('q')).submit();
  });
});

test.describe('Looks up cat pictures', function () {
  test.it('Look up cat pictures', function() {
    driver.sleep(750);
    driver.get('http://google.com');
    driver.sleep(750);
    driver.findElement(webdriver.By.name('q')).clear();
    driver.sleep(750);
    driver.findElement(webdriver.By.name('q')).sendKeys('purrito');
    driver.sleep(750);
    driver.findElement(webdriver.By.name('q')).submit();
    driver.sleep(750);
    driver.findElement(webdriver.By.className('q qs')).click();
  });
});

