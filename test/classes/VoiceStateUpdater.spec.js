const logger = require('@greencoast/logger');
const VoiceStateUpdater = require('../../src/classes/VoiceStateUpdater');
const { clientMock, memberMock } = require('../../__mocks__/discordMocks');

jest.mock('@greencoast/logger');

const playerUpdateChannelSpy = jest.spyOn(clientMock.player, 'updateChannel');
const playerUpdateListenersSpy = jest.spyOn(clientMock.player, 'updateListeners');
const playerUpdateDispatcherStatusSpy = jest.spyOn(clientMock.player, 'updateDispatcherStatus');

describe('Classes - VoiceStateUpdater', () => {
  let updater;

  beforeEach(() => {
    updater = new VoiceStateUpdater(clientMock);

    playerUpdateChannelSpy.mockClear();
    playerUpdateListenersSpy.mockClear();
    playerUpdateDispatcherStatusSpy.mockClear();

    logger.info.mockClear();
  });

  describe('handleUpdate()', () => {
    it('should not do anything if states are in the same channel.', () => {
      const state = {
        channel: {
          id: '123'
        }
      };

      updater.handleUpdate(state, state);

      expect(playerUpdateChannelSpy).not.toHaveBeenCalled();
      expect(playerUpdateListenersSpy).not.toHaveBeenCalled();
      expect(playerUpdateDispatcherStatusSpy).not.toHaveBeenCalled();
    });

    it('should update if bot was moved.', () => {
      const oldState = {
        channel: clientMock.player.channel,
        id: clientMock.user.id
      };
      const newState = {
        channel: {
          id: '456'
        },
        id: clientMock.user.id
      };

      updater.handleUpdate(oldState, newState);

      expect(playerUpdateChannelSpy).toHaveBeenCalled();
      expect(playerUpdateListenersSpy).toHaveBeenCalled();
      expect(playerUpdateDispatcherStatusSpy).toHaveBeenCalled();
    });

    it('should update if bot was moved.', () => {
      const oldState = {
        channel: clientMock.player.channel,
        id: clientMock.user.id
      };
      const newState = {
        channel: {
          id: '456'
        },
        id: clientMock.user.id
      };

      updater.handleUpdate(oldState, newState);

      expect(playerUpdateChannelSpy).toHaveBeenCalled();
      expect(playerUpdateListenersSpy).toHaveBeenCalled();
      expect(playerUpdateDispatcherStatusSpy).toHaveBeenCalled();
    });

    it('should update if a member joins the channel.', () => {
      const oldState = {
        channel: {
          id: '456'
        },
        member: memberMock
      };
      const newState = {
        channel: clientMock.player.channel,
        member: memberMock
      };

      updater.handleUpdate(oldState, newState);

      expect(playerUpdateChannelSpy).not.toHaveBeenCalled();
      expect(playerUpdateListenersSpy).toHaveBeenCalled();
      expect(playerUpdateDispatcherStatusSpy).toHaveBeenCalled();

      expect(logger.info).toHaveBeenCalled();
      expect(logger.info.mock.calls[0][0]).toContain('joined');
    });

    it('should update if a member leaves the channel.', () => {
      const oldState = {
        channel: clientMock.player.channel,
        member: memberMock
      };
      const newState = {
        channel: '456',
        member: memberMock
      };

      updater.handleUpdate(oldState, newState);

      expect(playerUpdateChannelSpy).not.toHaveBeenCalled();
      expect(playerUpdateListenersSpy).toHaveBeenCalled();
      expect(playerUpdateDispatcherStatusSpy).toHaveBeenCalled();

      expect(logger.info).toHaveBeenCalled();
      expect(logger.info.mock.calls[0][0]).toContain('left');
    });
  });
});
