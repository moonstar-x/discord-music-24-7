/* eslint-disable no-new */
import fs from 'fs';
import Queue from '../../src/classes/Queue';
import MissingArgumentError from '../../src/classes/errors/MissingArgumentError';

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
  let queue;

  beforeAll(() => {
    fs.readFileSync.mockReturnValue(mockedQueue.join('\n'));
    fs.readdirSync.mockReturnValue(mockedMusicDirectory);
  });

  beforeEach(() => {
    fs.readFileSync.mockClear();
    queue = new Queue('filename', 'musicDir');
  });

  it('should throw MissingArgumentError if no queueFilename is provided.', () => {
    expect(() => {
      new Queue();
    }).toThrow(MissingArgumentError);
  });

  it('should have an index property initialized to 0.', () => {
    expect(queue.index).toBe(0);
  });

  it('should have a queue property.', () => {
    expect(queue.queue).toBeInstanceOf(Array);
  });

  it('should contain a queue with the correct items inside.', () => {
    expect(queue.queue).toHaveLength(4);
    expect(queue.queue).toContain('https://www.youtube.com/watch?v=PYGODWJgR-c');
    expect(queue.queue).toContain('https://youtu.be/PYGODWJgR-c');
    expect(queue.queue).toContain('local:musicDir/song1.mp3');
    expect(queue.queue).toContain('local:musicDir/song2.m4a');
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
});
