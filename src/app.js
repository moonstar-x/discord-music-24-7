/* eslint-disable camelcase */
const { Client } = require('discord.js');
const { discord_token } = require('../config/settings');
const appEvents = require('./events/app');
const appHandlers = require('./events/handlers/app');
const Player = require('./classes/Player');

const client = new Client();
const player = new Player(client);

client.on(appEvents.error, appHandlers.handleError);
client.on(appEvents.guildCreate, appHandlers.handleGuildCreate);
client.on(appEvents.guildDelete, appHandlers.handleGuildDelete);
client.on(appEvents.guildUnavailable, appHandlers.handleGuildUnavailable);
client.on(appEvents.invalidated, appHandlers.handleInvalidated);
client.on(appEvents.ready, () => appHandlers.handleReady(player));
client.on(appEvents.voiceStateUpdate, appHandlers.handleVoiceStateUpdate);
client.on(appEvents.warn, appHandlers.handleWarn);

if (process.argv[2] === '--debug') {
  client.on(appEvents.debug, appHandlers.handleDebug);
}

client.login(discord_token);
