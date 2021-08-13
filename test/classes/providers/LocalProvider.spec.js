const LocalProvider = require('../../../src/classes/providers/LocalProvider');
const AbstractProvider = require('../../../src/classes/providers/AbstractProvider');
const fs = require('fs');
const logger = require('@greencoast/logger');
const mm = require('music-metadata');
const { Readable } = require('stream');

const infoMock = {
  common: {
    artist: 'Song Artist',
    title: 'Song Title'
  }
};

jest.mock('music-metadata', () => ({
  parseBuffer: jest.fn(() => Promise.resolve(infoMock))
}));
jest.mock('fs');
jest.mock('@greencoast/logger');

describe('Classes - Providers - LocalProvider', () => {
  let provider;

  beforeEach(() => {
    provider = new LocalProvider();
    fs.readFile.mockClear();
    logger.error.mockClear();
    mm.parseBuffer.mockClear();
  });

  it('should be instance of AbstractProvider.', () => {
    expect(provider).toBeInstanceOf(AbstractProvider);
  });

  describe('createStream()', () => {
    it('should return a Promise.', () => {
      expect(provider.createStream('path')).toBeInstanceOf(Promise);
    });
    
    it('should resolve a stream.', () => {
      return provider.createStream('path')
        .then((stream) => {
          expect(stream).toBeInstanceOf(Readable);
        });
    });

    it('should resolve a stream with the proper info property.', () => {
      return provider.createStream('path')
        .then((stream) => {
          expect(stream).toHaveProperty('info');
          expect(stream.info.title).toBe(`${infoMock.common.artist} - ${infoMock.common.title}`);
          expect(stream.info.source).toBe('LOCAL');
        });
    });

    it('should resolve a stream with the proper title in info if no artist in metadata was found.', () => {
      mm.parseBuffer.mockResolvedValueOnce({ common: { title: 'Song' } });

      return provider.createStream('path')
        .then((stream) => {
          expect(stream.info.title).toBe('Song');
        });
    });

    it('should resolve a stream with the proper title in info if no title in metadata was found.', () => {
      mm.parseBuffer.mockResolvedValueOnce({ common: { artist: 'Artist' } });

      return provider.createStream('path')
        .then((stream) => {
          expect(stream.info.title).toBe('Artist - Local Song');
        });
    });

    it('should resolve a stream with the proper title in info if no artist or title in metadata was found.', () => {
      mm.parseBuffer.mockResolvedValueOnce({ common: { } });

      return provider.createStream('path')
        .then((stream) => {
          expect(stream.info.title).toBe('Local Song');
        });
    });

    it('should log an error if fs.readFile fails.', () => {
      const error = new Error('Oops');

      fs.readFile.mockImplementationOnce((path, opts, cb) => {
        cb(error);
      });

      return provider.createStream('path')
        .then((stream) => {
          expect(logger.error).toHaveBeenCalledTimes(1);
          expect(logger.error).toHaveBeenCalledWith(error);
          expect(stream).toBeNull();
        });
    });

    it('should log an error if mm.parseBuffer fails.', () => {
      const error = new Error('Oops');

      mm.parseBuffer.mockRejectedValueOnce(error);

      return provider.createStream('path')
        .then((stream) => {
          expect(logger.error).toHaveBeenCalledTimes(1);
          expect(logger.error).toHaveBeenCalledWith(error);
          expect(stream).toBeNull();
        });
    });
  });

  describe('getInfo()', () => {
    it('should return a Promise.', () => {
      expect(provider.getInfo()).toBeInstanceOf(Promise);
    });
  });

  describe('static FILE_EXTENSIONS', () => {
    it('should be an Array.', () => {
      expect(LocalProvider.FILE_EXTENSIONS).toBeInstanceOf(Array);
    });

    it('should only contain strings.', () => {
      LocalProvider.FILE_EXTENSIONS.forEach((ext) => {
        expect(typeof ext).toBe('string');
      });
    });
  });

  describe('static isFileSupported()', () => {
    it('should return true if path ends with any supported extension.', () => {
      LocalProvider.FILE_EXTENSIONS.forEach((ext) => {
        const path = `local:/path/to/file.${ext}`;
        expect(LocalProvider.isFileSupported(path)).toBe(true);
      });
    });

    it('should return false if path does not end with a supported extension.', () => {
      expect(LocalProvider.isFileSupported('local:/path/file/not/supported.txt')).toBe(false);
    });
  });
});
