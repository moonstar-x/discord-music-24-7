/* eslint-disable no-underscore-dangle */
const DataFolderManager = require('../../src/classes/DataFolderManager');
const logger = require('@greencoast/logger');
const fs = require('fs');

jest.mock('@greencoast/logger');
jest.mock('fs');

describe('Classes - DataFolderManager', () => {
  let manager;

  beforeEach(() => {
    manager = new DataFolderManager();

    logger.warn.mockClear();
    fs.existsSync.mockClear();
    fs.writeFileSync.mockClear();
    fs.mkdirSync.mockClear();
  });

  describe('_createDirectoryIfNoExists()', () => {
    it('should not do anything if directory exists.', () => {
      fs.existsSync.mockReturnValueOnce(true);

      manager._createDirectoryIfNoExists();

      expect(logger.warn).not.toHaveBeenCalled();
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    it('should log that the directory was not found if it does not exist.', () => {
      fs.existsSync.mockReturnValueOnce(false);

      const expectedMessage = 'Created!';
      manager._createDirectoryIfNoExists(null, expectedMessage);

      expect(logger.warn).toHaveBeenCalledTimes(1);
      expect(logger.warn).toHaveBeenCalledWith(expectedMessage);
    });

    it('should create the directory if it does not exist.', () => {
      fs.existsSync.mockReturnValueOnce(false);

      const expectedPath = 'path';
      manager._createDirectoryIfNoExists(expectedPath);

      expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
      expect(fs.mkdirSync).toHaveBeenCalledWith(expectedPath);
    });
  });

  describe('_createFileIfNoExists()', () => {
    it('should not do anything if file exists.', () => {
      fs.existsSync.mockReturnValueOnce(true);

      manager._createFileIfNoExists();

      expect(logger.warn).not.toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    it('should log that the file was not found if it does not exist.', () => {
      fs.existsSync.mockReturnValueOnce(false);

      const expectedMessage = 'Created!';
      manager._createFileIfNoExists(null, expectedMessage);

      expect(logger.warn).toHaveBeenCalledTimes(1);
      expect(logger.warn).toHaveBeenCalledWith(expectedMessage);
    });

    it('should create file if it does not exist.', () => {
      fs.existsSync.mockReturnValueOnce(false);

      const expectedPath = 'path';
      manager._createFileIfNoExists(expectedPath);

      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
      expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, '');
    });
  });

  describe('getQueueContent()', () => {
    it('should return queue content.', () => {
      const expectedContent = 'Content!';
      fs.readFileSync.mockReturnValueOnce(expectedContent);

      expect(manager.getQueueContent()).toBe(expectedContent);
    });
  });

  describe('getLocalMusicContent()', () => {
    it('should return queue content.', () => {
      const expectedContent = ['file1', 'file2'];
      fs.readdirSync.mockReturnValueOnce(expectedContent);

      expect(manager.getLocalMusicContent()).toBe(expectedContent);
    });
  });
});
