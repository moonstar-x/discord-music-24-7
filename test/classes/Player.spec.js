/* eslint-disable max-statements */
import fs from 'fs';
import logger from '@greencoast/logger';
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

    it('should return false if player is not paused already.', () => {
      player.paused = false;

      expect(player.resumeDispatcher()).toBe(false);
    });

    it('should return true if player was paused.', () => {
      player.paused = true;

      expect(player.resumeDispatcher()).toBe(true);
    });
  });

  describe('pauseDispatcher()', () => {
    beforeEach(() => {
      player.dispatcher = dispatcherMock;
      player.currentSong = currentSong;
      player.channel = channelMock;
    });

    it('should return false if player is paused already.', () => {
      player.paused = true;

      expect(player.pauseDispatcher()).toBe(false);
    });

    it('should return true if player was not paused.', () => {
      player.paused = false;

      expect(player.pauseDispatcher()).toBe(true);
    });
  });
});
