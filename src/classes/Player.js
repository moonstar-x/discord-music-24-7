const logger = require('@greencoast/logger');
const { EventEmitter } = require('events');
const Queue = require('./Queue');
const DataFolderManager = require('./DataFolderManager');
const ProviderFactory = require('./providers/ProviderFactory');
const MissingArgumentError = require('./errors/MissingArgumentError');
const VoiceChannelError = require('./errors/VoiceChannelError');

class Player extends EventEmitter {
  constructor(client) {
    super();

    this.client = client;

    this.dataFolderManager = new DataFolderManager();
    this.queue = new Queue(this.dataFolderManager, {
      shuffle: client.config.get('SHUFFLE')
    });
    this.providerFactory = new ProviderFactory({
      youtubeCookie: client.config.get('YOUTUBE_COOKIE'),
      soundcloudClientID: client.config.get('SOUNDCLOUD_CLIENT_ID')
    });

    this.channel = null;
    this.connection = null;
    this.dispatcher = null;

    this.paused = false;
    this.currentSong = null;
    this.listeners = 0;

    this.lastPauseTimestamp = null;
    this.pauseOnEmpty = client.config.get('PAUSE_ON_EMPTY');

    if (client.debug) {
      this.on('removeListener', (event) => {
        logger.debug(`The event ${event} has been removed.`);
      });
    }
  }

  initialize(channelID) {
    if (!channelID) {
      throw new MissingArgumentError('channelID is required in bot config!');
    }

    this.client.presenceManager.update('◼ Nothing to play');

    return this.client.channels.fetch(channelID)
      .then((channel) => {
        if (!channel.joinable) {
          throw new VoiceChannelError("I don't have enough permissions to join the configured voice channel!");
        }

        return this.updateChannel(channel);
      })
      .catch((error) => {
        if (error instanceof VoiceChannelError) {
          throw error;
        }
        
        if (error === 'DiscordAPIError: Unknown Channel') {
          throw new VoiceChannelError('The channel I tried to join does not exist. Please check the channelID set up in your bot config.');
        }

        logger.fatal(error);
        throw new VoiceChannelError('Something went wrong when trying to look for the channel I was supposed to join.');
      });
  }

  updateChannel(channel) {
    logger.info(`Joined ${channel.name} in ${channel.guild.name}.`);
    this.channel = channel;

    if (!this.connection) {
      return channel.join()
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

  play() {
    const url = this.queue.getNext();
    const provider = this.providerFactory.getInstance(url);

    return provider.createStream(url)
      .then((stream) => {
        // Something happened while creating the stream.
        if (!stream) {
          this.play();
        }

        this.dispatcher = this.connection.play(stream);
        this.currentSong = stream.info;

        if (!this.updateDispatcherStatus()) {
          this.updatePresenceWithSong();
        }

        this.removeAllListeners('skip');

        // Skip has been emitted.
        this.once('skip', (reason) => {
          stream.destroy();
          logger.info(reason || `(${this.currentSong.source}): ${this.currentSong.title} has been skipped.`);
          this.play();
        });

        // Song started
        this.dispatcher.on('start', () => {
          logger.info(`Playing (${this.currentSong.source}): ${this.currentSong.title} for ${this.listeners} user(s) in ${this.channel.name}.`);
        });

        // Song ended.
        this.dispatcher.on('speaking', (speaking) => {
          if (!speaking && !this.paused) {
            this.play();
          }
        });

        // Error while playing song.
        this.dispatcher.on('error', (error) => {
          logger.error(error);
          this.play();
        });

        // Show debug messages for dispatch.
        if (this.client.debug) {
          this.dispatcher.on('debug', (info) => {
            logger.debug(info);
          });
        }
      })
      .catch((error) => {
        logger.error(error);
        this.play();
      });
  }

  updateListeners() {
    this.listeners = this.channel.members.reduce((sum) => sum + 1, 0) - 1; // Self does not count.
  }

  updatePresenceWithSong() {
    const icon = this.paused ? '❙ ❙' : '►';
    return this.client.presenceManager.update(`${icon} ${this.currentSong.title}`);
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
    if (!this.paused) {
      return false;
    }

    if (this.isStreamExpired()) {
      this.emit('skip', 'Stream has expired, skipping...');
      this.paused = false;
      return;
    }

    this.paused = false;
    this.dispatcher.resume();
    this.updatePresenceWithSong();
    logger.info('Music has been resumed.');
    return true;
  }

  pauseDispatcher() {
    if (this.paused || !this.pauseOnEmpty) {
      return false;
    }

    this.lastPauseTimestamp = Date.now();
    this.paused = true;
    this.dispatcher.pause();
    this.updatePresenceWithSong();
    logger.info('Music has been paused because nobody is in my channel.');
    return true;
  }

  isStreamExpired() {
    if (!this.lastPauseTimestamp) {
      return false;
    }

    return Date.now() - this.lastPauseTimestamp > Player.STREAM_MAX_AGE;
  }
}

Player.STREAM_MAX_AGE = 7200000; // TWO HOURS

module.exports = Player;
