/* eslint-disable no-bitwise */
import AbstractProvider from './AbstractProvider';
import ytdl from 'ytdl-core';
import { youtubeCookie } from '../../common/settings';

class YouTubeProvider extends AbstractProvider {
  static createStream(source) {
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

    return ytdl(source, options);
  }
}

export default YouTubeProvider;
