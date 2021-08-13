const VoiceChannelError = require('../../../src/classes/errors/VoiceChannelError');

describe('Classes - Errors - VoiceChannelError', () => {
  it('should be instance of Error.', () => {
    expect(new VoiceChannelError()).toBeInstanceOf(Error);
  });

  it('should have VoiceChannelError name property.', () => {
    expect(new VoiceChannelError().name).toBe('VoiceChannelError');
  });

  it('should contain a message.', () => {
    const message = 'Oops';
    expect(new VoiceChannelError(message).message).toBe(message);
  });

  it('should have a stack trace.', () => {
    try {
      throw new VoiceChannelError('Oops');
    } catch (err) {
      expect(err.stack).toBeTruthy();
    }
  });
});
