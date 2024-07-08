import { signal } from '@angular/core';
import { toTranslationsSignal } from './translations-signal';

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
});
