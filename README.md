# discord-music-24-7

A 24/7 music bot for Discord that pauses when nobody is listening.

## Requirements

To self-host this bot, you'll need the following:

* [git](https://git-scm.com/)
* [node.js](https://nodejs.org/en/)
* ffmpeg

**ffmpeg** should be installed by default on Linux and MacOS, in case it isn't, install it with your package manager. For Windows users, head over to [ffmpeg's official website](https://www.ffmpeg.org/download.html#build-windows) to download the binary which will need to be added to your **\$PATH**. If you don't know how to add folders to your **\$PATH**, check out this [guide](https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/).

## Dependencies

| Dependency:                                           | Description:                                                                                                  |
|-------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| [discord.js](https://github.com/discordjs/discord.js) | A powerful JavaScript library for interacting with the Discord API.                                           |
| [fs](https://www.npmjs.com/package/fs)                | File system utilities for Node.js.                                                                            |
| [logger](https://github.com/moonstar-x/logger)        | A small logger module for Node.js.                                                                            |
| [node-opus](https://www.npmjs.com/package/node-opus)  | This module implements bindings for Opus v1.1 for Node.js.                                                    |
| [ytdl-core](https://www.npmjs.com/package/ytdl-core)  | Yet another youtube downloading module. Written with only Javascript and a node-friendly streaming interface. |

## Installation

In order to self-host this bot, first you'll need to clone this repository.

```
git clone https://github.com/moonstar-x/discord-music-24-7.git
```

Then, inside the `config` folder, rename the file *settings.json.example* to *settings.json* and edit the file with your own Discord Token, and the ID's of the owner and the channel where the music should be played. To see how to find these IDs, you  can check out [this guide](<https://github.com/moonstar-x/discord-downtime-notifier/wiki/Getting-User,-Channel-and-Server-IDs>). If you don't have a Discord token yet, you can see a guide on how to get one [here](<https://github.com/moonstar-x/discord-downtime-notifier/wiki/Getting-a-Discord-Bot-Token>). Your file should look like this:

```json
{
  "discord_token": "YOUR_DISCORD_TOKEN_HERE",
  "channel_id": "1234567890",
  "owner_id": "0987654321"
}
```

Install the dependencies:

```
npm install
```

You can now run your bot:

```
npm start
```

## Usage

The bot will automatically start playing music in the configured channel, it will also automatically pause when nobody is listening to the music to save bandwidth.

The music that is played is stored in the `queue.txt` inside the `data` folder. You can add the music you want the bot to play in this file.

## Author

This bot was made by [moonstar-x](https://github.com/moonstar-x).