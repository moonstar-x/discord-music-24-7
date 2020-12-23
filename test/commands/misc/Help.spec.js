import logger from '@greencoast/logger';
import Discord from 'discord.js';
import HelpCommand from '../../../src/commands/misc/Help';
import ExtendedCommand from '../../../src/classes/extensions/ExtendedCommand';
import { clientMock, messageMock } from '../../../__mocks__/discordMocks';
import { MESSAGE_EMBED } from '../../../src/common/constants';

let command;

jest.mock('@greencoast/logger');

jest.mock('discord.js', () => {
  const Discord = jest.requireActual('discord.js');

  Discord.MessageEmbed.prototype.setTitle = jest.fn();
  Discord.MessageEmbed.prototype.setColor = jest.fn();
  Discord.MessageEmbed.prototype.setThumbnail = jest.fn();
  Discord.MessageEmbed.prototype.addField = jest.fn();

  return Discord;
});

const embed = Discord.MessageEmbed.prototype;

describe('Commands - Help', () => {
  beforeEach(() => {
    messageMock.embed.mockClear();
    logger.info.mockClear();

    embed.setTitle.mockClear();
    embed.setColor.mockClear();
    embed.setThumbnail.mockClear();
    embed.addField.mockClear();

    command = new HelpCommand(clientMock);
  });
  
  it('should be instance of ExtendedCommand.', () => {
    expect(command).toBeInstanceOf(ExtendedCommand);
  });

  it('should call logger.info with the proper message.', () => {
    command.run(messageMock);

    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(`User ${messageMock.member.displayName} executed ${command.name} from ${messageMock.guild.name}.`);
  });

  it('should create an embed with the correct information.', () => {
    command.run(messageMock);

    expect(embed.setTitle).toHaveBeenCalledTimes(1);
    expect(embed.setColor).toHaveBeenCalledTimes(1);
    expect(embed.setThumbnail).toHaveBeenCalledTimes(1);
    expect(embed.addField).toHaveBeenCalledTimes(clientMock.registry.groups.length + 1);

    expect(embed.setTitle).toHaveBeenCalledWith('24/7 Music Bot Help Message');
    expect(embed.setColor).toHaveBeenCalledWith(MESSAGE_EMBED.color);
    expect(embed.setThumbnail).toHaveBeenCalledWith(MESSAGE_EMBED.thumbnail);

    expect(embed.addField).toHaveBeenCalledWith('Found a bug?', `This bot is far from perfect, so in case you found a bug, please report it [here](${MESSAGE_EMBED.issuesURL}).`);
  });

  it('should send an embed.', () => {
    command.run(messageMock);
    expect(messageMock.embed).toHaveBeenCalledTimes(1);
    expect(messageMock.embed.mock.calls[0][0]).toBeInstanceOf(Discord.MessageEmbed);
  });
});
