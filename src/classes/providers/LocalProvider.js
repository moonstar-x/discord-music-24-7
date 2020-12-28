import AbstractProvider from './AbstractProvider';
import fs from 'fs';
import * as mm from 'music-metadata';
import logger from '@greencoast/logger';
import { Readable } from 'stream';

class LocalProvider extends AbstractProvider {
  createStream(source) {
    const path = source.substring(source.indexOf('local:') + 'local:'.length);

    return new Promise((resolve, reject) => {
      fs.readFile(path, null, (error, data) => {
        if (error) {
          reject(error);
          return;
        }

        this.getInfo(data)
          .then((info) => {
            const stream = new Readable();
            stream.info = {
              title: `${info.common.artist ? `${info.common.artist} - ` : ''}${info.common.title || 'Local Song'}`,
              source: 'LOCAL'
            };

            stream.push(data);
            stream.push(null);

            resolve(stream);
          })
          .catch((error) => {
            reject(error);
          });
      });
    })
      .catch((error) => {
        logger.error(error);
        return null;
      });
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

export default LocalProvider;
