import logger from '@greencoast/logger';
import Queue from './Queue';
import ProviderFactory from './providers/ProviderFactory';
import MissingArgumentError from './errors/MissingArgumentError';
import VoiceChannelError from './errors/VoiceChannelError';
import { channelID, pauseOnEmpty } from '../common/settings';
import { QUEUE_PATH, LOCAL_MUSIC_PATH, createLocalMusicDirectoryIfNoExists, createQueueFileIfNoExists, createDataDirectoryIfNoExists } from '../common/paths';

class Player {
  constructor(client) {
    createDataDirectoryIfNoExists();
    createQueueFileIfNoExists();
    createLocalMusicDirectoryIfNoExists();

    this.client = client;
    this.queue = new Queue(QUEUE_PATH, LOCAL_MUSIC_PATH);
    this.channel = null;
    this.connection = null;
    this.dispatcher = null;
    this.paused = false;
    this.currentSong = null;
    this.listeners = 0;
  }

  initialize() {
    if (!channelID) {
      throw new MissingArgumentError('channelID is required in bot config!');
    }

    this.client.updatePresence('◼ Nothing to play');

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
    const provider = ProviderFactory.getInstance(url);

    return provider.createStream(url)
      .then((stream) => {
        // Something happened while creating the stream.
        if (!stream) {
          this.play();
        }

        this.dispatcher = this.connection.play(stream);
        this.currentSong = stream.info;
        logger.info(`Playing (${this.currentSong.source}): ${this.currentSong.title} for ${this.listeners} user(s) in ${this.channel.name}.`);

        if (!this.updateDispatcherStatus()) {
          this.updatePresenceWithSong();
        }

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
        if (this.client.debugEnabled) {
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
    return this.client.updatePresence(`${icon} ${this.currentSong.title}`);
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

    this.paused = false;
    this.dispatcher.resume();
    this.updatePresenceWithSong();
    logger.info('Music has been resumed.');
    return true;
  }

  pauseDispatcher() {
    if (this.paused || !pauseOnEmpty) {
      return false;
    }

    this.paused = true;
    this.dispatcher.pause();
    this.updatePresenceWithSong();
    logger.info('Music has been paused because nobody is in my channel.');
    return true;
  }
}

export default Player;
