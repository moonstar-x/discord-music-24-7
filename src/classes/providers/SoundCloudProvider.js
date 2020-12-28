import AbstractProvider from './AbstractProvider';
import scdl from 'soundcloud-downloader';
import logger from '@greencoast/logger';
import MissingArgumentError from '../errors/MissingArgumentError';
import { soundcloudClientID } from '../../common/settings';

class SoundCloudProvider extends AbstractProvider {
  createStream(source) {
    if (!soundcloudClientID) {
      throw new MissingArgumentError('A SoundCloud Client ID is required to use the SoundCloud provider!');
    }

    return this.getInfo(source)
      .then((info) => {
        return scdl.download(source, soundcloudClientID)
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
    return scdl.getInfo(source, soundcloudClientID);
  }
}

export default SoundCloudProvider;
