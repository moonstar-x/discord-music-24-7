class VoiceChannelError extends Error {
  constructor(message) {
    super(message);

    this.name = 'VoiceChannelError';
  }
}

module.exports = VoiceChannelError;
