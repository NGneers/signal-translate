import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, signal, WritableSignal } from '@angular/core';

import { interpolate } from './interpolate';
import { toTranslationsSignal } from './translations-signal';
import { TranslateKeys, TranslationsSignal } from './types';
import { getTranslation } from './utils';

/**
 * Base class for a translation service.
 * With this instance a custom seperator can be used for the properties of the translate signal.
 */
export abstract class BaseCustomSeperatorTranslateService<
  T extends Record<string, unknown>,
  TSeparator extends string,
> {
  private readonly _translations = signal<T | undefined>(undefined);
  private readonly _language: WritableSignal<string | null>;
  private readonly _separator: TSeparator;
  private readonly _document = inject(DOCUMENT);

  protected readonly browserLanguage = navigator.language ?? 'en';
  protected readonly setDocumentLangTag: boolean = true;

  public readonly translations: TranslationsSignal<T, TSeparator>;
  public readonly availableLanguages: readonly string[];
  public readonly language = computed(() => this._language() ?? this.browserLanguage);

  constructor(
    availableLanguages: readonly string[],
    initialLanguage: string | null,
    separator: TSeparator
  ) {
    this._language = signal(initialLanguage);
    this._separator = separator;
    this.translations = toTranslationsSignal(this._translations, separator);
    this.availableLanguages = availableLanguages;

    effect(() => {
      const lang = this.language();

      if (this.setDocumentLangTag) {
        this._document.documentElement.lang = lang;
      }

      let getTranslations = this.availableLanguages.includes(lang)
        ? () => this.loadTranslations(lang)
        : undefined;
      if (!getTranslations && lang.includes('-')) {
        const parentLang = lang.split('-')[0];
        getTranslations = this.availableLanguages.includes(parentLang)
          ? () => this.loadTranslations(parentLang)
          : undefined;
      }
      if (!getTranslations) {
        getTranslations = () => this.loadTranslations(this.availableLanguages[0] ?? 'en');
      }

      getTranslations().then(translations => {
        if (this.language() === lang) {
          this._translations.set(JSON.parse(JSON.stringify(translations)));
        }
      });
    });
  }

  public translate(
    key: TranslateKeys<T, TSeparator> | Omit<string, TranslateKeys<T, TSeparator>>,
    interpolateParams?: Record<string, unknown> | null | undefined
  ): string {
    const translation = getTranslation(this.translations(), key as string, this._separator);
    return interpolateParams ? interpolate(translation, interpolateParams) : translation;
  }

  public setLanguage(language: string | null) {
    this._language.set(language);
  }

  public isLanguage(language: string | null) {
    return this._language() === language;
  }

  protected abstract loadTranslations(lang: string): Promise<T>;
}

/**
 * Base class for a translation service.
 * With this instance the properties of the translate signal are seperated by an underscore.
 */
export abstract class BaseTranslateService<
  T extends Record<string, unknown>,
> extends BaseCustomSeperatorTranslateService<T, '_'> {
  constructor(availableLanguages: readonly string[], initialLanguage: string | null) {
    super(availableLanguages, initialLanguage, '_');
  }
}
