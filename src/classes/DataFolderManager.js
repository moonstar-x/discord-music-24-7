const path = require('path');
const fs = require('fs');
const logger = require('@greencoast/logger');

class DataFolderManager {
  constructor(dataPath = DataFolderManager.DEFAULT_DATA_PATH) {
    this.dataPath = dataPath;
    this.queuePath = path.join(dataPath, 'queue.txt');
    this.localMusicPath = path.join(dataPath, 'local-music');
  }

  initialize() {
    this._createDirectoryIfNoExists(this.dataPath, 'Data directory not found! Creating...');
    this._createFileIfNoExists(this.queuePath, 'Queue file not found! Creating...');
    this._createDirectoryIfNoExists(this.localMusicPath, 'Local music directory not found! Creating...');
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

DataFolderManager.DEFAULT_DATA_PATH = path.join(__dirname, '../../data');

module.exports = DataFolderManager;
