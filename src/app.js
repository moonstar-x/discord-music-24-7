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
    ['player', 'Player Commands'],
    ['owner-only', 'Owner-Only Commands']
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

client.login(discordToken);
