import YouTubeProvider from '../../../src/classes/providers/YouTubeProvider';
import AbstractProvider from '../../../src/classes/providers/AbstractProvider';
import { Readable } from 'stream';

describe('Classes - Providers - YouTubeProvider', () => {
  it('should be instance of AbstractProvider.', () => {
    expect(new YouTubeProvider()).toBeInstanceOf(AbstractProvider);
  });

  describe('static createStream()', () => {
    it('should return a ReadableStream.', () => {
      const stream = YouTubeProvider.createStream('https://www.youtube.com/watch?v=PYGODWJgR-c');
      expect(stream).toBeInstanceOf(Readable);
      stream.destroy();
    });
  });
});
