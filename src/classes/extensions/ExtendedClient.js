import { CommandoClient } from 'discord.js-commando';
import logger from '@greencoast/logger';

class ExtendedClient extends CommandoClient {
  handleCommandError(error, info) {
    logger.error(info);
    logger.error(error);
  }
}

export default ExtendedClient;
