const GenericStreamProvider = require('../../../src/classes/providers/GenericStreamProvider');
const AbstractProvider = require('../../../src/classes/providers/AbstractProvider');
const logger = require('@greencoast/logger');
const axios = require('axios').default;
const { Readable } = require('stream');

jest.mock('@greencoast/logger');
jest.mock('axios');

const STREAM_URL = 'http://stream.laut.fm/foxco-radio';

describe('Classes - Providers - GenericStreamProvider', () => {
  let provider;

  beforeEach(() => {
    provider = new GenericStreamProvider();

    logger.error.mockClear();
    axios.get.mockClear();
  });

  it('should be instance of AbstractProvider.', () => {
    expect(provider).toBeInstanceOf(AbstractProvider);
  });

  describe('createStream()', () => {
    beforeEach(() => {
      axios.get.mockReturnValue({
        data: new Readable(),
        headers: {
          ['content-type']: 'audio/mpeg'
        }
      });
    });

    it('should return a Promise.', () => {
      expect(provider.createStream(STREAM_URL)).toBeInstanceOf(Promise);
    });

    it('should resolve a stream.', () => {
      return provider.createStream(STREAM_URL)
        .then((stream) => {
          expect(stream).toBeInstanceOf(Readable);
        });
    });

    it('should resolve a stream with the proper info property.', () => {
      return provider.createStream(STREAM_URL)
        .then((stream) => {
          expect(stream).toHaveProperty('info');
          expect(stream.info.title).toBe(STREAM_URL);
          expect(stream.info.source).toBe('GENERIC');
        });
    });

    it('should log an error if stream is not valid.', () => {
      axios.get.mockReturnValueOnce({
        headers: {
          ['content-type']: 'video/mp4'
        }
      });

      return provider.createStream(STREAM_URL)
        .then(() => {
          expect(logger.error).toHaveBeenCalled();
        });
    });
  });

  describe('getInfo()', () => {
    it('should return a Promise.', () => {
      expect(provider.getInfo(STREAM_URL)).toBeInstanceOf(Promise);
    });
  });

  describe('static isStreamSupported()', () => {
    it('should return true if content-type is supported.', () => {
      GenericStreamProvider.MIME_TYPES.forEach((type) => {
        expect(GenericStreamProvider.isStreamSupported(type)).toBe(true);
      });
    });

    it('should return false if content-type is unsupported.', () => {
      expect(GenericStreamProvider.isStreamSupported('video/mp4')).toBe(false);
    });
  });
});
