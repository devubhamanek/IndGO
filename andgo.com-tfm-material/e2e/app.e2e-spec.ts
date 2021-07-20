import { AndgoComPage } from './app.po';

describe('andgo-com App', () => {
  let page: AndgoComPage;

  beforeEach(() => {
    page = new AndgoComPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
