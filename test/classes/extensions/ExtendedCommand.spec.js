import { Command } from 'discord.js-commando';
import logger from '@greencoast/logger';
import ExtendedCommand from '../../../src/classes/extensions/ExtendedCommand';
import { clientMock, messageMock } from '../../../__mocks__/discordMocks';

jest.mock('@greencoast/logger');

let command;

describe('Classes - Extensions - ExtendedCommand', () => {
  const options = {
    name: 'name',
    group: 'group',
    memberName: 'name',
    description: 'description',
    emoji: 'emoji'
  };

  beforeEach(() => {
    logger.info.mockClear();
    messageMock.reply.mockClear();
    clientMock.handleCommandError.mockClear();

    command = new ExtendedCommand(clientMock, options);
  });

  it('should be an instance of Command.', () => {
    expect(command).toBeInstanceOf(Command);
  });

  it('should have an emoji property.', () => {
    expect(command.emoji).toBe(options.emoji);
  });

  describe('onError()', () => {
    it('should call message.reply with the proper message.', () => {
      command.onError(new Error(), messageMock);
      expect(messageMock.reply).toBeCalledTimes(1);
      expect(messageMock.reply).toHaveBeenCalledWith('Something wrong happened when executing this command.');
    });

    it('should call client.handleCommandError() with the proper parameters.', () => {
      const error = new Error();
      command.onError(error, messageMock);
      const expectedMessage = `An error occurred when running the command **${command.name}** in **${messageMock.guild.name}**. Triggering message: **${messageMock.content}**`;

      expect(clientMock.handleCommandError).toBeCalledTimes(1);
      expect(clientMock.handleCommandError).toHaveBeenCalledWith(error, expectedMessage);
    });
  });

  describe('run()', () => {
    it('should log a proper message if command is run from guild.', () => {
      command.run(messageMock);

      expect(logger.info).toBeCalledTimes(1);
      expect(logger.info).toHaveBeenCalledWith(`User ${messageMock.member.displayName} executed ${command.name} from ${messageMock.guild.name}.`);
    });

    it('should log a proper message if command is run from DM.', () => {
      command.run({ ...messageMock, member: null, guild: null });

      expect(logger.info).toBeCalledTimes(1);
      expect(logger.info).toHaveBeenCalledWith(`User ${messageMock.author.username} executed ${command.name} from DM.`);
    });
  });
});
