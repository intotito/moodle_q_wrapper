import { HtmlSanitizePipe } from './html-sanitize.pipe';

describe('HtmlSanitizePipe', () => {
  it('create an instance', () => {
    const pipe = new HtmlSanitizePipe();
    expect(pipe).toBeTruthy();
  });
});
