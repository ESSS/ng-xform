import { browser, element, by } from 'protractor';

export class NgXformHomePage {
  navigateTo() {
    return browser.get('/home');
  }

  getNgXformTitleText() {
    return element(by.css('h1')).getText();
  }

  getInputLength() {
    return element(by.id('length'));
  }
}
