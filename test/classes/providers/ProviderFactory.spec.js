import ProviderFactory from '../../../src/classes/providers/ProviderFactory';
import URLError from '../../../src/classes/errors/URLError';
import YouTubeProvider from '../../../src/classes/providers/YouTubeProvider';

describe('Classes - Providers - ProviderFactory', () => {
  describe('static getInstance()', () => {
    it('should throw URLError if url is not supported.', () => {
      expect(() => {
        ProviderFactory.getInstance('https://notsupported.tld');
      }).toThrow(URLError);
    });

    it('should return a YouTubeProvider if url corresponds to YouTube.', () => {
      expect(ProviderFactory.getInstance('https://www.youtube.com/watch?v=PYGODWJgR-c')).toBeInstanceOf(YouTubeProvider);
      expect(ProviderFactory.getInstance('https://youtu.be/PYGODWJgR-c')).toBeInstanceOf(YouTubeProvider);
    });
  });
});
