const YouTubeProvider = require('../providers/YouTubeProvider');
const SoundCloudProvider = require('../providers/SoundCloudProvider');
const LocalProvider = require('../providers/LocalProvider');
const URLError = require('../errors/URLError');

class ProviderFactory {
  constructor(options = {}) {
    this._youtubeProvider = new YouTubeProvider(options.youtubeCookie);
    this._soundCloudProvider = new SoundCloudProvider(options.soundcloudClientID);
    this._localProvider = new LocalProvider();
  }

  getInstance(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return this._youtubeProvider;
    }

    if (url.includes('soundcloud.com')) {
      return this._soundCloudProvider;
    }

    if (url.startsWith('local:')) {
      return this._localProvider;
    }
    
    throw new URLError(`Invalid URL in queue: ${url}`);
  }
}

module.exports = ProviderFactory;
