/* eslint-disable no-new */
import fs from 'fs';
import Queue from '../../src/classes/Queue';
import MissingArgumentError from '../../src/classes/errors/MissingArgumentError';
import URLError from '../../src/classes/errors/URLError';
import { PROVIDERS } from '../../src/common/constants';

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

  describe('static parseQueue()', () => {
    it('should parse the queue to have the desired properties.', () => {
      queue.queue.forEach((entry) => {
        expect(entry).toHaveProperty('provider');
        expect(entry).toHaveProperty('url');
      });
    });

    it('should parse all urls that match the provider.', () => {
      queue.queue.forEach((entry) => {
        expect(Object.values(PROVIDERS).some((P) => P === entry.provider)).toBe(true);
        expect(entry.url.startsWith('http')).toBe(true);
        expect(mockedQueue.some((e) => e === entry.url));
      });
    });

    it('should throw if url is invalid.', () => {
      expect(() => {
        Queue.parseQueue([...mockedQueue, 'http://unknownurl.tld']);
      }).toThrow(URLError);
    });
  });

  describe('getNext()', () => {
    it('should return an item of the queue.', () => {
      const next = queue.getNext();

      expect(next).toHaveProperty('provider');
      expect(next).toHaveProperty('url');
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
