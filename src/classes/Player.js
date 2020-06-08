const logger = require('@greencoast/logger');
const { PRESENCE_STATUS, ACTIVITY_TYPE } = require('../constants');
const { channel_id } = require('../../config/settings');

class Player {
  constructor(client) {
    this.client = client;
    this.channel = null;
    this.listeners = 0;
  }

  initialize() {
    this.updatePresence();

    this.client.channels.fetch(channel_id)
      .then((channel) => {
        if (!channel.joinable) {
          logger.fatal("I cannot join the configured voice channel. Maybe I don't have enough permissions?");
          process.exit(1);
        }

       this.updateChannel(channel);
      })
      .catch((error) => {
        logger.error(error);
      });
  }

  updateChannel(channel) {
    channel.join()
      .then((connection) => {
        logger.info(`Joined ${channel.name} in ${channel.guild.name}.`);
        this.channel = channel;
        this.updateListeners();
      })
      .catch((error) => {
        logger.error(error);
      });
  }

  updateListeners() {
    this.listeners = this.channel.members.array().length;
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
