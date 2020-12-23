/* eslint-disable no-unused-vars */
/* eslint-disable max-params */
import { Command } from 'discord.js-commando';
import logger from '@greencoast/logger';

class ExtendedCommand extends Command {
  constructor(client, options) {
    super(client, options);

    this.emoji = options.emoji;
  }

  onError(err, message, ags, fromPattern, result) {
    this.client.handleCommandError(err, `An error occurred when running the command **${this.name}** in **${message.guild?.name || 'DM'}**. Triggering message: **${message.content}**`);
    return message.reply('Something wrong happened when executing this command.');
  }

  run(message, args, fromPattern, result) {
    logger.info(`User ${message.member?.displayName || message.author.username} executed ${this.name} from ${message.guild?.name || 'DM'}.`);
  }
}

export default ExtendedCommand;
