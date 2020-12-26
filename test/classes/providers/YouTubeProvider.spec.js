import YouTubeProvider from '../../../src/classes/providers/YouTubeProvider';
import AbstractProvider from '../../../src/classes/providers/AbstractProvider';
import { Readable } from 'stream';

jest.mock('ytdl-core');

const url = 'https://www.youtube.com/watch?v=PYGODWJgR-c';

describe('Classes - Providers - YouTubeProvider', () => {
  let provider;

  beforeEach(() => {
    provider = new YouTubeProvider();
  });

  it('should be instance of AbstractProvider.', () => {
    expect(provider).toBeInstanceOf(AbstractProvider);
  });

  describe('createStream()', () => {
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
          expect(stream.info).toHaveProperty('source', 'YT');
        });
    });
  });

  describe('getInfo()', () => {
    it('should return a Promise.', () => {
      expect(provider.getInfo(url)).toBeInstanceOf(Promise);
    });
  });
});
