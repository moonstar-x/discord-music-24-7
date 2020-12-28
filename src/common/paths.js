import path from 'path';
import fs from 'fs';
import logger from '@greencoast/logger';

export const DATA_PATH = path.join(__dirname, '../../data/');
export const QUEUE_PATH = path.join(DATA_PATH, 'queue.txt');
export const LOCAL_MUSIC_PATH = path.join(DATA_PATH, 'local-music');

export const createDataDirectoryIfNoExists = () => {
  if (!fs.existsSync(DATA_PATH)) {
    logger.warn('Data directory not found! Creating...');
    fs.mkdirSync(DATA_PATH);
  }
};

export const createQueueFileIfNoExists = () => {
  if (!fs.existsSync(QUEUE_PATH)) {
    logger.warn('Queue file not found! Creating...');
    fs.writeFileSync(QUEUE_PATH, '');
  }
};

export const createLocalMusicDirectoryIfNoExists = () => {
  if (!fs.existsSync(LOCAL_MUSIC_PATH)) {
    logger.warn('Local music directory not found! Creating...');
    fs.mkdirSync(LOCAL_MUSIC_PATH);
  }
};
