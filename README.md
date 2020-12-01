# discord-music-24-7

A 24/7 music bot for Discord that pauses when nobody is listening.

## Requirements

To self-host this bot, you'll need the following:

* [git](https://git-scm.com/)
* [node.js](https://nodejs.org/en/) (Version 12 or higher is required.)
* ffmpeg
* A C/C++ compiler installed (Required to install `@discordjs/opus`.)

**ffmpeg** should be installed by default on Linux and MacOS, in case it isn't, install it with your package manager. For Windows users, head over to [ffmpeg's official website](https://www.ffmpeg.org/download.html#build-windows) to download the binary which will need to be added to your **\$PATH**. If you don't know how to add folders to your **\$PATH**, check out this [guide](https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/).

## Installation

In order to self-host this bot, first you'll need to clone this repository.

```
git clone https://github.com/moonstar-x/discord-music-24-7.git
```

Then, inside the `config` folder, rename the file *settings.json.example* to *settings.json* and edit the file with your own Discord Token, your Soundcloud Client ID (if you wish to use Soundcloud), the ID of the channel where the music should be played and finally, whether you want the music queue to be shuffled on bot startup.
> * To see how to find these IDs, you can check out [this guide](<https://github.com/moonstar-x/discord-downtime-notifier/wiki/Getting-User,-Channel-and-Server-IDs>).
> * If you don't have a Discord token yet, you can see a guide on how to get one [here](<https://github.com/moonstar-x/discord-downtime-notifier/wiki/Getting-a-Discord-Bot-Token>).
> * If you don't know how to acquire your Soundcloud Client ID, check out [this guide](https://www.npmjs.com/package/soundcloud-downloader#client-id).

The `youtube_cookie` parameter is not required and can be left blank (`""`).

Your file should look like this:

```json
{
  "discord_token": "YOUR_DISCORD_TOKEN_HERE",
  "soundcloud_client_id": "YOUR_SOUNDCLOUD_CLIENT_ID",
  "youtube_cookie": "YOUR_YOUTUBE_COOKIE_IF_NEEDED",
  "channel_id": "1234567890",
  "shuffle": true
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

The music that is played is stored in the `queue.txt` inside the `data` folder. You can add the music you want the bot to play in this file. Any links must begin with `https://`, YouTube links must be from `youtube.com` and not from `youtu.be`.

This bot is designed to work only on one server at a time. Inviting your bot to multiple servers will yield unexpected behavior.

### Getting a Youtube Cookie

If you're reaching **429: Too Many Requests** errors in the console, then most likely you're being rate limited by YouTube because your connection is not authenticated.

Inside `settings.json` you'll find a parameter called `youtube_cookie`, this is where you'll paste the cookie extracted from your YouTube login.

1. Head over to [YouTube](https://youtube.com) and login if you haven't already.
2. Then, open the developer inspector (**Ctrl+Shift+I** or **Cmd+Option+I**) and open the *Network* tab. Refresh the page if you're not getting a list of requests. (Make sure to select *All** in the filter tab).
3. Look for a request named `www.youtube.com` and check it's headers. Under `Response Headers` you will find the header `set-cookie`, this will contain a directive called `expires`, keep this date in mind because your cookie will be invalidated after this date and you may need to update the settings file manually prior to this date. (Currently looking for a way to avoid this.)
4. Inside the same request, look for the `Request Headers` and copy the content of the `cookie` header. This is the cookie that you'll need to paste inside the `settings.json` file.

## Author

This bot was made by [moonstar-x](https://github.com/moonstar-x) with contributions from [zackradisic](https://github.com/zackradisic) (Soundcloud support).
