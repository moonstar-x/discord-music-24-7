class VoiceChannelError extends Error {
  constructor(message) {
    super(message);

    this.name = 'VoiceChannelError';
  }
}

export default VoiceChannelError;
