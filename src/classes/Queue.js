import fs from 'fs';
import { shuffle } from '../common/settings';
import { shuffleArray } from '../common/utils';
import { PROVIDERS } from '../common/constants';
import URLError from './errors/URLError';
import MissingArgumentError from './errors/MissingArgumentError';

class Queue {
  constructor(queueFilename) {
    if (!queueFilename) {
      throw new MissingArgumentError('queueFilename is required!');
    }

    const rawQueue = fs.readFileSync(queueFilename).toString().split('\n')
      .filter((url) => url.startsWith('https://') || url.startsWith('http://'));

    if (shuffle) {
      shuffleArray(rawQueue);
    }

    this.queue = Queue.parseQueue(rawQueue);
    this.index = 0;
  }

  static parseQueue(queue) {
    return queue.map((url) => {
      const parsed = { url };

      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        parsed.provider = PROVIDERS.YOUTUBE;
      } else {
        throw new URLError(`Invalid URL in queue: ${url}`);
      }

      return parsed;
    });
  }

  getNext() {
    if (this.index >= this.queue.length) {
      this.index = 0;
    }

    return this.queue[this.index++];
  }
}

export default Queue;
