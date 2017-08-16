import { AppfoodPage } from './app.po';

describe('appfood App', function() {
  let page: AppfoodPage;

  beforeEach(() => {
    page = new AppfoodPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
