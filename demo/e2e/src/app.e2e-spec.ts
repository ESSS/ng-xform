import { NgXformDemoPage } from './app.po';

describe('ng-xform-demo App', () => {
  let page: NgXformDemoPage;

  beforeEach(() => {
    page = new NgXformDemoPage ();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
