/* eslint-disable no-new */
import AbstractProvider from '../../../src/classes/providers/AbstractProvider';

describe('Classes - Providers - AbstractProvider', () => {
  it('should throw if instantiating.', () => {
    expect(() => {
      new AbstractProvider();
    }).toThrow();
  });

  describe('static createStream()', () => {
    it('should throw if calling this method.', () => {
      expect(() => {
        AbstractProvider.createStream();
      }).toThrow();
    });
  });

  describe('static getInfo()', () => {
    it('should throw if calling this method.', () => {
      expect(() => {
        AbstractProvider.getInfo();
      }).toThrow();
    });
  });
});
