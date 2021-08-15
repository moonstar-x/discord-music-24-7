const YouTubeProvider = require('../providers/YouTubeProvider');
const SoundCloudProvider = require('../providers/SoundCloudProvider');
const LocalProvider = require('../providers/LocalProvider');
const GenericStreamProvider = require('../providers/GenericStreamProvider');

class ProviderFactory {
  constructor(options = {}) {
    this._youtubeProvider = new YouTubeProvider(options.youtubeCookie);
    this._soundCloudProvider = new SoundCloudProvider(options.soundcloudClientID);
    this._localProvider = new LocalProvider();
    this._genericStreamProvider = new GenericStreamProvider();
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
    
    return this._genericStreamProvider;
  }
}

module.exports = ProviderFactory;
