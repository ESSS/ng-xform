import { EsssNgXformDemoPage } from './app.po';

describe('@esss/ng-xform-demo App', () => {
  let page: EsssNgXformDemoPage;

  beforeEach(() => {
    page = new EsssNgXformDemoPage ();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
