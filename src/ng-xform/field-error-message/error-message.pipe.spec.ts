import { ErrorMessagePipe } from './error-message.pipe';

describe('ErrorMessagePipe', () => {
  it('create an instance', () => {
    const pipe = new ErrorMessagePipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform message', () => {
    const pipe = new ErrorMessagePipe();

    let nullMessage = pipe.transform(null);
    expect(nullMessage).toBe('');

    let requiredMessage = pipe.transform({ 'required': null });
    expect(requiredMessage).toBe('Required');

    let minLenMessage = pipe.transform({ 'minlength': {'requiredLength': 10} });
    expect(minLenMessage).toBe('Field must have at least 10 characteres');
  });
});
