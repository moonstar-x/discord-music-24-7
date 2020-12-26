import YouTubeProvider from '../providers/YouTubeProvider';
import SoundCloudProvider from '../providers/SoundCloudProvider';
import URLError from '../errors/URLError';

const youtubeProvider = new YouTubeProvider();
const soundCloudProvider = new SoundCloudProvider();

class ProviderFactory {
  static getInstance(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return youtubeProvider;
    }

    if (url.includes('soundcloud.com')) {
      return soundCloudProvider;
    }
    
    throw new URLError(`Invalid URL in queue: ${url}`);
  }
}

export default ProviderFactory;
