import { signal } from '@angular/core';
import { toTranslationsSignal } from './translations-signal';
import { interpolate } from './interpolate';

jest.mock('./interpolate', () => ({
  interpolate: jest.fn((value: string) => `${value} Interpolated`),
}));

const testTranslations = {
  a: 'Test A',
  b: {
    c: 'Test C',
    d: {
      e: 'Test E',
    },
  },
};

describe('toTranslationsSignal', () => {
  it('should generate signals for each key', () => {
    const originalSignal = signal(testTranslations);
    const translations = toTranslationsSignal(originalSignal, '_');

    expect(translations.name).toBe(originalSignal.name);
    expect(translations()).toBe(testTranslations);
    expect(translations.a()).toBe('Test A');
    expect(translations.a.key).toBe('a');
    expect(translations.b_c()).toBe('Test C');
    expect(translations.b_c.key).toBe('b_c');
    expect(translations.b_d_e()).toBe('Test E');
    expect(translations.b_d_e.key).toBe('b_d_e');
  });

  it('should return empty string for unknown keys', () => {
    const originalSignal = signal(testTranslations);
    const translations = toTranslationsSignal(originalSignal, '_') as any;

    expect(translations.unknown()).toBe('');
  });

  it('should return undefined for unknown keys with wrong type', () => {
    const originalSignal = signal(testTranslations);
    const translations = toTranslationsSignal(originalSignal, '_') as any;

    expect(translations[Symbol()]).toBeUndefined();
  });

  it('should provide a way to get translations using unsafe key', () => {
    const originalSignal = signal(testTranslations);
    const translations = toTranslationsSignal(originalSignal, '_');

    expect(translations._unsafe.a()).toBe('Test A');
    expect(translations._unsafe.a.key).toBe('a');
  });

  it('should not create a new signal for the same key', () => {
    const originalSignal = signal(testTranslations);
    const translations = toTranslationsSignal(originalSignal, '_');

    const a1 = translations.a;
    const a2 = translations.a;
    const a3 = translations._unsafe.a;

    expect(a1).toBe(a2);
    expect(a1).toBe(a3);
  });

  it('should interpolate values', () => {
    const originalSignal = signal(testTranslations);
    const translations = toTranslationsSignal(originalSignal, '_');

    const interpolateParams = { data: 'hello' };
    expect(translations.a(interpolateParams)).toBe('Test A Interpolated');

    expect(interpolate).toHaveBeenCalledWith('Test A', interpolateParams);
  });
});
