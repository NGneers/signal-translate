import { interpolate } from './interpolate';

describe('interpolate', () => {
  it('should interpolate a string with the given parameters', () => {
    const value = 'Hello, {{ name }}!';
    const params = { name: 'World' };
    const expected = 'Hello, World!';

    const actual = interpolate(value, params);

    expect(actual).toBe(expected);
  });

  it('should interpolate a string with multiple parameters', () => {
    const value = '{{ a }} + {{ b }} = {{ c }}';
    const params = { a: 1, b: 2, c: 3 };
    const expected = '1 + 2 = 3';

    const actual = interpolate(value, params);

    expect(actual).toBe(expected);
  });

  it('should interpolate a string with a nested parameter', () => {
    const value = 'Hello, {{ user.name }}!';
    const params = { user: { name: 'World' } };
    const expected = 'Hello, World!';

    const actual = interpolate(value, params);

    expect(actual).toBe(expected);
  });

  it('should interpolate a string with undefined if key does not exist', () => {
    const value = 'Hello, {{ user.name }}!';
    const params = { user: {} };
    const expected = 'Hello, undefined!';

    const actual = interpolate(value, params);

    expect(actual).toBe(expected);
  });

  it('should return original string if params is null', () => {
    const value = 'Hello, {{ name }}!';
    const params = null;
    const expected = 'Hello, {{ name }}!';

    const actual = interpolate(value, params);

    expect(actual).toBe(expected);
  });

  it('should return original string if params is undefined', () => {
    const value = 'Hello, {{ name }}!';
    const params = null;
    const expected = 'Hello, {{ name }}!';

    const actual = interpolate(value, params);

    expect(actual).toBe(expected);
  });
});
