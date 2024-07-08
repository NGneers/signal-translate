import { interpolate } from './interpolate';
import { InterpolatePipe } from './interpolate.pipe';

jest.mock('./interpolate');

describe('InterpolatePipe', () => {
  it('should call interpolate with the given value and params', () => {
    const pipe = new InterpolatePipe();
    const value = 'Hello, {{ name }}!';
    const params = { name: 'World' };
    (interpolate as jest.Mock).mockReturnValue('Hello, World!');

    const actual = pipe.transform(value, params);

    expect(interpolate).toHaveBeenCalledWith(value, params);
    expect(actual).toBe('Hello, World!');
  });
});
