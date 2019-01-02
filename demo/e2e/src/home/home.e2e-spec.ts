import { NgXformHomePage } from './home.po';

describe('ng-xform-demo App', () => {
  let page: NgXformHomePage;

  beforeEach(() => {
    page = new NgXformHomePage ();
    page.navigateTo();
  });

  it('should display lib name', () => {
    expect(page.getNgXformTitleText()).toEqual('ng-xform');
  });

  it('should accept exponential input', () => {
    const inputEl = page.getInputLength();
    const value = '1.5e-30';
    inputEl.sendKeys(value);
    expect(inputEl.getAttribute('value')).toBe(value);
  });
});
