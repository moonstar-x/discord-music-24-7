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

describe('Classes - Queue', () => {
  let queue;

  beforeAll(() => {
    fs.readFileSync.mockReturnValue(mockedQueue.join('\n'));
  });

  beforeEach(() => {
    fs.readFileSync.mockClear();
    queue = new Queue('filename');
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
