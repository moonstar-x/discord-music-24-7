/* eslint-disable max-statements */
/* eslint-disable camelcase */
import fs from 'fs';

let settings;

const existsSyncMock = jest.spyOn(fs, 'existsSync');
const readFileSyncMock = jest.spyOn(fs, 'readFileSync');

describe('Common - Settings', () => {
  describe('With Config File', () => {
    const mockedFile = {
      discord_token: 'DISCORD_TOKEN',
      prefix: 'PREFIX',
      owner_id: 'OWNER_ID',
      shuffle: false,
      soundcloud_client_id: 'SOUNDCLOUD_CLIENT_ID',
      youtube_cookie: 'YOUTUBE_COOKIE',
      presence_type: 'LISTENING',
      pause_on_empty: false,
      channel_leave_on_empty: true,
      channel_id: '123'
    };

    beforeAll(() => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(mockedFile));
      process.env = {};

      jest.resetModules();
      settings = require('../../src/common/settings');
    });

    it('should have discordToken be set to what is in the config file.', () => {
      expect(settings.discordToken).toBe(mockedFile.discord_token);
    });

    it('should have prefix be set to what is in the config file.', () => {
      expect(settings.prefix).toBe(mockedFile.prefix);
    });

    it('should have ownerID be set to what is in the config file.', () => {
      expect(settings.ownerID).toBe(mockedFile.owner_id);
    });

    it('should have shuffle be set to what is in the config file.', () => {
      expect(settings.shuffle).toBe(mockedFile.shuffle);
    });

    it('should have soundcloudClientID be set to what is in the config file.', () => {
      expect(settings.soundcloudClientID).toBe(mockedFile.soundcloud_client_id);
    });

    it('should have youtubeCookie be set to what is in the config file.', () => {
      expect(settings.youtubeCookie).toBe(mockedFile.youtube_cookie);
    });

    it('should have presenceType be set to what is in the config file.', () => {
      expect(settings.presenceType).toBe(mockedFile.presence_type);
    });

    it('should have pauseOnEmpty be set to what is in the config file.', () => {
      expect(settings.pauseOnEmpty).toBe(mockedFile.pause_on_empty);
    });

    it('should have channelLeaveOnEmpty be set to what is in the config file.', () => {
      expect(settings.channelLeaveOnEmpty).toBe(mockedFile.channel_leave_on_empty);
    });

    it('should have channelID be set to what is in the config file.', () => {
      expect(settings.channelID).toBe(mockedFile.channel_id);
    });
  });

  describe('With Environment Variables', () => {
    const DISCORD_TOKEN = 'DISCORD_TOKEN';
    const PREFIX = 'PREFIX';
    const OWNER_ID = 'OWNER_ID';
    const SHUFFLE = 'false';
    const SOUNDCLOUD_CLIENT_ID = 'SOUNDCLOUD_CLIENT_ID';
    const YOUTUBE_COOKIE = 'YOUTUBE_COOKIE';
    const PRESENCE_TYPE = 'LISTENING';
    const PAUSE_ON_EMPTY = 'false';
    const CHANNEL_LEAVE_ON_EMPTY = 'true';
    const CHANNEL_ID = '123';

    beforeAll(() => {
      existsSyncMock.mockReturnValue(false);
      process.env = {
        DISCORD_TOKEN,
        PREFIX,
        OWNER_ID,
        SHUFFLE,
        SOUNDCLOUD_CLIENT_ID,
        YOUTUBE_COOKIE,
        PRESENCE_TYPE,
        PAUSE_ON_EMPTY,
        CHANNEL_LEAVE_ON_EMPTY,
        CHANNEL_ID
      };

      jest.resetModules();
      settings = require('../../src/common/settings');
    });

    it('should have discordToken be set to DISCORD_TOKEN.', () => {
      expect(settings.discordToken).toBe(DISCORD_TOKEN);
    });

    it('should have prefix be set to PREFIX.', () => {
      expect(settings.prefix).toBe(PREFIX);
    });

    it('should have ownerID be set to OWNER_ID.', () => {
      expect(settings.ownerID).toBe(OWNER_ID);
    });

    it('should have shuffle be set to SHUFFLE.', () => {
      expect(settings.shuffle).toBe(SHUFFLE === 'true');
    });

    it('should have soundcloudClientID be set to SOUNDCLOUD_CLIENT_ID.', () => {
      expect(settings.soundcloudClientID).toBe(SOUNDCLOUD_CLIENT_ID);
    });

    it('should have youtubeCookie be set to YOUTUBE_COOKIE.', () => {
      expect(settings.youtubeCookie).toBe(YOUTUBE_COOKIE);
    });

    it('should have presenceType be set to PRESENCE_TYPE.', () => {
      expect(settings.presenceType).toBe(PRESENCE_TYPE);
    });

    it('should have pauseOnEmpty be set to PAUSE_ON_EMPTY.', () => {
      expect(settings.pauseOnEmpty).toBe(PAUSE_ON_EMPTY === 'true');
    });

    it('should have channelLeaveOnEmpty be set to CHANNEL_LEAVE_ON_EMPTY.', () => {
      expect(settings.channelLeaveOnEmpty).toBe(CHANNEL_LEAVE_ON_EMPTY === 'true');
    });

    it('should have channelID be set to CHANNEL_ID.', () => {
      expect(settings.channelID).toBe(CHANNEL_ID);
    });
  });

  describe('Without Anything', () => {
    beforeAll(() => {
      existsSyncMock.mockReturnValue(false);
      process.env = { };

      jest.resetModules();
      settings = require('../../src/common/settings');
    });

    it('should have discordToken be set to null.', () => {
      expect(settings.discordToken).toBeNull();
    });

    it('should have prefix be set to !.', () => {
      expect(settings.prefix).toBe('!');
    });

    it('should have ownerID be set to null.', () => {
      expect(settings.ownerID).toBeNull();
    });

    it('should have shuffle be set to true.', () => {
      expect(settings.shuffle).toBe(true);
    });

    it('should have soundcloudClientID be set to null', () => {
      expect(settings.soundcloudClientID).toBeNull();
    });

    it('should have youtubeCookie be set to null.', () => {
      expect(settings.youtubeCookie).toBeNull();
    });

    it('should have presenceType be set to PLAYING.', () => {
      expect(settings.presenceType).toBe('PLAYING');
    });

    it('should have pauseOnEmpty be set to true.', () => {
      expect(settings.pauseOnEmpty).toBe(true);
    });

    it('should have channelLeaveOnEmpty be set to false.', () => {
      expect(settings.channelLeaveOnEmpty).toBe(false);
    });

    it('should have channelID be set to null.', () => {
      expect(settings.channelID).toBeNull();
    });
  });
});
