import logger from '@greencoast/logger';
import SkipCommand from '../../../src/commands/player/Skip';
import ExtendedCommand from '../../../src/classes/extensions/ExtendedCommand';
import { clientMock, messageMock } from '../../../__mocks__/discordMocks';

let command;

jest.mock('@greencoast/logger');

describe('Commands - Skip', () => {
  beforeEach(() => {
    messageMock.say.mockClear();
    logger.info.mockClear();

    command = new SkipCommand(clientMock);
  });

  it('should be instance of ExtendedCommand.', () => {
    expect(command).toBeInstanceOf(ExtendedCommand);
  });

  it('should call logger.info with the proper message.', () => {
    command.run(messageMock);

    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(`User ${messageMock.member.displayName} executed ${command.name} from ${messageMock.guild.name}.`);
  });

  it('should emit the skip event for the player.', () => {
    const playerSpy = jest.spyOn(command.player, 'emit');

    command.run(messageMock);

    expect(playerSpy).toHaveBeenCalledTimes(1);
    expect(playerSpy).toHaveBeenCalledWith('skip');
  });

  it('should reply that the song has been skipped.', () => {
    command.run(messageMock);

    expect(messageMock.say).toHaveBeenCalledTimes(1);
    expect(messageMock.say).toHaveBeenCalledWith('Song has been skipped!');
  });
});
