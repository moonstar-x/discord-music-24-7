class MissingArgumentError extends Error {
  constructor(message) {
    super(message);

    this.name = 'MissingArgumentError';
  }
}

export default MissingArgumentError;
