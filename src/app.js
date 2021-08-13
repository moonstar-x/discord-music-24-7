/* eslint-disable max-statements */
const path = require('path');
const logger = require('@greencoast/logger');
const { ExtendedClient, ConfigProvider } = require('@greencoast/discord.js-extended');
const { ACTIVITY_TYPE } = require('./constants');
const Player = require('./classes/Player');

const config = new ConfigProvider({
  env: process.env,
  configPath: path.join(__dirname, '../config/settings.json'),
  default: {
    PREFIX: '!',
    OWNER_ID: null,
    PRESENCE_TYPE: ACTIVITY_TYPE.PLAYING,
    CHANNEL_ID: null,
    SOUNDCLOUD_CLIENT_ID: null,
    YOUTUBE_COOKIE: null,
    SHUFFLE: true,
    PAUSE_ON_EMPTY: true,
    OWNER_REPORTING: false
  },
  types: {
    TOKEN: 'string',
    PREFIX: 'string',
    OWNER_ID: ['string', 'null'],
    PRESENCE_TYPE: 'string',
    CHANNEL_ID: 'string',
    SOUNDCLOUD_CLIENT_ID: ['string', 'null'],
    YOUTUBE_COOKIE: ['string', 'null'],
    SHUFFLE: 'boolean',
    PAUSE_ON_EMPTY: 'boolean',
    OWNER_REPORTING: 'boolean'
  }
});

const client = new ExtendedClient({
  config,
  debug: process.argv.includes('--debug'),
  errorOwnerReporting: config.get('OWNER_REPORTING'),
  owner: config.get('OWNER_ID'),
  prefix: config.get('PREFIX'),
  presence: {
    refreshInterval: null,
    type: config.get('PRESENCE_TYPE')
  }
});

client.player = new Player(client);

client
  .registerDefaultEvents()
  .registerExtraDefaultEvents();

client.registry
  .registerGroups([
    ['misc', 'Miscellaneous Commands'],
    ['player', 'Player Commands']
  ])
  .registerCommandsIn(path.join(__dirname, './commands'));

client.on('guildCreate', (guild) => {
  const numOfGuilds = client.guilds.cache.reduce((sum) => sum + 1, 0);

  if (numOfGuilds > 1) {
    logger.warn(`This bot is designed to work only on one server at a time. If you're seeing this message, it means your bot has been added to another server. Please, remove your bot from ${guild.name}.`);
  }
});

client.on('guildDelete', () => {
  const numOfGuilds = client.guilds.cache.reduce((sum) => sum + 1, 0);

  if (numOfGuilds > 1) {
    logger.warn(`This bot is designed to work only on one server at a time. If you're seeing this message, it means your bot is in more than a server. Currently, the bot is in ${numOfGuilds} servers. Please, remove it from the rest.`);
  }
});

client.on('ready', async() => {
  try {
    await client.player.initialize();
  } catch (error) {
    logger.fatal(error);
    process.exit(1);
  }
});

// TODO: Delegate this logic to a separate class.
client.on('voiceStateUpdate', (oldState, newState) => {
  const oldChannel = oldState.channel ? oldState.channel.id : null;
  const newChannel = newState.channel ? newState.channel.id : null;

  if (oldChannel === newChannel) {
    return;
  }

  const botWasInOldChannel = oldChannel === client.player.channel.id;
  const botIsInNewChannel = newChannel === client.player.channel.id;

  // Bot was moved to another channel.
  if (botWasInOldChannel && !botIsInNewChannel && newState.id === client.player.client.user.id) {
    client.player.updateChannel(newState.channel);
    client.player.updateListeners();
    client.player.updateDispatcherStatus();
    return;
  }

  // New user has joined the channel where the bot is in.
  if (!oldChannel && botIsInNewChannel || botIsInNewChannel) {
    logger.info(`User ${newState.member.displayName} has joined ${client.player.channel.name}.`);
    client.player.updateListeners();
    client.player.updateDispatcherStatus();
    return;
  }

  // A user has left the channel where the bot was in.
  if (!newChannel && botWasInOldChannel || botWasInOldChannel) {
    logger.info(`User ${oldState.member.displayName} has left ${client.player.channel.name}.`);
    client.player.updateListeners();
    client.player.updateDispatcherStatus();
  }
});

client.login(config.get('TOKEN'));
