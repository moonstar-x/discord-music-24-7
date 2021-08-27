[![discord](https://img.shields.io/discord/730998659008823296.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/mhj3Zsv)
[![ci-build-status](https://img.shields.io/github/workflow/status/moonstar-x/discord-music-24-7/CI?logo=github)](https://github.com/moonstar-x/discord-music-24-7)
[![open-issues-count](https://img.shields.io/github/issues-raw/moonstar-x/discord-music-24-7?logo=github)](https://github.com/moonstar-x/discord-music-24-7)
[![docker-image-size](https://img.shields.io/docker/image-size/moonstarx/discord-music-24-7?logo=docker)](https://hub.docker.com/repository/docker/moonstarx/discord-music-24-7)
[![docker-pulls](https://img.shields.io/docker/pulls/moonstarx/discord-music-24-7?logo=docker)](https://hub.docker.com/repository/docker/moonstarx/discord-music-24-7)

# Discord Music 24/7

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
npm ci --only=prod
```

Or, if you wish to install the `devDependencies`:

```text
npm install
```

After you have [configured](#configuration) the bot, you can run it with:

```text
npm start
```

## Configuration

Inside the `config` folder, rename the file `settings.json.example` to `settings.json` and edit the file with you own Discord Token and other settings. If you don't have a Discord Token yet, you can see a guide on how to create it [here](https://github.com/moonstar-x/discord-downtime-notifier/wiki).

Your file should look like this.

```json
{
  "token": "YOUR_DISCORD_TOKEN",
  "prefix": "!",
  "owner_id": "123123123",
  "presence_type": "PLAYING",
  "channel_id": "123213123",
  "shuffle": true,
  "pause_on_empty": true,
  "owner_reporting": false,
  "soundcloud_client_id": "",
  "youtube_cookie": "",
  "presence_status": "{status_icon} {song_name}"
}
```

You may also configure these options with environment variables. The settings set with the environment variables will take higher precedence than the ones in the config JSON file.

This table contains all the configuration settings you may specify with both environment variables and the JSON config file.

| Environment Variable           | JSON property            | Required                                                                                                                                                                                                                          | Description                                                                                                                                              |
|--------------------------------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| DISCORD_TOKEN                  | `token`                  | Yes.                                                                                                                                                                                                                              | The bot's token.                                                                                                                                         |
| DISCORD_PREFIX                 | `prefix`                 | No. (Defaults to: `!`)                                                                                                                                                                                                            | The bot's prefix used for the commands.                                                                                                                  |
| DISCORD_OWNER_ID               | `owner_id`               | No. (Defaults to: `null`)                                                                                                                                                                                                         | The ID of the bot's owner. This is only necessary if `owner_reporting` is set to `true`.                                                                 |
| DISCORD_PRESENCE_TYPE          | `presence_type`          | No. (Defaults to: `PLAYING`)                                                                                                                                                                                                      | The presence type that will be used. Can only be one of: `PLAYING`, `LISTENING`, `WATCHING`, `STREAMING`, or `COMPETING`.                                |
| DISCORD_CHANNEL_ID             | `channel_id`             | Yes.                                                                                                                                                                                                                              | The ID of the channel that will be auto joined by the bot.                                                                                               |
| DISCORD_SHUFFLE                | `shuffle`                | No. (Defaults to `true`)                                                                                                                                                                                                          | Whether the bot should shuffle the queue on start-up.                                                                                                    |
| DISCORD_PAUSE_ON_EMPTY         | `pause_on_empty`         | No. (Defaults to `true`)                                                                                                                                                                                                          | Whether the bot should pause the music when the channel is empty.                                                                                        |
| DISCORD_OWNER_REPORTING        | `owner_reporting`        | No. (Defaults to `false`)                                                                                                                                                                                                         | Whether the bot should send DMs to the owner in case a command runs into an error. This is very unlikely with the amount of commands there is available. |
| DISCORD_SOUNDCLOUD_CLIENT_ID   | `soundcloud_client_id`   | Only required if queue contains a SoundCloud URL.                                                                                                                                                                                 | Your SoundCloud Client ID. To find your Client ID, check out [this guide](https://www.npmjs.com/package/soundcloud-downloader#client-id).                |
| DISCORD_YOUTUBE_COOKIE         | `youtube_cookie`         | Preferable to use if your bot is hosted in a network with a static public IP. This will authenticate YouTube requests with your cookie. Tries to avoid the [429 Too Many Requests](#getting-429-too-many-requests-youtube) error. | Your YouTube cookie. To find your YouTube cookie, check out [this guide](#getting-429-too-many-requests).                                                |
| DISCORD_PLAYING_STATUS         | `playing_status`         | No. (Defaults to `{status_icon} {song_name}`)                                                                                                                                                                                     | A customized playing status. Check [customizing status](#customizing-status) for more information on how to use this.                                    |
| DISCORD_INTERMISSION_INTERVAL  | `intermission_interval`  | No. (Defaults to `null`)                                                                                                                                                                                                          | The number of songs that are played before an intermission audio is played. Check [intermission audios](#intermission-audios) for more information.      |

> * To see how to find the IDs for users or channels, you can check out [this guide](<https://github.com/moonstar-x/discord-downtime-notifier/wiki/Getting-User,-Channel-and-Server-IDs>).
> * If you don't have a Discord token yet, you can see a guide on how to get one [here](<https://github.com/moonstar-x/discord-downtime-notifier/wiki/Getting-a-Discord-Bot-Token>).

### Customizing Status

You can customize the bot's presence status message. This status is updated every time the bot plays or pauses music playback or when a new song is being played.

You can add template keys wrapped in braced `{}` to aggregate dynamic information to your status message.

The following keys are supported:

* `{song_name}`: The current song being played.
* `{song_source}`: The source of the song being played. This is added by the Provider being used and can have values such as: `YT`, `SC`, `LOCAL` or `GENERIC`.
* `{status_icon}`: The icon of the status for the player. This corresponds to the stop, paused and playing icons.
* `{song_index}`: The index of the current song in the queue.
* `{queue_size}`: The size of the queue.

You can add how many of these you want into your status message. You can use as an example: `{status_icon} [{song_index}/{queue_size}]` which will turn into something like `► [3/20]`.

### Intermission Audios

Intermission audios try to emulate ads on a radio station. The `intermission_interval` setting represents the number of songs that will be played before an intermission audio is played. This means that every X number of songs in the queue, an intermission audio will be played.
This setting needs to be a positive number greater or equal to **1**.

If you set the `intermission_interval` to `null` in your config, no intermissions will be played. If you do add an `intermission_interval`,
the bot will generate a folder named `local-intermissions` and a file named `intermissions.txt` inside the `data` folder. Both of these act the same way as `local-music` and `queue.txt`, which means that intermission audios
can be added as local `.mp3` or `.m4a` files inside the `local-intermissions` folder and audio URLs can be added into the `intermissions.txt` file.

If you set an `intermission_interval`, you will need to add at least one file inside the `local-intermissions` folder or add at least an audio URL inside `intermissions.txt`, otherwise the bot will crash.

If you don't wish to use intermissions, simply leave `intermission_interval` set to `null`.

#### Intermission Audio Caveats

Keep in mind that since an intermission audio is not being pulled from the music queue, the `{song_index}` status key will not be incremented.

Currently, the presence status message update does not differentiate between a song being played from the queue and an intermission audio being played.

## Running on Docker

You can start a container with the bot's image by running:

```text
docker run -it -e DISCORD_TOKEN="YOUR DISCORD TOKEN" -e CHANNEL_ID="YOUR CHANNEL ID" -v "/local/folder/for/data":"/opt/app/data" moonstarx/discord-music-24-7:latest
```

Check [configuration](#configuration) to see which environment variables you can use.

The following volumes can be used:

* `/opt/app/config`: The config folder for the bot, here you can use the `settings.json` file to configure the bot if you don't want to use environment variables.
* `/opt/app/data`: The data folder for the bot. Here you can find the `queue.txt` file containing all the song URLs for the bot to play. There will also be a `local-music` folder to insert your MP3 or M4A files to play.

## Usage

Here's a list of all the commands for the bot:

| Command | Alias | Description                                             |
|---------|-------|---------------------------------------------------------|
| !skip   | !s    | Skip the current song being played.                     |
| !help   | !h    | Display a help message with all the available commands. |

The bot will automatically start playing music in the configured channel, it will also automatically pause when nobody is listening to the music to save bandwidth (if `pause_on_empty` or `PAUSE_ON_EMPTY` are enabled).

This bot is designed to work only on one server at a time. Inviting your bot to multiple servers will yield unexpected behavior.

The music that is played is stored in the `queue.txt` inside the `data` folder. You can add the music you want the bot to play in this file. Any links must begin with `https://` or `http://`.

Additionally, you can play local music by inserting `.mp3` or `.m4a` files inside the `data/local-music` folder. Make sure the files are properly ID3 tagged so the bot can get the artist and song name from the metadata.

## Supported URLs

The bot can play music from the following URLs:

* `youtube.com`
* `youtu.be`
* `soundcloud.com`

Playlists are not officially supported yet. You may find that they may work but generally only the first song will be pulled from them.

You can also play radio streams, as long as the stream is of the following types:

* `audio/aac`
* `audio/mpeg`
* `audio/ogg`
* `audio/opus`
* `audio/wav`

> Pausing/Resuming may take a bit longer with these streams.

## Getting 429 Too Many Requests (YouTube)

If you're reaching **429: Too Many Requests** errors in the console, then most likely you're being rate limited by YouTube because your connection is not authenticated.

Inside [Configuration](#configuration) you'll find a parameter called `youtube_cookie`, this is where you'll paste the cookie extracted from your YouTube login.

1. Head over to [YouTube](https://youtube.com) and login if you haven't already.
2. Then, open the developer inspector (**Ctrl+Shift+I** or **Cmd+Option+I**) and open the *Network* tab. Refresh the page if you're not getting a list of requests. (Make sure to select *All** in the filter tab).
3. Look for a request named `www.youtube.com` and check it's headers. Under `Response Headers` you will find the header `set-cookie`, this will contain a directive called `expires`, keep this date in mind because your cookie will be invalidated after this date and you may need to update the settings file manually prior to this date. (Currently looking for a way to avoid this.)
4. Inside the same request, look for the `Request Headers` and copy the content of the `cookie` header. This is the cookie that you'll need to paste inside the `settings.json` file or set as your YOUTUBE_COOKIE environment variable.

This solution has varied results, it works for some people, it doesn't for others.

## Repl.it Support

Unfortunately, Repl.it [does not support ffmpeg anymore](https://repl.it/talk/ask/Installing-FFmpeg/28721) which means that this bot will not work on this.

## Author

This bot was made by [moonstar-x](https://github.com/moonstar-x) with contributions from [zackradisic](https://github.com/zackradisic) (Soundcloud support).
