import { CommandoClient } from 'discord.js-commando';
import logger from '@greencoast/logger';
import ExtendedClient from '../../../src/classes/extensions/ExtendedClient';

jest.mock('@greencoast/logger');
jest.mock('discord.js-commando', () => ({
  CommandoClient: jest.fn()
}));

const client = new ExtendedClient();
client.user = {
  setPresence: jest.fn(() => Promise.resolve())
};

describe('Classes - Extensions - ExtendedClient', () => {
  beforeEach(() => {
    logger.error.mockClear();
    logger.info.mockClear();
  });

  it('should be an instance of CommandoClient.', () => {
    expect(client).toBeInstanceOf(CommandoClient);
  });

  it('should have a debugEnabled property set to false if no --debug flag was used.', () => {
    const oldArgs = [...process.argv];
    process.argv = ['npm', 'start'];
    const client = new ExtendedClient();

    expect(client.debugEnabled).toBe(false);

    process.argv = oldArgs;
  });

  it('should have a debugEnabled property set to true if --debug flag was used.', () => {
    const oldArgs = [...process.argv];
    process.argv = ['npm', 'start', '--debug'];
    const client = new ExtendedClient();

    expect(client.debugEnabled).toBe(true);

    process.argv = oldArgs;
  });

  describe('handleCommandError()', () => {
    it('should log the error and info.', () => {
      const expectedError = new Error();
      const expectedInfo = 'Information...';
      client.handleCommandError(expectedError, expectedInfo);
      
      expect(logger.error).toBeCalledTimes(2);
      expect(logger.error).toHaveBeenCalledWith(expectedError);
      expect(logger.error).toHaveBeenCalledWith(expectedInfo);
    });
  });

  describe('updatePresence()', () => {
    it('should return a Promise.', () => {
      expect(client.updatePresence()).toBeInstanceOf(Promise);
    });

    it('should log successful presence update.', () => {
      return client.updatePresence('hi')
        .then(() => {
          expect(logger.info).toHaveBeenCalledTimes(1);
          expect(logger.info).toHaveBeenCalledWith('Presence updated to: hi');
        });
    });

    it('should log error if presence could not update.', () => {
      const expectedError = new Error();
      client.user.setPresence.mockRejectedValueOnce(expectedError);

      return client.updatePresence('hi')
        .then(() => {
          expect(logger.error).toHaveBeenCalledTimes(1);
          expect(logger.error).toHaveBeenCalledWith(expectedError);
        });
    });
  });
});
