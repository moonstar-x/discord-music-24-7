const path = require('path');
const logger = require('@greencoast/logger');
const { ExtendedClient, ConfigProvider } = require('@greencoast/discord.js-extended');
const { ACTIVITY_TYPE } = require('./constants');
const Player = require('./classes/Player');
const VoiceStateUpdater = require('./classes/VoiceStateUpdater');
const PlayerPresenceTemplater = require('./classes/presence/PlayerPresenceTemplater');

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
    OWNER_REPORTING: false,
    PLAYING_STATUS: '{status_icon} {song_name}',
    INTERMISSION_INTERVAL: null
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
    OWNER_REPORTING: 'boolean',
    PLAYING_STATUS: 'string',
    INTERMISSION_INTERVAL: ['number', 'null']
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
client.voiceStateUpdater = new VoiceStateUpdater(client);
client.presenceManager.templater = new PlayerPresenceTemplater(client.player);

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
  const numOfGuilds = client.guilds.cache.reduce((sum) => sum + 1, 0);

  if (numOfGuilds > 1) {
    logger.warn(`This bot is designed to work only on one server at a time. If you're seeing this message, it means your bot is in more than a server. Currently, the bot is in ${numOfGuilds} servers. Please, remove it from the rest.`);
  }

  try {
    await client.player.initialize(config.get('CHANNEL_ID'));
  } catch (error) {
    logger.fatal(error);
    process.exit(1);
  }
});


client.on('voiceStateUpdate', (oldState, newState) => {
  return client.voiceStateUpdater.handleUpdate(oldState, newState);
});

client.login(config.get('TOKEN'));
