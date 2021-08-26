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
    if (!message.member.voice.channel || message.member.voice.channel.id !== this.client.player.channel.id) {
      return message.reply(`You need to be in ${this.client.player.channel} in order to skip the current song.`);
    }

    this.client.player.skipCurrentSong(`User ${message.member.displayName} has skipped the current song.`);
    
    return message.channel.send('Song has been skipped!');
  }
}

module.exports = SkipCommand;
