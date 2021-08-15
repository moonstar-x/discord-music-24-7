const AbstractProvider = require('../../../src/classes/providers/AbstractProvider');

describe('Classes - Providers - AbstractProvider', () => {
  it('should throw if instantiating.', () => {
    expect(() => {
      return new AbstractProvider();
    }).toThrow();
  });
});
