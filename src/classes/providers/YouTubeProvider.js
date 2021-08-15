/* eslint-disable no-bitwise */
const AbstractProvider = require('./AbstractProvider');
const ytdl = require('ytdl-core');
const logger = require('@greencoast/logger');

class YouTubeProvider extends AbstractProvider {
  constructor(cookie) {
    super();
    this.cookie = cookie;
  }

  async createStream(source) {
    const options = {
      quality: 'highestaudio',
      highWaterMark: 1 << 25
    };

    if (this.cookie) {
      options.requestOptions = {
        headers: {
          Cookie: this.cookie
        }
      };
    }

    try {
      const info = await this.getInfo(source, options);
      const stream = ytdl.downloadFromInfo(info);
      stream.info = {
        title: info.videoDetails.title,
        source: 'YT'
      };

      return stream;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  getInfo(source, options) {
    return ytdl.getInfo(source, options);
  }
}

module.exports = YouTubeProvider;
