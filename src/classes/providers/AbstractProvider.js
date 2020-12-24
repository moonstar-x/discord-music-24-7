/* eslint-disable no-unused-vars */

class AbstractProvider {
  constructor() {
    if (new.target === AbstractProvider) {
      throw new TypeError('Cannot instantiate AbstractProvider!');
    }
  }

  /**
   * Creates a Stream for the appropriate media provider. Should also emit a 'info' event for media metadata fetch.
   * @param {String} source
   * @returns {ReadableStream}
   */
  static createStream(source) {
    throw new Error('Method not implemented!');
  }

  /**
   * Handles media metadata fetching. Should return a Promise that will be emit the 'info' event for the stream on fulfillment.
   * @param {String} source
   * @returns {Promise}
   */
  static getInfo(source) {
    throw new Error('Method not implemented!');
  }
}

export default AbstractProvider;
