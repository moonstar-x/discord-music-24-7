const path = require('path');
const fs = require('fs');
const logger = require('@greencoast/logger');

const DATA_PATH = path.join(__dirname, '../../data/');
const QUEUE_PATH = path.join(DATA_PATH, 'queue.txt');
const LOCAL_MUSIC_PATH = path.join(DATA_PATH, 'local-music');

const createDataDirectoryIfNoExists = () => {
  if (!fs.existsSync(DATA_PATH)) {
    logger.warn('Data directory not found! Creating...');
    fs.mkdirSync(DATA_PATH);
  }
};

const createQueueFileIfNoExists = () => {
  if (!fs.existsSync(QUEUE_PATH)) {
    logger.warn('Queue file not found! Creating...');
    fs.writeFileSync(QUEUE_PATH, '');
  }
};

const createLocalMusicDirectoryIfNoExists = () => {
  if (!fs.existsSync(LOCAL_MUSIC_PATH)) {
    logger.warn('Local music directory not found! Creating...');
    fs.mkdirSync(LOCAL_MUSIC_PATH);
  }
};

module.exports = {
  DATA_PATH,
  QUEUE_PATH,
  LOCAL_MUSIC_PATH,
  createDataDirectoryIfNoExists,
  createQueueFileIfNoExists,
  createLocalMusicDirectoryIfNoExists
};
