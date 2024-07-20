import { getDeepValue, getTranslation, isFunctionKey } from './utils';

describe('isFunctionKey', () => {
  it('should return true if key is a function key', () => {
    expect(isFunctionKey('name')).toBe(true);
    expect(isFunctionKey('arguments')).toBe(true);
    expect(isFunctionKey('length')).toBe(true);
    expect(isFunctionKey('toString')).toBe(true);
    expect(isFunctionKey('call')).toBe(true);
    expect(isFunctionKey('caller')).toBe(true);
    expect(isFunctionKey('apply')).toBe(true);
    expect(isFunctionKey('bind')).toBe(true);
    expect(isFunctionKey('prototype')).toBe(true);
  });

  it('should return false if key is not a function key', () => {
    expect(isFunctionKey('key')).toBe(false);
  });
});

describe('getDeepValue', () => {
  it('should return the deep value of an object', () => {
    const obj = {
      a: {
        b: {
          c: 'value',
        },
      },
    };
    expect(getDeepValue(obj, ['a', 'b', 'c'])).toBe('value');
  });

  it('should return the deep falsy value of an object', () => {
    const obj = {
      a: {
        b: {
          c: 0,
        },
      },
    };
    expect(getDeepValue(obj, ['a', 'b', 'c'])).toBe(0);
  });

  it('should return undefined if the path does not exist', () => {
    const obj = {
      a: {
        b: {
          c: 'value',
        },
      },
    };
    expect(getDeepValue(obj, ['a', 'b', 'd'])).toBe(undefined);
  });

  it('should return undefined if the object is undefined', () => {
    expect(getDeepValue(undefined, ['a', 'b', 'c'])).toBe(undefined);
  });
});

describe('getTranslation', () => {
  it('should return the translation of a key', () => {
    const translations = {
      a: 'Test A',
      b: {
        c: 'Test C',
        d: {
          e: 'Test E',
        },
      },
    };
    expect(getTranslation(translations, 'a', '_')).toBe('Test A');
    expect(getTranslation(translations, 'b_c', '_')).toBe('Test C');
    expect(getTranslation(translations, 'b_d_e', '_')).toBe('Test E');
  });

  it('should return the key if the translation is not found', () => {
    const translations = {};
    expect(getTranslation(translations, 'unknown', '_')).toBe('unknown');
  });
});
