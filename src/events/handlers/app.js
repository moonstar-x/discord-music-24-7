const logger = require('@greencoast/logger');

const handleDebug = (info) => {
  logger.debug(info);
};

const handleError = (error) => {
  logger.error(error);
};

const handleGuildCreate = (client, guild) => {
  const numOfGuilds = client.guilds.cache.array().length;

  if (numOfGuilds > 1) {
    logger.warn(`Joined the guild ${guild.name}. I'm designed to work only on one server. Currently I'm connected to ${numOfGuilds} servers, unexpected behavior may occur.`);
  } else {
    logger.info(`Joined the guild ${guild.name}!`);
  }
};

const handleGuildDelete = (client, guild) => {
  const numOfGuilds = client.guilds.cache.array().length;

  if (numOfGuilds > 1) {
    logger.warn(`Left the guild ${guild.name}. I'm designed to work only on one server. Currently I'm connected to ${numOfGuilds} servers, unexpected behavior may occur.`);
  } else if (numOfGuilds === 0) {
    logger.warn(`Left the guild ${guild.name}! I'm not connected to any server! :( Please invite me to a server and restart me.`);
  } else {
    logger.info(`Left the guild ${guild.name}!`);
  }
};

const handleGuildUnavailable = (guild) => {
  logger.warn(`Guild ${guild.name} is currently unavailable!`);
};

const handleInvalidated = () => {
  logger.fatal('Client connection invalidated, terminating execution with code 1.');
  process.exit(1);
};

const handleReady = (player) => {
  logger.info('Connected to Discord! - Ready.');
  player.initialize();
};

const handleVoiceStateUpdate = (player, oldState, newState) => {
  const oldChannel = oldState.channel ? oldState.channel.id : null;
  const newChannel = newState.channel ? newState.channel.id : null;

  if (oldChannel === newChannel) {
    return;
  }

  const botWasInOldChannel = oldChannel === player.channel.id;
  const botIsInNewChannel = newChannel === player.channel.id;

  if (botWasInOldChannel && !botIsInNewChannel && newState.id === player.client.user.id) {
    player.updateChannel(newState.channel);
    player.updateListeners();
    player.updateDispatcherStatus();
    return;
  }

  if ((!oldChannel && botIsInNewChannel) || botIsInNewChannel) {
    logger.info(`User ${newState.member.displayName} has joined ${player.channel.name}.`);
    player.updateListeners();
    player.updateDispatcherStatus();
    return;
  }

  if ((!newChannel && botWasInOldChannel) || botWasInOldChannel) {
    logger.info(`User ${oldState.member.displayName} has left ${player.channel.name}.`);
    player.updateListeners();
    player.updateDispatcherStatus();
  }
};

const handleWarn = (info) => {
  logger.warn(info);
};

module.exports = {
  handleDebug,
  handleError,
  handleGuildCreate,
  handleGuildDelete,
  handleGuildUnavailable,
  handleInvalidated,
  handleReady,
  handleVoiceStateUpdate,
  handleWarn
};
