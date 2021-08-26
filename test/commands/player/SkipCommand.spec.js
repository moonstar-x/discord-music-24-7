const SkipCommand = require('../../../src/commands/player/SkipCommand');
const { clientMock, messageMock } = require('../../../__mocks__/discordMocks');

let command;

describe('Commands - Skip', () => {
  beforeEach(() => {
    messageMock.reply.mockClear();
    messageMock.channel.send.mockClear();

    command = new SkipCommand(clientMock);
  });

  it('should reply if the author is not in any channel.', () => {
    const oldChannel = { ...messageMock.member.voice.channel };
    messageMock.member.voice.channel = null;

    command.run(messageMock);

    expect(messageMock.reply).toHaveBeenCalledTimes(1);

    messageMock.member.voice.channel = oldChannel;
  });

  it('should reply if the author is not in the same channel as player.', () => {
    const oldChannelID = clientMock.player.channel.id;
    clientMock.player.channel.id = 'not_same';

    command.run(messageMock);

    expect(messageMock.reply).toHaveBeenCalledTimes(1);

    clientMock.player.channel.id = oldChannelID;
  });

  it('should skip the song.', () => {
    clientMock.player.channel.id = messageMock.member.voice.channel.id;
    command.run(messageMock);

    expect(clientMock.player.skipCurrentSong).toHaveBeenCalledTimes(1);
  });

  it('should reply that the song has been skipped.', () => {
    clientMock.player.channel.id = messageMock.member.voice.channel.id;
    command.run(messageMock);

    expect(messageMock.channel.send).toHaveBeenCalledTimes(1);
  });
});
