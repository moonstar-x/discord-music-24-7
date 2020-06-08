const logger = require('@greencoast/logger');
const { PRESENCE_STATUS, ACTIVITY_TYPE } = require('../constants');

class Player {
  constructor(client) {
    this.client = client;
  }

  updatePresence() {
    const presence = '◼ Nothing to play';

    this.client.user.setPresence({
      activity: {
        name: presence,
        type: ACTIVITY_TYPE.PLAYING
      },
      status: PRESENCE_STATUS.ONLINE
    })
      .then(() => {
        logger.info(`Presence updated to: ${presence}`);
      })
      .catch((error) => {
        logger.error(error);
      });
  }
}

module.exports = Player;
