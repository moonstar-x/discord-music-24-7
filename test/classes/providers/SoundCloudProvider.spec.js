const SoundCloudProvider = require('../../../src/classes/providers/SoundCloudProvider');
const AbstractProvider = require('../../../src/classes/providers/AbstractProvider');
const MissingArgumentError = require('../../../src/classes/errors/MissingArgumentError');
const { Readable } = require('stream');

jest.mock('soundcloud-downloader', () => ({
  default: {
    getInfo: jest.fn(() => Promise.resolve({ title: 'Song' })),
    download: jest.fn(() => Promise.resolve(new (require('stream').Readable)()))
  }
}));

const url = 'https://soundcloud.com/insomnia-666-728529957/dreamcatcher-boca';

describe('Classes - Providers - SoundCloudProvider', () => {
  let provider;
  let clientID;

  beforeEach(() => {
    clientID = 'clientID';
    provider = new SoundCloudProvider(clientID);
  });

  it('should be instance of AbstractProvider.', () => {
    expect(provider).toBeInstanceOf(AbstractProvider);
  });

  describe('createStream()', () => {
    it('should reject if no clientID is passed.', () => {
      clientID = null;
      provider = new SoundCloudProvider(clientID);

      expect.assertions(1);
      return provider.createStream()
        .catch((error) => {
          expect(error).toBeInstanceOf(MissingArgumentError);
        });
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
