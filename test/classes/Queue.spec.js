const fs = require('fs');
const Queue = require('../../src/classes/Queue');
const DataFolderManager = require('../../src/classes/DataFolderManager');

jest.mock('fs');

const mockedQueue = [
  'this is no url',
  'https://www.youtube.com/watch?v=PYGODWJgR-c',
  'https://youtu.be/PYGODWJgR-c'
];

const mockedMusicDirectory = [
  'song1.mp3',
  'song2.m4a',
  'not a song.txt'
];

describe('Classes - Queue', () => {
  const dataFolderManager = new DataFolderManager({
    dataPath: '.'
  });
  let queue;

  beforeAll(() => {
    fs.readFileSync.mockReturnValue(mockedQueue.join('\n'));
    fs.readdirSync.mockReturnValue(mockedMusicDirectory);
  });

  beforeEach(() => {
    fs.readFileSync.mockClear();
    queue = new Queue(dataFolderManager);
  });

  it('should have an currentIndex property initialized to 0.', () => {
    expect(queue.currentIndex).toBe(0);
  });

  it('should have a queue property.', () => {
    expect(queue.queue).toBeInstanceOf(Array);
  });

  it('should contain a queue with the correct items inside.', () => {
    expect(queue.queue).toHaveLength(4);
    expect(queue.queue).toContain('https://www.youtube.com/watch?v=PYGODWJgR-c');
    expect(queue.queue).toContain('https://youtu.be/PYGODWJgR-c');
    expect(queue.queue).toContain('local:local-music/song1.mp3');
    expect(queue.queue).toContain('local:local-music/song2.m4a');
  });

  describe('getNext()', () => {
    it('should return an item of the queue.', () => {
      const next = queue.getNext();

      expect(queue.queue).toContain(next);
    });

    it('should restart queue if last item has been received.', () => {
      for (let i = 0; i < queue.queue.length * 2; i++) {
        const next = queue.getNext();

        expect(next).toBe(queue.queue[i % queue.queue.length]);
      }
    });
  });

  describe('getSize()', () => {
    it('should return the length of the queue.', () => {
      expect(queue.getSize()).toBe(queue.queue.length);
    });
  });

  describe('getCurrentIndex()', () => {
    it('should return the currentIndex.', () => {
      expect(queue.getCurrentIndex()).toBe(queue.currentIndex);
    });
  });
});
