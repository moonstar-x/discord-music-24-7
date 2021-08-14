const AbstractProvider = require('./AbstractProvider');
const MissingArgumentError = require('../errors/MissingArgumentError');
const scdl = require('soundcloud-downloader').default;
const logger = require('@greencoast/logger');

class SoundCloudProvider extends AbstractProvider {
  constructor(clientID) {
    super();
    this.clientID = clientID;
  }

  async createStream(source) {
    if (!this.clientID) {
      throw new MissingArgumentError('A SoundCloud Client ID is required to use the SoundCloud provider!');
    }

    try {
      const info = await this.getInfo(source);
      const stream = await scdl.download(source, this.clientID);
      stream.info = {
        title: info.title,
        source: 'SC'
      };

      return stream;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  getInfo(source) {
    return scdl.getInfo(source, this.clientID);
  }
}

module.exports = SoundCloudProvider;
