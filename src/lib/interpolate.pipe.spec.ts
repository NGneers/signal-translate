import { InterpolatePipe } from './interpolate.pipe';

describe('InterpolatePipe', () => {
  it('should interpolate the given value with the params', () => {
    const pipe = new InterpolatePipe();

    const actual = pipe.transform('Hello, {{ name }}!', { name: 'World' });

    expect(actual).toBe('Hello, World!');
  });
});
