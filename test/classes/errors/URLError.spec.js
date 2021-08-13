const URLError = require('../../../src/classes/errors/URLError');

describe('Classes - Errors - URLError', () => {
  it('should be instance of Error.', () => {
    expect(new URLError()).toBeInstanceOf(Error);
  });

  it('should have URLError name property.', () => {
    expect(new URLError().name).toBe('URLError');
  });

  it('should contain a message.', () => {
    const message = 'Oops';
    expect(new URLError(message).message).toBe(message);
  });

  it('should have a stack trace.', () => {
    try {
      throw new URLError('Oops');
    } catch (err) {
      expect(err.stack).toBeTruthy();
    }
  });
});
