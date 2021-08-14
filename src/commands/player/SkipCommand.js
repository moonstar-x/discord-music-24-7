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
  }

  run(message) {
    this.client.player.skipCurrentSong(`User ${message.member.displayName} has skipped the current song.`);
    
    return message.channel.send('Song has been skipped!');
  }
}

module.exports = SkipCommand;
