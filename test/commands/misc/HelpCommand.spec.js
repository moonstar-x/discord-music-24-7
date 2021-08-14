const Discord = require('discord.js');
const HelpCommand = require('../../../src/commands/misc/HelpCommand');
const { clientMock, messageMock } = require('../../../__mocks__/discordMocks');
const { MESSAGE_EMBED } = require('../../../src/constants');

let command;

jest.mock('discord.js', () => {
  const Discord = jest.requireActual('discord.js');

  Discord.MessageEmbed.prototype.setTitle = jest.fn(function() {
    return this;
  });
  Discord.MessageEmbed.prototype.setColor = jest.fn(function() {
    return this;
  });
  Discord.MessageEmbed.prototype.setThumbnail = jest.fn(function() {
    return this;
  });
  Discord.MessageEmbed.prototype.addField = jest.fn(function() {
    return this;
  });

  return Discord;
});

const embed = Discord.MessageEmbed.prototype;

describe('Commands - Help', () => {
  beforeEach(() => {
    messageMock.channel.send.mockClear();

    embed.setTitle.mockClear();
    embed.setColor.mockClear();
    embed.setThumbnail.mockClear();
    embed.addField.mockClear();

    command = new HelpCommand(clientMock);
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
    expect(messageMock.channel.send).toHaveBeenCalledTimes(1);
    expect(messageMock.channel.send.mock.calls[0][0]).toBeInstanceOf(Discord.MessageEmbed);
  });
});
