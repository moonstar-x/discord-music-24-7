const ProviderFactory = require('../../../src/classes/providers/ProviderFactory');
const YouTubeProvider = require('../../../src/classes/providers/YouTubeProvider');
const SoundCloudProvider = require('../../../src/classes/providers/SoundCloudProvider');
const LocalProvider = require('../../../src/classes/providers/LocalProvider');
const GenericStreamProvider = require('../../../src/classes/providers/GenericStreamProvider');

describe('Classes - Providers - ProviderFactory', () => {
  let factory;

  beforeEach(() => {
    factory = new ProviderFactory();
  });

  describe('getInstance()', () => {
    it('should return a YouTubeProvider if url corresponds to YouTube.', () => {
      expect(factory.getInstance('https://www.youtube.com/watch?v=PYGODWJgR-c')).toBeInstanceOf(YouTubeProvider);
      expect(factory.getInstance('https://youtu.be/PYGODWJgR-c')).toBeInstanceOf(YouTubeProvider);
    });

    it('should return a SoundCloudProvider if url corresponds to SoundCloud.', () => {
      expect(factory.getInstance('https://soundcloud.com/insomnia-666-728529957/dreamcatcher-boca')).toBeInstanceOf(SoundCloudProvider);
    });

    it('should return a LocalProvider if url corresponds to a local file.', () => {
      expect(factory.getInstance('local:/path/to/audio/file')).toBeInstanceOf(LocalProvider);
    });

    it('should return a GenericStreamProvider if url does not correspond to any of the above.', () => {
      expect(factory.getInstance('https://generic.stream.tld')).toBeInstanceOf(GenericStreamProvider);
    });
  });
});
