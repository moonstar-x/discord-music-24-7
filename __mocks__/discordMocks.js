import EventEmitter from 'events';

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

export const memberMock = {
  displayName: 'display name'
};

export const guildMock = {
  name: 'guild name'
};

export const dispatcherMock = {
  resume: jest.fn(),
  pause: jest.fn()
};

export const connectionMock = {
  play: jest.fn(() => dispatcherMock)
};

export const channelMock = {
  joinable: true,
  name: 'channel',
  guild: guildMock,
  join: jest.fn(() => Promise.resolve(connectionMock)),
  members: [memberMock, memberMock]
};

export const clientMock = {
  commandPrefix: '!',
  handleCommandError: jest.fn(),
  registry: {
    groups: [commandGroupMock, commandGroupMock]
  },
  channels: {
    fetch: jest.fn(() => Promise.resolve(channelMock))
  },
  updatePresence: jest.fn(),
  player: new EventEmitter()
};

export const messageMock = {
  reply: jest.fn(),
  guild: guildMock,
  content: 'message',
  member: memberMock,
  author: userMock,
  embed: jest.fn(),
  say: jest.fn()
};
