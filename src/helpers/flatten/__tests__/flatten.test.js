import flatten from '../flatten';

describe('flatten', () => {
  it('should return flattened array', () => {
    expect(flatten([['one'], ['two']])).toEqual(['one', 'two']);
  });
  it('should return non-array object', () => {
    expect(flatten({ test: true })).toEqual({ test: true });
  });
});
