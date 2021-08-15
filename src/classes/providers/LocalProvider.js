const AbstractProvider = require('./AbstractProvider');
const fs = require('fs');
const mm = require('music-metadata');
const logger = require('@greencoast/logger');
const { Readable } = require('stream');

class LocalProvider extends AbstractProvider {
  readFile(source) {
    const path = source.substring(source.indexOf('local:') + 'local:'.length);

    return new Promise((resolve, reject) => {
      fs.readFile(path, null, (error, data) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(data);
      });
    });
  }

  async createStream(source) {
    try {
      const data = await this.readFile(source);
      const info = await this.getInfo(data);

      const stream = new Readable();
      stream.info = {
        title: `${info.common.artist ? `${info.common.artist} - ` : ''}${info.common.title || 'Local Song'}`,
        source: 'LOCAL'
      };

      stream.push(data);
      stream.push(null);

      return stream;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  getInfo(buffer) {
    return mm.parseBuffer(buffer, null, {
      duration: false,
      skipCovers: true,
      skipPostHeaders: true,
      includeChapters: false
    });
  }
}

LocalProvider.FILE_EXTENSIONS = ['mp3', 'm4a'];

LocalProvider.isFileSupported = (path) => {
  return LocalProvider.FILE_EXTENSIONS.some((ext) => path.endsWith(ext));
};

module.exports = LocalProvider;
