const AbstractProvider = require('./AbstractProvider');
const MissingArgumentError = require('../errors/MissingArgumentError');
const scdl = require('soundcloud-downloader');
const logger = require('@greencoast/logger');

class SoundCloudProvider extends AbstractProvider {
  constructor(clientID) {
    super();
    this.clientID = clientID;
  }

  createStream(source) {
    if (!this.clientID) {
      throw new MissingArgumentError('A SoundCloud Client ID is required to use the SoundCloud provider!');
    }

    return this.getInfo(source)
      .then((info) => {
        return scdl.download(source, this.clientID)
          .then((stream) => {
            stream.info = {
              title: info.title,
              source: 'SC'
            };

            return stream;
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        logger.error(error);
        return null;
      });
  }

  getInfo(source) {
    return scdl.getInfo(source, this.clientID);
  }
}

module.exports = SoundCloudProvider;
