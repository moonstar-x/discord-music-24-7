export const userMock = {
  username: 'username'
};

export const clientMock = {
  commandPrefix: '!',
  handleCommandError: jest.fn()
};

export const memberMock = {
  displayName: 'display name'
};

export const guildMock = {
  name: 'guild name'
};

export const messageMock = {
  reply: jest.fn(),
  guild: guildMock,
  content: 'message',
  member: memberMock,
  author: userMock
};
