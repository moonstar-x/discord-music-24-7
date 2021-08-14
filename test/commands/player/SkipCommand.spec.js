const SkipCommand = require('../../../src/commands/player/SkipCommand');
const { clientMock, messageMock } = require('../../../__mocks__/discordMocks');

let command;

describe('Commands - Skip', () => {
  beforeEach(() => {
    messageMock.reply.mockClear();
    messageMock.channel.send.mockClear();

    command = new SkipCommand(clientMock);
  });

  it('should reply if the author is not in the same channel as player.', () => {
    const oldChannelID = clientMock.player.channel.id;
    clientMock.player.channel.id = 'not_same';

    command.run(messageMock);

    expect(messageMock.reply).toHaveBeenCalledTimes(1);

    clientMock.player.channel.id = oldChannelID;
  });

  it('should skip the song.', () => {
    const playerSpy = jest.spyOn(clientMock.player, 'skipCurrentSong');

    command.run(messageMock);

    expect(playerSpy).toHaveBeenCalledTimes(1);
  });

  it('should reply that the song has been skipped.', () => {
    command.run(messageMock);

    expect(messageMock.channel.send).toHaveBeenCalledTimes(1);
  });
});
