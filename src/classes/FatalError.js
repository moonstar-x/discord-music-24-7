class FatalError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FATAL';
  }
}

module.exports = FatalError;
