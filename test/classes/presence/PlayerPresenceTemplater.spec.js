const PlayerPresenceTemplater = require('../../../src/classes/presence/PlayerPresenceTemplater');

const currentSongMock = {
  title: 'song',
  source: 'src'
};

const playerMock = {
  currentSong: currentSongMock,
  dispatcher: {
    paused: false
  },
  queue: {
    getCurrentIndex: () => 0,
    getSize: () => 1
  }
};

describe('Classes - Presence - PlayerPresenceTemplater', () => {
  let templater;

  beforeEach(() => {
    templater = new PlayerPresenceTemplater(playerMock);
  });

  describe('get()', () => {
    it('should throw if the key is not supported.', () => {
      expect(() => {
        templater.get('unknown');
      }).toThrow();
    });

    it('should return player song name for key song_name.', () => {
      expect(templater.get('song_name')).toBe(currentSongMock.title);
    });

    it('should return null string if player has no song name for key song_name.', () => {
      playerMock.currentSong = null;
      
      expect(templater.get('song_name')).toBe('null');

      playerMock.currentSong = currentSongMock;
    });

    it('should return player song source for key song_source.', () => {
      expect(templater.get('song_source')).toBe(currentSongMock.source);
    });

    it('should return null string if player has no song name for key song_source.', () => {
      playerMock.currentSong = null;
      
      expect(templater.get('song_source')).toBe('null');

      playerMock.currentSong = currentSongMock;
    });

    it('should return a stop icon if player has no dispatcher for key status_icon.', () => {
      const oldDispatcher = { ...playerMock.dispatcher };
      playerMock.dispatcher = null;
    
      expect(templater.get('status_icon')).toBe('◼');

      playerMock.dispatcher = oldDispatcher;
    });

    it('should return a paused icon if player dispatcher is paused for key status_icon.', () => {
      playerMock.dispatcher.paused = true;

      expect(templater.get('status_icon')).toBe('❙ ❙');
    });

    it('should return a play icon if player dispatcher is not paused for key status_icon.', () => {
      playerMock.dispatcher.paused = false;

      expect(templater.get('status_icon')).toBe('►');
    });

    it('should return the song index for key song_index.', () => {
      expect(templater.get('song_index')).toBe(playerMock.queue.getCurrentIndex());
    });

    it('should return the queue size for key queue_size.', () => {
      expect(templater.get('queue_size')).toBe(playerMock.queue.getSize());
    });
  });
});
