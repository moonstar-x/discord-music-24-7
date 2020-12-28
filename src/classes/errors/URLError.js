class URLError extends Error {
  constructor(message) {
    super(message);

    this.name = 'URLError';
  }
}

export default URLError;
