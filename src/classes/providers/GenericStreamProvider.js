const AbstractProvider = require('./AbstractProvider');
const URLError = require('../errors/URLError');
const axios = require('axios').default;
const logger = require('@greencoast/logger');

class GenericStreamProvider extends AbstractProvider {
  async createStream(source) {
    try {
      const response = await axios.get(source, {
        responseType: 'stream'
      });
      const info = await this.getInfo(source);

      const contentType = response.headers['content-type'];
      if (!GenericStreamProvider.isStreamSupported(contentType)) {
        throw new URLError(`${source} resolves to an unsupported stream of type ${contentType}.`);
      }

      response.data.info = {
        title: info,
        source: 'GENERIC'
      };

      return response.data;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  getInfo(source) {
    return Promise.resolve(source);
  }
}

GenericStreamProvider.MIME_TYPES = [
  'audio/aac',
  'audio/mpeg',
  'audio/ogg',
  'audio/opus',
  'audio/wav'
];

GenericStreamProvider.isStreamSupported = (mimeType) => {
  return GenericStreamProvider.MIME_TYPES.includes(mimeType);
};

module.exports = GenericStreamProvider;
