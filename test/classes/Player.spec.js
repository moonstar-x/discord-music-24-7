/* eslint-disable max-statements */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-lines */
const fs = require('fs');
const logger = require('@greencoast/logger');
const Player = require('../../src/classes/Player');
const { clientMock, channelMock, connectionMock, dispatcherMock } = require('../../__mocks__/discordMocks');
const Queue = require('../../src/classes/Queue');
const DataFolderManager = require('../../src/classes/DataFolderManager');
const MissingArgumentError = require('../../src/classes/errors/MissingArgumentError');
const VoiceChannelError = require('../../src/classes/errors/VoiceChannelError');

jest.mock('fs');
jest.mock('../../src/classes/providers/ProviderFactory', () =>
  class {
    constructor() {
      this.getInstance = jest.fn(() => ({ createStream: jest.fn(() => Promise.resolve({ info: 'song' })) }));
    }
  }
);
jest.mock('@greencoast/logger');

const mockedQueue = [
  'this is no url',
  'https://www.youtube.com/watch?v=PYGODWJgR-c',
  'https://youtu.be/PYGODWJgR-c'
];

const currentSong = {
  title: 'Song title',
  source: 'SOURCE'
};

describe('Classes - Player', () => {
  let player;
  let playSpy;

  beforeAll(() => {
    fs.readFileSync.mockReturnValue(mockedQueue.join('\n'));
  });

  beforeEach(() => {
    player = new Player(clientMock);
    playSpy = jest.spyOn(player, 'play');
    playSpy.mockReturnValue(null);

    clientMock.presenceManager.update.mockClear();
    logger.info.mockClear();
    channelMock.join.mockClear();
    dispatcherMock.resume.mockClear();
    dispatcherMock.pause.mockClear();
  });

  describe('_initializeIntermission()', () => {
    it('should set intermission properties to null if intermissionInterval is null.', () => {
      player._initializeIntermission(null);

      expect(player.intermissionInterval).toBeNull();
      expect(player.intermissionDataFolderManager).toBeNull();
      expect(player.intermissionQueue).toBeNull();
    });

    it('should throw if intermissionInterval is inferior to 1.', () => {
      expect(() => {
        player._initializeIntermission(0);
      }).toThrow();
      expect(() => {
        player._initializeIntermission(-1);
      }).toThrow();
    });

    it('should set intermission properties with a valid intermissionInterval.', () => {
      player._initializeIntermission(1);

      expect(player.intermissionInterval).toBe(1);
      expect(player.intermissionDataFolderManager).toBeInstanceOf(DataFolderManager);
      expect(player.intermissionQueue).toBeInstanceOf(Queue);
    });
  });

  describe('initialize()', () => {
    it('should reject MissingArgumentError if no channelID is passed.', () => {
      expect.assertions(1);

      return player.initialize(null)
        .catch((error) => {
          expect(error).toBeInstanceOf(MissingArgumentError);
        });
    });

    it('should update presence with correct status.', () => {
      return player.initialize('123')
        .then(() => {
          expect(clientMock.presenceManager.update).toHaveBeenCalledTimes(1);
        });
    });

    it('should reject VoiceChannelError if channel is not joinable.', () => {
      clientMock.channels.fetch.mockResolvedValueOnce({ ...channelMock, joinable: false });
      expect.assertions(2);
      
      return player.initialize(channelMock.id)
        .catch((error) => {
          expect(error).toBeInstanceOf(VoiceChannelError);
          expect(error.message).toContain('permissions');
        });
    });

    it('should reject VoiceChannelError if channel does not exist.', () => {
      const notFoundError = 'DiscordAPIError: Unknown Channel';

      clientMock.channels.fetch.mockRejectedValueOnce(notFoundError);
      expect.assertions(2);
      
      return player.initialize(channelMock.id)
        .catch((error) => {
          expect(error).toBeInstanceOf(VoiceChannelError);
          expect(error.message).toContain('does not exist');
        });
    });

    it('should reject VoiceChannelError if other error occurred.', () => {
      clientMock.channels.fetch.mockRejectedValueOnce(new Error('Oops'));
      expect.assertions(2);
      
      return player.initialize(channelMock.id)
        .catch((error) => {
          expect(error).toBeInstanceOf(VoiceChannelError);
          expect(error.message).toContain('Something went wrong');
        });
    });
  });

  describe('updateChannel()', () => {
    it('should log the channel update.', () => {
      player.updateChannel(channelMock);
      expect(logger.info).toHaveBeenCalledTimes(1);
      expect(logger.info.mock.calls[0][0]).toContain(channelMock.name);
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

    it('should join the channel if no connection is present.', () => {
      player.updateChannel(channelMock);
      expect(channelMock.join).toHaveBeenCalledTimes(1);
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
  
  describe('skipCurrentSong()', () => {
    beforeEach(() => {
      player.stream = {
        destroy: jest.fn()
      };
    });

    it('should destroy the current stream.', () => {
      player.skipCurrentSong('reason');
      expect(player.stream.destroy).toHaveBeenCalled();
    });

    it('should log the skip reason.', () => {
      player.skipCurrentSong('reason');
      expect(logger.info).toHaveBeenCalledTimes(1);
      expect(logger.info).toHaveBeenCalledWith('reason');
    });

    it('should log the default reason if no reason is passed.', () => {
      player.currentSong = currentSong;
      player.skipCurrentSong();

      expect(logger.info).toHaveBeenCalledTimes(1);
      expect(logger.info.mock.calls[0][0]).toContain('has been skipped');
    });

    it('should call play.', () => {
      player.skipCurrentSong('reason');
      expect(playSpy).toBeCalledTimes(1);
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
    it('should update the presence.', () => {
      player.updatePresenceWithSong();
      expect(clientMock.presenceManager.update).toBeCalledTimes(1);
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
      player.stream = {
        destroy: jest.fn()
      };
    });

    describe('Currently paused.', () => {
      let isStreamExpiredSpy;

      beforeEach(() => {
        dispatcherMock.paused = true;
        isStreamExpiredSpy = jest.spyOn(player, 'isStreamExpired');
        isStreamExpiredSpy.mockReturnValue(false);
      });

      it('should resume the dispatcher.', () => {
        player.resumeDispatcher();

        expect(dispatcherMock.resume).toHaveBeenCalledTimes(1);
      });

      it('should update the presence.', () => {
        player.resumeDispatcher();

        expect(clientMock.presenceManager.update).toHaveBeenCalledTimes(1);
      });

      it('should log that the music resumed.', () => {
        player.resumeDispatcher();

        expect(logger.info).toHaveBeenCalledTimes(1);
        expect(logger.info.mock.calls[0][0]).toContain('resumed');
      });

      it('should skip the current song if the stream is expired.', () => {
        isStreamExpiredSpy.mockReturnValueOnce(true);
        const skipCurrentSongSpy = jest.spyOn(player, 'skipCurrentSong');
        player.resumeDispatcher();

        expect(skipCurrentSongSpy).toHaveBeenCalledTimes(1);
        expect(skipCurrentSongSpy).toHaveBeenCalledWith('Stream has expired, skipping...');
      });
    });

    describe('Currently playing.', () => {
      beforeEach(() => {
        player.dispatcher.paused = false;
      });

      it('should not resume the dispatcher.', () => {
        player.resumeDispatcher();

        expect(dispatcherMock.resume).not.toHaveBeenCalled();
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
        player.dispatcher.paused = true;
      });

      it('should not pause the dispatcher.', () => {
        player.pauseDispatcher();

        expect(dispatcherMock.pause).not.toHaveBeenCalled();
      });
    });

    describe('Currently playing.', () => {
      beforeEach(() => {
        player.dispatcher.paused = false;
        player.pauseOnEmpty = true;
      });

      it('should not pause the dispatcher if pauseOnEmpty is false.', () => {
        player.pauseOnEmpty = false;
        player.pauseDispatcher();

        expect(dispatcherMock.pause).not.toHaveBeenCalled();
      });

      it('should pause the dispatcher.', () => {
        player.pauseDispatcher();

        expect(dispatcherMock.pause).toHaveBeenCalledTimes(1);
      });

      it('should update the presence.', () => {
        player.pauseDispatcher();

        expect(clientMock.presenceManager.update).toHaveBeenCalledTimes(1);
      });

      it('should log that the music paused.', () => {
        player.pauseDispatcher();

        expect(logger.info).toHaveBeenCalledTimes(1);
        expect(logger.info.mock.calls[0][0]).toContain('paused');
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

    it('should return false if no there is no dispatcher.', () => {
      player.dispatcher = null;
      expect(player.isStreamExpired()).toBe(false);
    });

    it('should return false if the paused time is still in the max age time frame.', () => {
      const oldPausedTime = dispatcherMock.pausedTime;
      dispatcherMock.pausedTime = Player.STREAM_MAX_AGE - 1000;

      expect(player.isStreamExpired()).toBe(false);

      dispatcherMock.pausedTime = oldPausedTime;
    });

    it('should return true if the paused time is out of the max age time frame.', () => {
      const oldPausedTime = dispatcherMock.pausedTime;
      dispatcherMock.pausedTime = Player.STREAM_MAX_AGE + 1000;

      expect(player.isStreamExpired()).toBe(true);

      dispatcherMock.pausedTime = oldPausedTime;
    });
  });

  describe('static STREAM_MAX_AGE', () => {
    it('should be a number.', () => {
      expect(Player.STREAM_MAX_AGE).not.toBeNaN();
    });
  });
});
