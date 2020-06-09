const fs = require('fs-extra');
const ytdl = require('ytdl-core');
const logger = require('@greencoast/logger');
const { channel_id, shuffle } = require('../../config/settings');
const { PRESENCE_STATUS, ACTIVITY_TYPE } = require('../constants');
const { shuffleArray } = require('../utils');
const streamEvents = require('../events/stream');
const dispatcherEvents = require('../events/dispatcher');

const queueFilename = './data/queue.txt';
const queue = fs.readFileSync(queueFilename).toString().split('\n');

if (shuffle) {
  shuffleArray(queue);
}

class Player {
  constructor(client) {
    this.client = client;
    this.channel = null;
    this.connection = null;
    this.listeners = 0;
    this.songEntry = 0;
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
        this.connection = connection;
        this.updateListeners();
        this.play();
      })
      .catch((error) => {
        logger.error(error);
      });
  }

  updateListeners() {
    this.listeners = this.channel.members.array().length - 1;
  }

  updatePresence(presence = '◼ Nothing to play') {
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

  async play() {
    if (this.songEntry >= queue.length) {
      this.songEntry = 0;
    }

    try {
      const stream = ytdl(queue[this.songEntry], {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
      });
      const dispatcher = await this.connection.play(stream);

      stream.once(streamEvents.info, ({ title: song }) => {
        logger.info(`Playing ${song} for ${this.listeners} user(s) in ${this.channel.name}.`);
        this.updatePresence(`► ${song}`);
      });

      dispatcher.on(dispatcherEvents.speaking, (speaking) => {
        if (!speaking) {
          this.songEntry++;
          this.play();
        }
      });

      dispatcher.on(dispatcherEvents.error, (error) => {
        logger.error(error);
        this.songEntry++;
        this.play();
      });

      if (process.argv[2] === '--debug') {
        dispatcher.on(dispatcherEvents.debug, (info) => {
          logger.debug(info);
        });
      }
    } catch (error) {
      logger.error(error);
      this.play();
    }
  }
}

module.exports = Player;
