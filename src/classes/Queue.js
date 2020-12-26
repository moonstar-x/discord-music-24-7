import fs from 'fs';
import { shuffle } from '../common/settings';
import { shuffleArray } from '../common/utils';
import MissingArgumentError from './errors/MissingArgumentError';

class Queue {
  constructor(queueFilename) {
    if (!queueFilename) {
      throw new MissingArgumentError('queueFilename is required!');
    }

    this.queue = fs.readFileSync(queueFilename).toString().split('\n')
      .filter((url) => url.startsWith('https://') || url.startsWith('http://'));

    if (shuffle) {
      shuffleArray(this.queue);
    }

    this.index = 0;
  }

  getNext() {
    if (this.index >= this.queue.length) {
      this.index = 0;
    }

    return this.queue[this.index++];
  }
}

export default Queue;
