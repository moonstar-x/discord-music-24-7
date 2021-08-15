class MissingArgumentError extends Error {
  constructor(message) {
    super(message);

    this.name = 'MissingArgumentError';
  }
}

module.exports = MissingArgumentError;
