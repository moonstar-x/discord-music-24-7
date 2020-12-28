/* eslint-disable no-bitwise */
import AbstractProvider from './AbstractProvider';
import ytdl from 'ytdl-core';
import logger from '@greencoast/logger';
import { youtubeCookie } from '../../common/settings';

class YouTubeProvider extends AbstractProvider {
  createStream(source) {
    const options = {
      quality: 'highestaudio',
      highWaterMark: 1 << 25
    };

    if (youtubeCookie) {
      options.requestOptions = {
        headers: {
          Cookie: youtubeCookie
        }
      };
    }

    return this.getInfo(source, options)
      .then((info) => {
        const stream = ytdl.downloadFromInfo(info);
        stream.info = {
          title: info.videoDetails.title,
          source: 'YT'
        };

        return stream;
      })
      .catch((error) => {
        logger.error(error);
        return null;
      });
  }

  getInfo(source, options) {
    return ytdl.getInfo(source, options);
  }
}

export default YouTubeProvider;
