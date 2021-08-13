const YouTubeProvider = require('../providers/YouTubeProvider');
const SoundCloudProvider = require('../providers/SoundCloudProvider');
const LocalProvider = require('../providers/LocalProvider');
const URLError = require('../errors/URLError');

const youtubeProvider = new YouTubeProvider();
const soundCloudProvider = new SoundCloudProvider();
const localProvider = new LocalProvider();

class ProviderFactory {
  static getInstance(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return youtubeProvider;
    }

    if (url.includes('soundcloud.com')) {
      return soundCloudProvider;
    }

    if (url.startsWith('local:')) {
      return localProvider;
    }
    
    throw new URLError(`Invalid URL in queue: ${url}`);
  }
}

module.exports = ProviderFactory;
