import YouTubeProvider from '../../../src/classes/providers/YouTubeProvider';
import AbstractProvider from '../../../src/classes/providers/AbstractProvider';
import { Readable } from 'stream';

const url = 'https://www.youtube.com/watch?v=PYGODWJgR-c';

describe('Classes - Providers - YouTubeProvider', () => {
  it('should be instance of AbstractProvider.', () => {
    expect(new YouTubeProvider()).toBeInstanceOf(AbstractProvider);
  });

  describe('static createStream()', () => {
    it('should return a Promise.', () => {
      expect(YouTubeProvider.createStream(url)).toBeInstanceOf(Promise);
    });

    it('should resolve with a Readable stream.', () => {
      return YouTubeProvider.createStream(url)
        .then((stream) => {
          expect(stream).toBeInstanceOf(Readable);
        });
    });

    it('should resolve a stream with the info property.', () => {
      return YouTubeProvider.createStream(url)
        .then((stream) => {
          expect(stream).toHaveProperty('info');
          expect(stream.info).toHaveProperty('title');
        });
    });
  });

  describe('static getInfo()', () => {
    it('should return a Promise.', () => {
      expect(YouTubeProvider.getInfo(url)).toBeInstanceOf(Promise);
    });
  });
});
