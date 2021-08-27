const { Templater } = require('@greencoast/discord.js-extended');

class PlayerPresenceTemplater extends Templater {
  constructor(player) {
    super([
      'song_name',
      'song_source',
      'status_icon',
      'song_index',
      'queue_size'
    ]);

    this.player = player;
  }

  get(key) {
    switch (key) {
      case 'song_name':
        return this.getSongName();

      case 'song_source':
        return this.getSongSource();

      case 'status_icon':
        return this.getStatusIcon();

      case 'song_index':
        return this.getSongIndex();
        
      case 'queue_size':
        return this.getQueueSize();

      default:
        throw new Error('Unknown key inserted in PlayerPresenceTemplater.');
    }
  }

  getSongName() {
    if (!this.player.currentSong) {
      return 'null';
    }
    
    return this.player.currentSong.title;
  }

  getSongSource() {
    if (!this.player.currentSong) {
      return 'null';
    }

    return this.player.currentSong.source;
  }

  getStatusIcon() {
    if (!this.player.dispatcher) {
      return '◼';
    }

    return this.player.dispatcher.paused ? '❙ ❙' : '►';
  }

  getSongIndex() {
    return this.player.queue.getCurrentIndex();
  }

  getQueueSize() {
    return this.player.queue.getSize();
  }
}

module.exports = PlayerPresenceTemplater;
