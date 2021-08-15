const userMock = {
  username: 'username',
  id: '123'
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
  displayName: 'display name',
  voice: {
    channel: {
      id: '123'
    }
  }
};

const guildMock = {
  name: 'guild name'
};

const dispatcherMock = {
  resume: jest.fn(function() {
    this.paused = false;
  }),
  pause: jest.fn(function() {
    this.paused = true;
  }),
  paused: false,
  pausedTime: 1000
};

const connectionMock = {
  play: jest.fn(() => dispatcherMock)
};

const channelMock = {
  joinable: true,
  name: 'channel',
  id: 'channel_id',
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
  player: {
    channel: channelMock,
    skipCurrentSong: jest.fn(),
    updateChannel: jest.fn(),
    updateListeners: jest.fn(),
    updateDispatcherStatus: jest.fn()
  },
  user: userMock,
  config: {
    get: jest.fn()
  },
  presenceManager: {
    update: jest.fn()
  }
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
