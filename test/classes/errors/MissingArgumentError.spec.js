const MissingArgumentError = require('../../../src/classes/errors/MissingArgumentError');

describe('Classes - Errors - MissingArgumentError', () => {
  it('should be instance of Error.', () => {
    expect(new MissingArgumentError()).toBeInstanceOf(Error);
  });

  it('should have MissingArgumentError name property.', () => {
    expect(new MissingArgumentError().name).toBe('MissingArgumentError');
  });

  it('should contain a message.', () => {
    const message = 'Oops';
    expect(new MissingArgumentError(message).message).toBe(message);
  });

  it('should have a stack trace.', () => {
    try {
      throw new MissingArgumentError('Oops');
    } catch (err) {
      expect(err.stack).toBeTruthy();
    }
  });
});
