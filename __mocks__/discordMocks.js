const { EventEmitter } = require('events');

const userMock = {
  username: 'username'
};

const commandMock = {
  name: 'command',
  description: 'description'
};

const commandGroupMock = {
  name: 'group',
  commands: [commandMock, commandMock]
};

const memberMock = {
  displayName: 'display name'
};

const guildMock = {
  name: 'guild name'
};

const dispatcherMock = {
  resume: jest.fn(),
  pause: jest.fn()
};

const connectionMock = {
  play: jest.fn(() => dispatcherMock)
};

const channelMock = {
  joinable: true,
  name: 'channel',
  guild: guildMock,
  join: jest.fn(() => Promise.resolve(connectionMock)),
  send: jest.fn(),
  members: [memberMock, memberMock]
};

const clientMock = {
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

const messageMock = {
  reply: jest.fn(),
  guild: guildMock,
  content: 'message',
  member: memberMock,
  author: userMock,
  channel: channelMock
};

module.exports = {
  userMock,
  commandMock,
  commandGroupMock,
  memberMock,
  guildMock,
  dispatcherMock,
  connectionMock,
  channelMock,
  clientMock,
  messageMock
};
