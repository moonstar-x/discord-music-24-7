import { DATA_PATH, QUEUE_PATH, LOCAL_MUSIC_PATH, createLocalMusicDirectoryIfNoExists, createQueueFileIfNoExists, createDataDirectoryIfNoExists } from '../../src/common/paths';
import logger from '@greencoast/logger';
import fs from 'fs';

jest.mock('@greencoast/logger');
jest.mock('fs');


describe('Common - Paths', () => {
  beforeEach(() => {
    logger.warn.mockClear();
    fs.existsSync.mockClear();
    fs.writeFileSync.mockClear();
    fs.mkdirSync.mockClear();
  });

  describe('DATA_PATH', () => {
    it('should be a string.', () => {
      expect(typeof DATA_PATH).toBe('string');
    });
  });

  describe('QUEUE_PATH', () => {
    it('should be a string.', () => {
      expect(typeof QUEUE_PATH).toBe('string');
    });

    it('should end with .txt', () => {
      expect(QUEUE_PATH.endsWith('.txt')).toBe(true);
    });
  });

  describe('LOCAL_MUSIC_PATH', () => {
    it('should be a string.', () => {
      expect(typeof LOCAL_MUSIC_PATH).toBe('string');
    });
  });

  describe('createQueueFileIfNoExists()', () => {
    it('should not do anything if queue file exists.', () => {
      fs.existsSync.mockReturnValueOnce(true);

      createQueueFileIfNoExists();

      expect(logger.warn).not.toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    it('should log that the file was not found if it does not exist.', () => {
      fs.existsSync.mockReturnValueOnce(false);

      createQueueFileIfNoExists();

      expect(logger.warn).toHaveBeenCalledTimes(1);
      expect(logger.warn).toHaveBeenCalledWith('Queue file not found! Creating...');
    });

    it('should create queue file if it does not exist.', () => {
      fs.existsSync.mockReturnValueOnce(false);

      createQueueFileIfNoExists();

      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
      expect(fs.writeFileSync).toHaveBeenCalledWith(QUEUE_PATH, '');
    });
  });

  describe('createLocalMusicDirectoryIfNoExists()', () => {
    it('should not do anything if local music folder exists.', () => {
      fs.existsSync.mockReturnValueOnce(true);

      createLocalMusicDirectoryIfNoExists();

      expect(logger.warn).not.toHaveBeenCalled();
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    it('should log that the folder was not found if it does not exist.', () => {
      fs.existsSync.mockReturnValueOnce(false);

      createLocalMusicDirectoryIfNoExists();

      expect(logger.warn).toHaveBeenCalledTimes(1);
      expect(logger.warn).toHaveBeenCalledWith('Local music directory not found! Creating...');
    });

    it('should create local music folder if it does not exist.', () => {
      fs.existsSync.mockReturnValueOnce(false);

      createLocalMusicDirectoryIfNoExists();

      expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
      expect(fs.mkdirSync).toHaveBeenCalledWith(LOCAL_MUSIC_PATH);
    });
  });

  describe('createDataDirectoryIfNoExists()', () => {
    it('should not do anything if data folder exists.', () => {
      fs.existsSync.mockReturnValueOnce(true);

      createDataDirectoryIfNoExists();

      expect(logger.warn).not.toHaveBeenCalled();
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    it('should log that the folder was not found if it does not exist.', () => {
      fs.existsSync.mockReturnValueOnce(false);

      createDataDirectoryIfNoExists();

      expect(logger.warn).toHaveBeenCalledTimes(1);
      expect(logger.warn).toHaveBeenCalledWith('Data directory not found! Creating...');
    });

    it('should create data folder if it does not exist.', () => {
      fs.existsSync.mockReturnValueOnce(false);

      createDataDirectoryIfNoExists();

      expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
      expect(fs.mkdirSync).toHaveBeenCalledWith(DATA_PATH);
    });
  });
});
