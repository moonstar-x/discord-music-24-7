/* eslint-disable no-new */
import AbstractProvider from '../../../src/classes/providers/AbstractProvider';

describe('Classes - Providers - AbstractProvider', () => {
  it('should throw if instantiating.', () => {
    expect(() => {
      new AbstractProvider();
    }).toThrow();
  });
});
