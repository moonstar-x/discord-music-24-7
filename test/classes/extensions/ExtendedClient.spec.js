import { CommandoClient } from 'discord.js-commando';
import logger from '@greencoast/logger';
import ExtendedClient from '../../../src/classes/extensions/ExtendedClient';

jest.mock('@greencoast/logger');
jest.mock('discord.js-commando', () => ({
  CommandoClient: jest.fn()
}));

const client = new ExtendedClient();

describe('Classes - Extensions - ExtendedClient', () => {
  beforeEach(() => {
    logger.error.mockClear();
  });

  it('should be an instance of CommandoClient.', () => {
    expect(client).toBeInstanceOf(CommandoClient);
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
});
