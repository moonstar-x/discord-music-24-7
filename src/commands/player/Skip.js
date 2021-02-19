import ExtendedCommand from '../../classes/extensions/ExtendedCommand';

class SkipCommand extends ExtendedCommand {
  constructor(client) {
    super(client, {
      name: 'skip',
      emoji: ':track_next:',
      memberName: 'skip',
      group: 'player',
      description: 'Skip the current song.',
      examples: [`${client.commandPrefix}skip`]
    });

    this.player = client.player;
  }

  run(message) {
    super.run(message);
    this.player.emit('skip');
    message.say('Song has been skipped!');
  }
}

export default SkipCommand;
