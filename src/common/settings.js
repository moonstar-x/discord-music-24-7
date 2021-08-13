/* eslint-disable prefer-destructuring */
const fs = require('fs');
const path = require('path');

const configFilePath = path.join(__dirname, '../../config/settings.json');
const configFromFile = fs.existsSync(configFilePath) ? JSON.parse(fs.readFileSync(configFilePath)) : {};

const discordToken = process.env.DISCORD_TOKEN || configFromFile.discord_token || null;
const prefix = process.env.PREFIX || configFromFile.prefix || '!';
const ownerID = process.env.OWNER_ID || configFromFile.owner_id || null;
const presenceType = process.env.PRESENCE_TYPE || configFromFile.presence_type || 'PLAYING';
const channelID = process.env.CHANNEL_ID || configFromFile.channel_id || null;

const soundcloudClientID = process.env.SOUNDCLOUD_CLIENT_ID || configFromFile.soundcloud_client_id || null;
const youtubeCookie = process.env.YOUTUBE_COOKIE || configFromFile.youtube_cookie || null;

// Boolean settings are a bit weird to parse with previous notation, especially if set value is falsy.
let shuffle;
if (process.env.hasOwnProperty('SHUFFLE')) {
  if (process.env.SHUFFLE === 'false') {
    shuffle = false;
  } else {
    shuffle = true;
  }
} else if (configFromFile.hasOwnProperty('shuffle')) {
  shuffle = configFromFile.shuffle;
} else {
  shuffle = true;
}

let pauseOnEmpty;
if (process.env.hasOwnProperty('PAUSE_ON_EMPTY')) {
  if (process.env.PAUSE_ON_EMPTY === 'false') {
    pauseOnEmpty = false;
  } else {
    pauseOnEmpty = true;
  }
} else if (configFromFile.hasOwnProperty('pause_on_empty')) {
  pauseOnEmpty = configFromFile.pause_on_empty;
} else {
  pauseOnEmpty = true;
}

// Still need to see how to implement this one. I don't even think it's necessary to have this.
// Will leave anyway since it is not used anywhere.
let channelLeaveOnEmpty;
if (process.env.hasOwnProperty('CHANNEL_LEAVE_ON_EMPTY')) {
  if (process.env.CHANNEL_LEAVE_ON_EMPTY === 'false') {
    channelLeaveOnEmpty = false;
  } else {
    channelLeaveOnEmpty = true;
  }
} else if (configFromFile.hasOwnProperty('channel_leave_on_empty')) {
  channelLeaveOnEmpty = configFromFile.channel_leave_on_empty;
} else {
  channelLeaveOnEmpty = false;
}

module.exports = {
  discordToken,
  prefix,
  ownerID,
  presenceType,
  channelID,
  soundcloudClientID,
  youtubeCookie,
  shuffle,
  pauseOnEmpty,
  channelLeaveOnEmpty
};
