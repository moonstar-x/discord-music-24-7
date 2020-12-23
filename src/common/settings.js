/* eslint-disable prefer-destructuring */
import fs from 'fs';
import path from 'path';

const configFilePath = path.join(__dirname, '../../config/settings.json');
const configFromFile = fs.existsSync(configFilePath) ? JSON.parse(fs.readFileSync(configFilePath)) : {};

export const discordToken = process.env.DISCORD_TOKEN || configFromFile.discord_token || null;
export const prefix = process.env.PREFIX || configFromFile.prefix || '!';
export const ownerID = process.env.OWNER_ID || configFromFile.owner_id || null;

export const soundcloudClientID = process.env.SOUNDCLOUD_CLIENT_ID || configFromFile.soundcloud_client_id || null;
export const youtubeCookie = process.env.YOUTUBE_COOKIE || configFromFile.youtube_cookie || null;

// Shuffle setting is a bit complicated with previous notation.
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

export { shuffle };
