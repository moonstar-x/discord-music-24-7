import SoundCloudProvider from '../../../src/classes/providers/SoundCloudProvider';
import AbstractProvider from '../../../src/classes/providers/AbstractProvider';
import MissingArgumentError from '../../../src/classes/errors/MissingArgumentError';
import * as settings from '../../../src/common/settings';
import { Readable } from 'stream';

jest.mock('soundcloud-downloader', () => ({
  getInfo: jest.fn(() => Promise.resolve({ title: 'Song' })),
  download: jest.fn(() => Promise.resolve(new (require('stream').Readable)()))
}));

const url = 'https://soundcloud.com/insomnia-666-728529957/dreamcatcher-boca';

describe('Classes - Providers - SoundCloudProvider', () => {
  let provider;

  beforeEach(() => {
    provider = new SoundCloudProvider();
    settings.soundcloudClientID = 'clientID';
  });

  it('should be instance of AbstractProvider.', () => {
    expect(provider).toBeInstanceOf(AbstractProvider);
  });

  describe('createStream()', () => {
    it('should throw if no clientID is set in settings.', () => {
      settings.soundcloudClientID = null;

      expect(() => {
        provider.createStream();
      }).toThrow(MissingArgumentError);
    });

    it('should return a Promise.', () => {
      expect(provider.createStream(url)).toBeInstanceOf(Promise);
    });

    it('should resolve with a Readable stream.', () => {
      return provider.createStream(url)
        .then((stream) => {
          expect(stream).toBeInstanceOf(Readable);
        });
    });

    it('should resolve a stream with the info property.', () => {
      return provider.createStream(url)
        .then((stream) => {
          expect(stream).toHaveProperty('info');
          expect(stream.info).toHaveProperty('title');
          expect(stream.info).toHaveProperty('source', 'SC');
        });
    });
  });

  describe('getInfo()', () => {
    it('should return a Promise.', () => {
      expect(provider.getInfo(url)).toBeInstanceOf(Promise);
    });
  });
});
