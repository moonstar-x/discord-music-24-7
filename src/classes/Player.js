const fs = require('fs-extra');
const ytdl = require('ytdl-core');
const scdl = require('soundcloud-downloader')
const logger = require('@greencoast/logger');
const { channel_id, shuffle, soundcloud_client_id, youtube_cookie } = require('../../config/settings');
const { PRESENCE_STATUS, ACTIVITY_TYPE } = require('../constants');
const { shuffleArray } = require('../utils');
const streamEvents = require('../events/stream');
const dispatcherEvents = require('../events/dispatcher');
const FatalError = require('./FatalError');

const queueFilename = './data/queue.txt';
const queue = fs.readFileSync(queueFilename).toString().split('\n').filter((url) => url.startsWith('https://'));

if (shuffle) {
  shuffleArray(queue);
}

class Player {
  constructor(client) {
    this.client = client;
    this.channel = null;
    this.connection = null;
    this.dispatcher = null;
    this.listeners = 0;
    this.songEntry = 0;
    this.paused = null;
    this.song = null;
    this.soundcloudClientID = soundcloud_client_id
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
        if (error === 'DiscordAPIError: Unknown Channel') {
          logger.fatal('The channel I tried to join no does not exist. Please check the channel ID set up in your settings file.');
        } else {
          logger.fatal('Something went wrong when trying to look for the channel I was supposed to join.', error);
        }
        process.exit(1);
      });
  }

  updateChannel(channel) {
    logger.info(`Joined ${channel.name} in ${channel.guild.name}.`);
    this.channel = channel;

    if (!this.connection) {
      channel.join()
        .then((connection) => {
          this.connection = connection;
          this.updateListeners();

          if (!this.dispatcher) {
            this.play();
          }
        })
        .catch((error) => {
          logger.error(error);
        });
    }
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
      const stream = await this.createStream()
      this.dispatcher = await this.connection.play(stream);

      this.dispatcher.on(dispatcherEvents.speaking, (speaking) => {
        if (!speaking && !this.paused) {
          this.songEntry++;
          this.play();
        }
      });

      this.dispatcher.on(dispatcherEvents.error, (error) => {
        logger.error(error);
        this.songEntry++;
        this.play();
      });

      if (process.argv[2] === '--debug') {
        this.dispatcher.on(dispatcherEvents.debug, (info) => {
          logger.debug(info);
        });
      }
    } catch (error) {
      logger.error(error);

      if (error instanceof FatalError) {
        process.exit(1);
      }

      this.songEntry++;
      this.play();
    }
  }

  async createStream() {
    const url = queue[this.songEntry];
    if (url.includes('youtube.com')) {
      return this.createYoutubeStream()

    } else if (url.includes('soundcloud.com')) {
      if (!!this.soundcloudClientID) {
        return await this.createSoundcloudStream();
      }

      throw new FatalError("Soundcloud song detected but no client ID was found!");
    }

    throw new FatalError("Invalid song URL! It can only be from youtube.com or soundcloud.com");
  }

  createYoutubeStream() {
    const stream = ytdl(queue[this.songEntry], {
      quality: 'highestaudio',
      highWaterMark: 1 << 25,
      requestOptions: {
        headers: {
          'Cookie': youtube_cookie
        }
      }
    });

    stream.once(streamEvents.info, ({ videoDetails: { title } }) => {
      this.song = title;
      if (!this.updateDispatcherStatus()) {
        this.updateSongPresence();
      }
    });

    return stream
  }

  async createSoundcloudStream() {
    const stream = await scdl.download(queue[this.songEntry], this.soundcloudClientID);
    const info = await scdl.getInfo(queue[this.songEntry], this.soundcloudClientID);

    this.song = info.title;
    if (!this.updateDispatcherStatus()) {
      this.updateSongPresence();
    }

    return stream
  }

  updateDispatcherStatus() {
    if (!this.dispatcher) {
      return null;
    }
    
    if (this.listeners > 0) {
      return this.resumeDispatcher();
    }

    return this.pauseDispatcher();
  }

  resumeDispatcher() {
    if (this.paused === false) {
      return false;
    }

    this.paused = false;
    this.dispatcher.resume();
    this.updateSongPresence();
    logger.info(`Music has been resumed. Playing ${this.song} for ${this.listeners} user(s) in ${this.channel.name}.`);
    return true;
  }

  pauseDispatcher() {
    if (this.paused === true) {
      return false;
    }

    this.paused = true;
    this.dispatcher.pause();
    this.updateSongPresence();
    logger.info('Music has been paused because nobody is in my channel.');
    return true;
  }

  updateSongPresence() {
    const icon = this.paused ? '❙ ❙' : '►';
    this.updatePresence(`${icon} ${this.song}`);
  }
}

module.exports = Player;
