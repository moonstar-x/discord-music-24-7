const logger = require('@greencoast/logger');

class VoiceStateUpdater {
  constructor(client) {
    this.client = client;
  }

  handleUpdate(oldState, newState) {
    const oldChannelID = oldState.channel ? oldState.channel.id : null;
    const newChannelID = newState.channel ? newState.channel.id : null;

    if (oldChannelID === newChannelID) {
      return;
    }

    const botWasInOldChannel = oldChannelID === this.client.player.channel.id;
    const botIsInNewChannel = newChannelID === this.client.player.channel.id;

    if (this._wasBotMovedToAnotherChannel(botWasInOldChannel, botIsInNewChannel, newState)) {
      return this._handleBotMovedToAnotherChannel(newState.channel);
    }

    if (botIsInNewChannel) {
      return this._handleMemberJoinedChannel(newState.member);
    }

    if (botWasInOldChannel) {
      return this._handleMemberLeftChannel(oldState.member);
    }
  }

  _handleBotMovedToAnotherChannel(channel) {
    this.client.player.updateChannel(channel);
    this.client.player.updateListeners();
    this.client.player.updateDispatcherStatus();
  }

  _handleMemberJoinedChannel(member) {
    logger.info(`User ${member.displayName} has joined ${this.client.player.channel.name}.`);
    this.client.player.updateListeners();
    this.client.player.updateDispatcherStatus();
  }

  _handleMemberLeftChannel(member) {
    logger.info(`User ${member.displayName} has left ${this.client.player.channel.name}.`);
    this.client.player.updateListeners();
    this.client.player.updateDispatcherStatus();
  }

  _wasBotMovedToAnotherChannel(botWasInOldChannel, botIsInNewChannel, newState) {
    return newState.id === this.client.user.id && botWasInOldChannel && !botIsInNewChannel;
  }
}

module.exports = VoiceStateUpdater;
