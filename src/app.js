/* eslint-disable max-statements */
import logger from '@greencoast/logger';
import path from 'path';
import { discordToken, prefix, ownerID } from './common/settings';
import ExtendedClient from './classes/extensions/ExtendedClient';

const client = new ExtendedClient({
  commandPrefix: prefix,
  owner: ownerID
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['misc', 'Miscellaneous Commands'],
    ['player', 'Player Commands']
  ])
  .registerCommandsIn(path.join(__dirname, 'commands'));

if (client.debugEnabled) {
  client.on('debug', (info) => {
    logger.debug(info);
  });
}

client.on('error', (error) => {
  client.handleError(error);
});

client.on('guildCreate', (guild) => {
  logger.info(`Joined ${guild.name} guild!`);
  client.updatePresence();
});

client.on('guildDelete', (guild) => {
  logger.info(`Left ${guild.name} guild!`);
  client.updatePresence();
});

client.on('guildUnavailable', (guild) => {
  logger.warn(`The guild ${guild.name} is unavailable!`);
});

client.on('invalidated', () => {
  logger.fatal('The client has been invalidated. Exiting with code 1.');
  process.exit(1);
});

client.on('rateLimit', (info) => {
  logger.warn(info);
});

client.on('ready', () => {
  logger.info('Connected to Discord! - Ready.');

  client.player.initialize()
    .catch(() => {
      process.exit(1);
    });
});

client.on('warn', (info) => {
  logger.warn(info);
});

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

client.login(discordToken);
