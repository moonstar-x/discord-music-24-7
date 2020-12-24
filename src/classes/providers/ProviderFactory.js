import YouTubeProvider from '../providers/YouTubeProvider';
import URLError from '../errors/URLError';

const youtubeProvider = new YouTubeProvider();

class ProviderFactory {
  static getInstance(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return youtubeProvider;
    }
    
    throw new URLError(`Invalid URL in queue: ${url}`);
  }
}

export default ProviderFactory;
