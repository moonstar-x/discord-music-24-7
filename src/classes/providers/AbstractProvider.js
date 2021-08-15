/* eslint-disable no-unused-vars */

class AbstractProvider {
  constructor() {
    if (new.target === AbstractProvider) {
      throw new TypeError('Cannot instantiate AbstractProvider!');
    }
  }

  /**
    Returns a Promise that resolves to a ReadableStream with the stream metadata appended to the info property.
   * @param {String} source
   * @returns {Promise<ReadableStream>}
   */
  createStream(source) {
    throw new Error('Method not implemented!');
  }

  /**
   * Handles media metadata fetching. Should return a Promise with the metadata in a normalized way.
   * @param {String} source
   * @returns {Promise}
   */
  getInfo(source) {
    throw new Error('Method not implemented!');
  }
}

module.exports = AbstractProvider;
