const logger = require('@greencoast/logger');

const handleDebug = (info) => {
  logger.debug(info);
};

const handleError = () => {

};

const handleGuildCreate = () => {

};

const handleGuildDelete = () => {

};

const handleGuildUnavailable = () => {

};

const handleInvalidated = () => {

};

const handleReady = () => {
  logger.info('Connected to Discord!');
};

const handleVoiceStateUpdate = () => {

};

const handleWarn = () => {

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
