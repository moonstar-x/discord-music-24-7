import ProviderFactory from '../../../src/classes/providers/ProviderFactory';
import URLError from '../../../src/classes/errors/URLError';
import YouTubeProvider from '../../../src/classes/providers/YouTubeProvider';
import SoundCloudProvider from '../../../src/classes/providers/SoundCloudProvider';
import LocalProvider from '../../../src/classes/providers/LocalProvider';

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

    it('should return a SoundCloudProvider if url corresponds to SoundCloud.', () => {
      expect(ProviderFactory.getInstance('https://soundcloud.com/insomnia-666-728529957/dreamcatcher-boca')).toBeInstanceOf(SoundCloudProvider);
    });

    it('should return a LocalProvider if url corresponds to a local file.', () => {
      expect(ProviderFactory.getInstance('local:/path/to/audio/file')).toBeInstanceOf(LocalProvider);
    });
  });
});
