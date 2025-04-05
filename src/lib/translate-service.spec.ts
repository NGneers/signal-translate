import { TestBed } from '@angular/core/testing';

import { interpolate } from './interpolate';
import { BaseCustomSeperatorTranslateService, BaseTranslateService } from './translate-service';

jest.mock('./interpolate', () => ({
  interpolate: jest.fn((value: string) => `${value} Interpolated`),
}));

const testTranslations = {
  en: {
    a: 'Test A (en)',
    b: {
      c: 'Test C (en)',
      d: {
        e: 'Test E (en)',
      },
    },
  },
  'en-US': {
    a: 'Test A (en-US)',
    b: {
      c: 'Test C (en-US)',
      d: {
        e: 'Test E (en-US)',
      },
    },
  },
  de: {
    a: 'Test A (de)',
    b: {
      c: 'Test C (de)',
      d: {
        e: 'Test E (de)',
      },
    },
  },
};

class EnDeTestService extends BaseCustomSeperatorTranslateService<
  (typeof testTranslations)['en'],
  '_'
> {
  constructor(availableLangs?: readonly string[]) {
    super(availableLangs ?? ['de', 'en', 'en-US'], 'en', '_');
  }

  protected loadTranslations(
    lang: string
  ): Promise<{ a: string; b: { c: string; d: { e: string } } }> {
    return Promise.resolve(testTranslations[lang as 'en' | 'de']);
  }
}

class EnDeTestServiceWithoutSeparator extends BaseTranslateService<
  (typeof testTranslations)['en']
> {
  constructor() {
    super(['de', 'en', 'en-US'], 'en');
  }

  protected loadTranslations(
    lang: string
  ): Promise<{ a: string; b: { c: string; d: { e: string } } }> {
    return Promise.resolve(testTranslations[lang as 'en' | 'de']);
  }
}

let navigatorLanguageSpy: jest.SpyInstance<string, []>;
let sut: EnDeTestService;
let sutWithoutSeparator: EnDeTestServiceWithoutSeparator;

beforeEach(async () => {
  navigatorLanguageSpy = jest.spyOn(window.navigator, 'language', 'get').mockReturnValue('de');
  jest.useFakeTimers();

  sut = TestBed.runInInjectionContext(() => new EnDeTestService());
  sutWithoutSeparator = TestBed.runInInjectionContext(() => new EnDeTestServiceWithoutSeparator());

  TestBed.flushEffects();
  await jest.runAllTimersAsync();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('BaseCustomSeperatorTranslateService', () => {
  it('should initialize correctly', async () => {
    expect(sut.translations()).toEqual(testTranslations['en']);
    expect(sut.translations.b_d_e()).toBe('Test E (en)');
    expect(sut.availableLanguages).toEqual(['de', 'en', 'en-US']);
    expect(sut.language()).toBe('en');
  });

  describe('translate change effect', () => {
    it('should set the document lang tag', async () => {
      expect(document.documentElement.lang).toBe('en');
      sut.setLanguage('de');
      TestBed.flushEffects();
      await jest.runAllTimersAsync();
      expect(document.documentElement.lang).toBe('de');
    });

    it('should load parent language if language is not available', async () => {
      sut.setLanguage('de-DE');
      TestBed.flushEffects();
      await jest.runAllTimersAsync();
      expect(sut.translations()).toEqual(testTranslations['de']);
    });

    it('should use child language if available', async () => {
      sut.setLanguage('en-US');
      TestBed.flushEffects();
      await jest.runAllTimersAsync();
      expect(sut.translations()).toEqual(testTranslations['en-US']);
    });

    it('should use first language if language is not available', async () => {
      sut.setLanguage('fr');
      TestBed.flushEffects();
      await jest.runAllTimersAsync();
      expect(sut.translations()).toEqual(testTranslations['de']);
    });

    it('should use first language if parent language is not available', async () => {
      sut.setLanguage('fr-FR');
      TestBed.flushEffects();
      await jest.runAllTimersAsync();
      expect(sut.translations()).toEqual(testTranslations['de']);
    });

    it('should use english if no available language is provided', async () => {
      const sut = TestBed.runInInjectionContext(() => new EnDeTestService([]));
      sut.setLanguage('fr');
      TestBed.flushEffects();
      await jest.runAllTimersAsync();
      expect(sut.translations()).toEqual(testTranslations['en']);
    });

    it('should not set translations if language changed', async () => {
      sut.setLanguage('de');
      TestBed.flushEffects();
      sut.setLanguage('en');
      await jest.runAllTimersAsync();
      TestBed.flushEffects();
      await jest.runAllTimersAsync();
      expect(sut.translations()).toEqual(testTranslations['en']);
    });
  });

  describe('setLanguage', () => {
    it('should use navigator.language if language is not set', () => {
      const sut = TestBed.runInInjectionContext(() => new EnDeTestService());
      sut.setLanguage(null);
      expect(sut.language()).toBe('de');
    });

    it('should use english if navigator.language is not set', () => {
      navigatorLanguageSpy.mockReturnValue(undefined!);
      const sut = TestBed.runInInjectionContext(() => new EnDeTestService());
      sut.setLanguage(null);
      expect(sut.language()).toBe('en');
    });
  });

  describe('translate', () => {
    it('should translate a key', () => {
      expect(sut.translate('a')).toBe('Test A (en)');
      expect(sut.translate('b_c')).toBe('Test C (en)');
      expect(sut.translate('b_d_e')).toBe('Test E (en)');
    });

    it('should return the key if translation is not found', () => {
      expect(sut.translate('unknown')).toBe('unknown');
    });

    it('should interpolate a key', () => {
      expect(sut.translate('a', { value: 'Interpolated' })).toBe('Test A (en) Interpolated');
      expect(interpolate).toHaveBeenCalledWith('Test A (en)', { value: 'Interpolated' });
    });
  });

  describe('isLanguage', () => {
    it('should return true if language is not set', () => {
      sut.setLanguage(null);
      expect(sut.language()).toBe('de');
      expect(sut.isLanguage(null)).toBe(true);
    });

    it('should return true if language is the same', () => {
      expect(sut.isLanguage('en')).toBe(true);
    });

    it('should return false if language is not the same', () => {
      expect(sut.isLanguage('de')).toBe(false);
    });
  });
});

describe('BaseTranslateService', () => {
  it('should use underscore as separator', () => {
    expect(sutWithoutSeparator.translations.b_d_e()).toBe('Test E (en)');
  });
});
