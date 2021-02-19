[![discord](https://img.shields.io/discord/730998659008823296.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/mhj3Zsv)
[![trello](https://img.shields.io/badge/Trello-discord--music--24--7-red)](https://trello.com/b/vS6d2lej/discord-music-24-7)
[![ci-build-status](https://img.shields.io/github/workflow/status/moonstar-x/discord-music-24-7/CI?logo=github)](https://github.com/moonstar-x/discord-music-24-7)
[![open-issues-count](https://img.shields.io/github/issues-raw/moonstar-x/discord-music-24-7?logo=github)](https://github.com/moonstar-x/discord-music-24-7)
[![docker-image-size](https://img.shields.io/docker/image-size/moonstarx/discord-music-24-7?logo=docker)](https://hub.docker.com/repository/docker/moonstarx/discord-music-24-7)
[![docker-pulls](https://img.shields.io/docker/pulls/moonstarx/discord-music-24-7?logo=docker)](https://hub.docker.com/repository/docker/moonstarx/discord-music-24-7)

# discord-music-24-7

A 24/7 music bot for Discord that pauses when nobody is listening.

## Requirements

To self-host this bot, you'll need the following:

* [git](https://git-scm.com/)
* [node.js](https://nodejs.org/en/) (Version 12 or higher is required.)
* [ffmpeg](https://www.ffmpeg.org/)
* A C/C++ compiler installed (Required to install `@discordjs/opus`.) 

**ffmpeg** should be installed by default on Linux and MacOS, in case it isn't, install it with your package manager.

> **For Windows users**:
>
> For `ffmpeg`, head over to [ffmpeg's official website](https://www.ffmpeg.org/download.html#build-windows) to download the binary which will need to be added to your **\$PATH**. If you don't know how to add folders to your **\$PATH**, check out this [guide](https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/).
>
> For `C/C++ compiler`, head over to [Windows-Build-Tools on NPM](https://www.npmjs.com/package/windows-build-tools) and install the package globally.

## Installation

In order to self-host this bot, first you'll need to clone this repository.

```text
git clone https://github.com/moonstar-x/discord-music-24-7.git
```

Once cloned, proceed to install the dependencies:

```text
npm install
```

Then, proceed to build the bot:

```text
npm run build
```

## Configuration

There are two ways to configure the bot, one with a `settings.json` file inside the `config` folder or with environment variables.

Here's a table with the available options you may configure:

| Environment Variable   | JSON property            | Required                                                                                                                  | Description                                                                                                                               |
|------------------------|--------------------------|---------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| DISCORD_TOKEN          | `discord_token`          | Yes                                                                                                                       | Your Discord bot's token.                                                                                                                 |
| PREFIX                 | `prefix`                 | No (Defaults to `!`)                                                                                                      | The prefix the bot will use for the commands.                                                                                             |
| OWNER_ID               | `owner_id`               | No                                                                                                                        | The ID of the owner of the bot, mainly for owner-only commands. (None available yet.)                                                     |
| PRESENCE_TYPE          | `presence_type`          | No (Defaults to `PLAYING`)                                                                                                | The presence type that will be used. Can only be one of: `PLAYING`, `LISTENING`, `WATCHING` or `STREAMING`.                               |
| CHANNEL_ID             | `channel_id`             | Yes                                                                                                                       | The ID of the channel that will be auto joined by the bot.                                                                                |
| SHUFFLE                | `shuffle`                | No (Defaults to `true`)                                                                                                   | Whether the bot should shuffle the queue on start-up.                                                                                     |
| PAUSE_ON_EMPTY         | `pause_on_empty`         | No (Defaults to `true`)                                                                                                   | Whether the bot should pause the music when the channel is empty.                                                                         |
| CHANNEL_LEAVE_ON_EMPTY | `channel_leave_on_empty` | No (Defaults to `false`)                                                                                                  | Whether the bot should leave the channel when nobody is in it. (Not implemented yet!)                                                     |
| SOUNDCLOUD_CLIENT_ID   | `soundcloud_client_id`   | Only if queue contains a SoundCloud URL                                                                                   | Your SoundCloud Client ID. To find your Client ID, check out [this guide](https://www.npmjs.com/package/soundcloud-downloader#client-id). |
| YOUTUBE_COOKIE         | `youtube_cookie`         | Preferable to use, will authenticate YouTube requests with your cookie. Tries to avoid the `429 Too Many Requests` error. | Your YouTube cookie. To find your YouTube cookie, check out [this guide](#getting-429-too-many-requests).                                 |

> * To see how to find the IDs for users or channels, you can check out [this guide](<https://github.com/moonstar-x/discord-downtime-notifier/wiki/Getting-User,-Channel-and-Server-IDs>).
> * If you don't have a Discord token yet, you can see a guide on how to get one [here](<https://github.com/moonstar-x/discord-downtime-notifier/wiki/Getting-a-Discord-Bot-Token>).

## Using the Config File

Inside the `config` folder you will see a file named `settings.json.example`, rename it to `settings.json` and replace all the properties with your own values.

Your file should look like this:

```json
{
  "discord_token": "YOUR DISCORD TOKEN",
  "prefix": "!",
  "owner_id": "YOUR USER ID (IF YOU'RE THE OWNER)",
  "presence_type": "PLAYING",
  "channel_id": "THE CHANNEL ID OF THE CHANNEL THAT WILL BE USED BY THE BOT",
  "shuffle": true,
  "pause_on_empty": true,
  "channel_leave_on_empty": false,
  "soundcloud_client_id": "YOUR SOUNDCLOUD ID IF NEEDED",
  "youtube_cookie": "YOUR YOUTUBE COOKIE IF NEEDED"
}
```

## Usage

You can start the bot by running:

```text
npm start
```

The bot will automatically start playing music in the configured channel, it will also automatically pause when nobody is listening to the music to save bandwidth (if `pause_on_empty` or `PAUSE_ON_EMPTY` enabled).

This bot is designed to work only on one server at a time. Inviting your bot to multiple servers will yield unexpected behavior.

The music that is played is stored in the `queue.txt` inside the `data` folder. You can add the music you want the bot to play in this file. Any links must begin with `https://` or `http://`.

Additionally, you can play local music by inserting `.mp3` or `.m4a` files inside the `data/local-music` folder. Make sure the files are properly ID3 tagged so the bot can get the artist and song name from the metadata.

### Supported URLs

The bot can play music from the following URLs:

* `youtube.com`
* `youtu.be`
* `soundcloud.com`

Playlists are not officially supported yet. You may find that they may work but generally only the first song will be pulled from them.

### Getting 429 Too Many Requests

If you're reaching **429: Too Many Requests** errors in the console, then most likely you're being rate limited by YouTube because your connection is not authenticated.

Inside [Configuration](#configuration) you'll find a parameter called `youtube_cookie`, this is where you'll paste the cookie extracted from your YouTube login.

1. Head over to [YouTube](https://youtube.com) and login if you haven't already.
2. Then, open the developer inspector (**Ctrl+Shift+I** or **Cmd+Option+I**) and open the *Network* tab. Refresh the page if you're not getting a list of requests. (Make sure to select *All** in the filter tab).
3. Look for a request named `www.youtube.com` and check it's headers. Under `Response Headers` you will find the header `set-cookie`, this will contain a directive called `expires`, keep this date in mind because your cookie will be invalidated after this date and you may need to update the settings file manually prior to this date. (Currently looking for a way to avoid this.)
4. Inside the same request, look for the `Request Headers` and copy the content of the `cookie` header. This is the cookie that you'll need to paste inside the `settings.json` file or set as your YOUTUBE_COOKIE environment variable.

## Repl.it Support

Unfortunately, Repl.it [does not support ffmpeg anymore](https://repl.it/talk/ask/Installing-FFmpeg/28721) which means that this bot will not work on this.

## Docker Support

You can use the bot through Docker.

### Volumes

You may use the following volumes:

| Volume          | Description                                                                                                                  |
|-----------------|------------------------------------------------------------------------------------------------------------------------------|
| /opt/app/config | Volume where the config file is located. Generally not necessary since you can configure the bot with environment variables. |
| /opt/app/data   | Volume where the data folder is located. Here you can find the `queue.txt` file and the `local-music` folder.                |

### Environment Variables

You can configure the bot using environment variables. To do so, check out [configuration](#configuration) for a full list of what environment variables are used.

### Starting the Container

Starting the bot's container can be done by running:

```text
docker run -it -e DISCORD_TOKEN="YOUR DISCORD TOKEN" -e CHANNEL_ID="YOUR CHANNEL ID" -v "/local/folder/for/data":"/opt/app/data" moonstarx/discord-music-24-7:latest
```

## Author

This bot was made by [moonstar-x](https://github.com/moonstar-x) with contributions from [zackradisic](https://github.com/zackradisic) (Soundcloud support).
