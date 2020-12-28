/* eslint-disable max-lines */
/* eslint-disable max-statements */
import fs from 'fs';
import logger from '@greencoast/logger';
import EventEmitter from 'events';
import Player from '../../src/classes/Player';
import { clientMock, channelMock, connectionMock, dispatcherMock } from '../../__mocks__/discordMocks';
import Queue from '../../src/classes/Queue';
import MissingArgumentError from '../../src/classes/errors/MissingArgumentError';
import VoiceChannelError from '../../src/classes/errors/VoiceChannelError';
import * as settings from '../../src/common/settings';

jest.mock('fs');
jest.mock('../../src/classes/providers/ProviderFactory', () => ({
  getInstance: jest.fn(() => ({ createStream: jest.fn(() => Promise.resolve({ info: 'song' })) }))
}));
jest.mock('@greencoast/logger');

const dateNowSpy = jest.spyOn(Date, 'now');
const timestampMock = 1609184342966;
dateNowSpy.mockReturnValue(timestampMock);

const mockedQueue = [
  'this is no url',
  'https://www.youtube.com/watch?v=PYGODWJgR-c',
  'https://youtu.be/PYGODWJgR-c'
];

const currentSong = {
  title: 'Song title'
};

describe('Classes - Player', () => {
  let player;
  let playSpy;

  beforeAll(() => {
    settings.channelID = '123';
    fs.readFileSync.mockReturnValue(mockedQueue.join('\n'));
  });

  beforeEach(() => {
    player = new Player(clientMock);
    playSpy = jest.spyOn(player, 'play');
    playSpy.mockReturnValue(null);

    clientMock.updatePresence.mockClear();
    logger.info.mockClear();
    channelMock.join.mockClear();
    dispatcherMock.resume.mockClear();
    dispatcherMock.pause.mockClear();
  });

  it('should be instance of EventEmitter.', () => {
    expect(player).toBeInstanceOf(EventEmitter);
  });

  it('should contain a client property.', () => {
    expect(player.client).toBe(clientMock);
  });

  it('should contain a queue property.', () => {
    expect(player.queue).toBeInstanceOf(Queue);
  });

  it('should contain a channel property.', () => {
    expect(player).toHaveProperty('channel');
  });

  it('should contain a connection property.', () => {
    expect(player).toHaveProperty('connection');
  });

  it('should contain a dispatcher property.', () => {
    expect(player).toHaveProperty('dispatcher');
  });

  it('should contain a paused property.', () => {
    expect(player).toHaveProperty('paused');
  });

  it('should contain a currentSong property.', () => {
    expect(player).toHaveProperty('currentSong');
  });

  it('should contain a listeners property.', () => {
    expect(player).toHaveProperty('listeners');
  });

  it('should contain a lastPauseTimestamp property.', () => {
    expect(player).toHaveProperty('lastPauseTimestamp');
  });

  describe('initialize()', () => {
    it('should throw MissingArgumentError if no channelID is in settings.', () => {
      settings.channelID = null;

      expect(() => {
        player.initialize();
      }).toThrow(MissingArgumentError);

      settings.channelID = '123';
    });

    it('should call client.updatePresence with correct status.', () => {
      return player.initialize()
        .then(() => {
          expect(clientMock.updatePresence).toHaveBeenCalledTimes(1);
          expect(clientMock.updatePresence).toHaveBeenCalledWith('◼ Nothing to play');
        });
    });

    it('should reject VoiceChannelError if channel is not joinable.', () => {
      clientMock.channels.fetch.mockResolvedValueOnce({ ...channelMock, joinable: false });
      expect.assertions(2);
      
      return player.initialize()
        .catch((error) => {
          expect(error).toBeInstanceOf(VoiceChannelError);
          expect(error.message).toBe("I don't have enough permissions to join the configured voice channel!");
        });
    });

    it('should reject VoiceChannelError if channel does not exist.', () => {
      const notFoundError = 'DiscordAPIError: Unknown Channel';

      clientMock.channels.fetch.mockRejectedValueOnce(notFoundError);
      expect.assertions(2);
      
      return player.initialize()
        .catch((error) => {
          expect(error).toBeInstanceOf(VoiceChannelError);
          expect(error.message).toBe('The channel I tried to join does not exist. Please check the channelID set up in your bot config.');
        });
    });

    it('should reject VoiceChannelError if other error occurred.', () => {
      clientMock.channels.fetch.mockRejectedValueOnce(new Error('Oops'));
      expect.assertions(2);
      
      return player.initialize()
        .catch((error) => {
          expect(error).toBeInstanceOf(VoiceChannelError);
          expect(error.message).toBe('Something went wrong when trying to look for the channel I was supposed to join.');
        });
    });
  });

  describe('updateChannel()', () => {
    it('should log the channel update.', () => {
      player.updateChannel(channelMock);
      expect(logger.info).toHaveBeenCalledTimes(1);
      expect(logger.info).toHaveBeenCalledWith(`Joined ${channelMock.name} in ${channelMock.guild.name}.`);
    });

    it('should update the channel property.', () => {
      player.updateChannel(channelMock);
      expect(player.channel).toBe(channelMock);
    });

    it('should not join the channel if a connection is present.', () => {
      player.connection = 'connection';
      player.updateChannel(channelMock);
      expect(channelMock.join).not.toHaveBeenCalled();
    });

    it('should return undefined if a connection is present.', () => {
      player.connection = 'connection';
      expect(player.updateChannel(channelMock)).toBeUndefined();
    });

    it('should join the channel if no connection is present.', () => {
      player.updateChannel(channelMock);
      expect(channelMock.join).toHaveBeenCalledTimes(1);
    });

    it('should return a Promise if no connection is present.', () => {
      expect(player.updateChannel(channelMock)).toBeInstanceOf(Promise);
    });

    it('should update the connection if joining.', () => {
      return player.updateChannel(channelMock)
        .then(() => {
          expect(player.connection).toBe(connectionMock);
        });
    });

    it('should update listeners if joining.', () => {
      const oldListeners = player.listeners;
      
      return player.updateChannel(channelMock)
        .then(() => {
          expect(player.listeners).not.toBe(oldListeners);
        });
    });

    it('should not start playing if a dispatcher already exists.', () => {
      player.dispatcher = 'dispatcher';
      
      return player.updateChannel(channelMock)
        .then(() => {
          expect(playSpy).not.toHaveBeenCalled();
        });
    });

    it('should start playing if no dispatcher exists.', () => {
      return player.updateChannel(channelMock)
        .then(() => {
          expect(playSpy).toHaveBeenCalledTimes(1);
        });
    });
  });

  describe('updateListeners()', () => {
    it('should update the listeners property with the amount of users in VC.', () => {
      player.channel = channelMock;
      player.updateListeners();

      expect(player.listeners).toBe(channelMock.members.length - 1);
    });
  });

  describe('updatePresenceWithSong()', () => {
    beforeEach(() => {
      player.currentSong = currentSong;
    });

    it('should update presence with correct status if player is paused.', () => {
      player.paused = true;
      player.updatePresenceWithSong();
      expect(clientMock.updatePresence).toBeCalledTimes(1);
      expect(clientMock.updatePresence).toBeCalledWith(`❙ ❙ ${currentSong.title}`);
    });

    it('should update presence with correct status if player is not paused.', () => {
      player.paused = false;
      player.updatePresenceWithSong();
      expect(clientMock.updatePresence).toBeCalledTimes(1);
      expect(clientMock.updatePresence).toBeCalledWith(`► ${currentSong.title}`);
    });
  });

  describe('updateDispatcherStatus()', () => {
    beforeEach(() => {
      player.dispatcher = dispatcherMock;
    });

    it('should return null if no dispatcher is set.', () => {
      player.dispatcher = null;

      expect(player.updateDispatcherStatus()).toBeNull();
    });

    it('should call resumeDispatcher if there are more are than 0 listeners.', () => {
      player.listeners = 3;
      const resumeSpy = jest.spyOn(player, 'resumeDispatcher');
      resumeSpy.mockReturnValue(false);

      player.updateDispatcherStatus();

      expect(resumeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call pauseDispatcher if there are 0 listeners.', () => {
      player.listeners = 0;
      const pauseSpy = jest.spyOn(player, 'pauseDispatcher');
      pauseSpy.mockReturnValue(false);

      player.updateDispatcherStatus();

      expect(pauseSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('resumeDispatcher()', () => {
    beforeEach(() => {
      player.dispatcher = dispatcherMock;
      player.currentSong = currentSong;
      player.channel = channelMock;
    });

    describe('Currently paused.', () => {
      let isStreamExpiredSpy;

      beforeEach(() => {
        player.paused = true;
        isStreamExpiredSpy = jest.spyOn(player, 'isStreamExpired');
        isStreamExpiredSpy.mockReturnValue(false);
      });

      it('should return true.', () => {
        expect(player.resumeDispatcher()).toBe(true);
      });

      it('should update the paused property.', () => {
        player.resumeDispatcher();

        expect(player.paused).toBe(false);
      });

      it('should resume the dispatcher.', () => {
        player.resumeDispatcher();

        expect(dispatcherMock.resume).toHaveBeenCalledTimes(1);
      });

      it('should update the presence.', () => {
        player.resumeDispatcher();

        expect(clientMock.updatePresence).toHaveBeenCalledTimes(1);
        expect(clientMock.updatePresence).toHaveBeenCalledWith(`► ${currentSong.title}`);
      });

      it('should log that the music resumed.', () => {
        player.resumeDispatcher();

        expect(logger.info).toHaveBeenCalledTimes(1);
        expect(logger.info).toHaveBeenCalledWith('Music has been resumed.');
      });

      it('should emit the skip event if the stream is expired.', () => {
        isStreamExpiredSpy.mockReturnValueOnce(true);
        const emitSpy = jest.spyOn(player, 'emit');
        player.resumeDispatcher();

        expect(emitSpy).toHaveBeenCalledTimes(1);
        expect(emitSpy).toHaveBeenCalledWith('skip', 'Stream has expired, skipping...');
      });

      it('should update the paused property if the stream is expired.', () => {
        isStreamExpiredSpy.mockReturnValueOnce(true);
        player.resumeDispatcher();

        expect(player.paused).toBe(false);
      });
    });

    describe('Currently playing.', () => {
      beforeEach(() => {
        player.paused = false;
      });

      it('should return false.', () => {
        expect(player.resumeDispatcher()).toBe(false);
      });
    });
  });

  describe('pauseDispatcher()', () => {
    beforeEach(() => {
      player.dispatcher = dispatcherMock;
      player.currentSong = currentSong;
      player.channel = channelMock;
    });

    describe('Currently paused.', () => {
      beforeEach(() => {
        player.paused = true;
      });

      it('should return false.', () => {
        expect(player.pauseDispatcher()).toBe(false);
      });

      it('should return false if pauseOnEmpty is false.', () => {
        settings.pauseOnEmpty = false;
        expect(player.pauseDispatcher()).toBe(false);
        settings.pauseOnEmpty = true;
      });
    });

    describe('Currently playing.', () => {
      beforeEach(() => {
        player.paused = false;
      });

      it('should return true.', () => {
        expect(player.pauseDispatcher()).toBe(true);
      });

      it('should return false if pauseOnEmpty is false.', () => {
        settings.pauseOnEmpty = false;
        expect(player.pauseDispatcher()).toBe(false);
        settings.pauseOnEmpty = true;
      });

      it('should update the paused property.', () => {
        player.pauseDispatcher();

        expect(player.paused).toBe(true);
      });

      it('should update the lastPauseTimestamp property.', () => {
        player.pauseDispatcher();

        expect(player.lastPauseTimestamp).toBe(timestampMock);
      });

      it('should pause the dispatcher.', () => {
        player.pauseDispatcher();

        expect(dispatcherMock.pause).toHaveBeenCalledTimes(1);
      });

      it('should update the presence.', () => {
        player.pauseDispatcher();

        expect(clientMock.updatePresence).toHaveBeenCalledTimes(1);
        expect(clientMock.updatePresence).toHaveBeenCalledWith(`❙ ❙ ${currentSong.title}`);
      });

      it('should log that the music paused.', () => {
        player.pauseDispatcher();

        expect(logger.info).toHaveBeenCalledTimes(1);
        expect(logger.info).toHaveBeenCalledWith('Music has been paused because nobody is in my channel.');
      });
    });
  });

  describe('isStreamExpired()', () => {
    beforeEach(() => {
      player.dispatcher = dispatcherMock;
      player.currentSong = currentSong;
      player.channel = channelMock;
      player.paused = false;
    });

    it('should return false if no lastPauseTimestamp has been set previously.', () => {
      expect(player.isStreamExpired()).toBe(false);
    });

    it('should return false if the lastPauseTimestamp is still in the max age time frame.', () => {
      player.pauseDispatcher();

      dateNowSpy.mockReturnValueOnce(timestampMock + 5000);

      expect(player.isStreamExpired()).toBe(false);
    });

    it('should return true if the lastPauseTimestamp is out of the max age time frame.', () => {
      player.pauseDispatcher();

      dateNowSpy.mockReturnValueOnce(timestampMock + Player.STREAM_MAX_AGE + 5000);

      expect(player.isStreamExpired()).toBe(true);
    });
  });

  describe('static STREAM_MAX_AGE', () => {
    it('should be a number.', () => {
      expect(Player.STREAM_MAX_AGE).not.toBeNaN();
    });
  });
});
