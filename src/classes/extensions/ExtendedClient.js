import { CommandoClient } from 'discord.js-commando';
import logger from '@greencoast/logger';
import Player from '../Player';
import { ACTIVITY_TYPE, PRESENCE_STATUS } from '../../common/constants';
import { presenceType } from '../../common/settings';

class ExtendedClient extends CommandoClient {
  constructor(options) {
    super(options);

    this.debugEnabled = process.argv.includes('--debug');
    this.player = new Player(this);
  }

  handleCommandError(error, info) {
    logger.error(info);
    logger.error(error);
  }

  updatePresence(status) {
    return this.user.setPresence({
      status: PRESENCE_STATUS.ONLINE,
      afk: false,
      activity: {
        name: status,
        type: presenceType || ACTIVITY_TYPE.PLAYING
      }
    }).then(() => {
      logger.info(`Presence updated to: ${status}`);
    }).catch((error) => {
      logger.error(error);
    });
  }
}

export default ExtendedClient;
