export const userMock = {
  username: 'username'
};

export const commandMock = {
  name: 'command',
  description: 'description'
};

export const commandGroupMock = {
  name: 'group',
  commands: [commandMock, commandMock]
};

export const clientMock = {
  commandPrefix: '!',
  handleCommandError: jest.fn(),
  registry: {
    groups: [commandGroupMock, commandGroupMock]
  }
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
  author: userMock,
  embed: jest.fn()
};
