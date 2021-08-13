const { Command } = require('@greencoast/discord.js-extended');

class SkipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      aliases: ['s'],
      description: 'Skip the current song.',
      emoji: ':track_next:',
      group: 'player',
      guildOnly: true
    });

    this.player = client.player;
  }

  run(message) {
    this.player.emit('skip');

    return message.say('Song has been skipped!');
  }
}

module.exports = SkipCommand;
