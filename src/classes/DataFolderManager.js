const path = require('path');
const fs = require('fs');
const logger = require('@greencoast/logger');

class DataFolderManager {
  constructor(options = {}) {
    if (!options.dataPath) {
      options.dataPath = DataFolderManager.DEFAULT_DATA_PATH;
    }

    if (!options.queueFile) {
      options.queueFile = 'queue.txt';
    }

    if (!options.localMusicFolder) {
      options.localMusicFolder = 'local-music';
    }

    this.dataPath = options.dataPath;
    this.queuePath = path.join(this.dataPath, options.queueFile);
    this.localMusicPath = path.join(this.dataPath, options.localMusicFolder);

    this.initialize();
  }

  initialize() {
    this._createDirectoryIfNoExists(this.dataPath, 'Data directory not found! Creating...');
    this._createFileIfNoExists(this.queuePath, 'Queue file not found! Creating...');
    this._createDirectoryIfNoExists(this.localMusicPath, 'Local music directory not found! Creating...');
  }

  getQueueContent() {
    return fs.readFileSync(this.queuePath).toString();
  }

  getLocalMusicContent() {
    return fs.readdirSync(this.localMusicPath);
  }

  _createDirectoryIfNoExists(folderPath, createMessage) {
    if (!fs.existsSync(folderPath)) {
      logger.warn(createMessage);
      fs.mkdirSync(folderPath);
    }
  }

  _createFileIfNoExists(filePath, createMessage, initialContent = '') {
    if (!fs.existsSync(filePath)) {
      logger.warn(createMessage);
      fs.writeFileSync(filePath, initialContent);
    }
  }
}

DataFolderManager.DEFAULT_DATA_PATH = process.env.DEV_MODE === 'true' ?
  path.join(__dirname, '../../dev-data') :
  path.join(__dirname, '../../data');

module.exports = DataFolderManager;
