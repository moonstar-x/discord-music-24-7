const { shuffleArray } = require('../../src/utils/array');

describe('Utils - Array', () => {
  describe('shuffleArray()', () => {
    let arr;
    let shuffled;

    beforeEach(() => {
      arr = Array.from(Array(100).keys());
      shuffled = shuffleArray([...arr]);
    });

    it('should return an Array.', () => {
      expect(shuffled).toBeInstanceOf(Array);
    });

    it('should return Array of same length.', () => {
      expect(shuffled).toHaveLength(arr.length);
    });

    it('should contain all elements of arr.', () => {
      for (const e of shuffled) {
        expect(shuffled).toContain(e);
      }
    });

    it('should shuffle the array.', () => {
      const arrString = arr.join('');
      const shuffledString = shuffled.join('');

      expect(arrString).not.toBe(shuffledString);
    });
  });
});
