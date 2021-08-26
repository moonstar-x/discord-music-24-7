const path = require('path');
const { shuffleArray } = require('../utils/array');
const LocalProvider = require('../classes/providers/LocalProvider');

class Queue {
  constructor(dataFolderManager, options = {}) {
    this.type = options.type || 'Music';

    this.queue = this.initializeQueue(dataFolderManager);
    this.currentIndex = 0;

    if (options.shuffle) {
      shuffleArray(this.queue);
    }
  }

  initializeQueue(dataFolderManager) {
    const queueFromFile = dataFolderManager.getQueueContent().split('\n')
      .filter((url) => url.startsWith('https://') || url.startsWith('http://'));

    const localMusicQueue = dataFolderManager.getLocalMusicContent().reduce((queue, file) => {
      if (LocalProvider.isFileSupported(file)) {
        queue.push(`local:${path.join(dataFolderManager.localMusicPath, file)}`);
      }
      return queue;
    }, []);

    const queue = [...queueFromFile, ...localMusicQueue];

    if (queue.length < 1) {
      throw new Error(`${this.type} queue is empty! Please add music to the queue file or to the local music folder before starting the bot.`);
    }

    return queue;
  }

  getNext() {
    if (this.currentIndex >= this.queue.length) {
      this.currentIndex = 0;
    }

    return this.queue[this.currentIndex++];
  }

  getSize() {
    return this.queue.length;
  }

  getCurrentIndex() {
    return this.currentIndex;
  }
}

module.exports = Queue;
