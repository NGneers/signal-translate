import { computed, Signal } from '@angular/core';

import { interpolate } from './interpolate';
import { TranslationSignal, TranslationsSignal } from './types';
import { getTranslation } from './utils';

export function toTranslationsSignal<
  T extends Record<string, unknown>,
  TSeparator extends string = '_',
>(signal: Signal<T | undefined>, separator: TSeparator): TranslationsSignal<T, TSeparator> {
  return new Proxy(signal, {
    get(target: Signal<T | undefined> & Record<string | symbol, unknown>, prop) {
      if (prop in target) {
        return target[prop];
      }

      if (typeof prop !== 'string') {
        return undefined;
      }

      if (prop === '_unsafe') {
        const unsafe = new Proxy(target, this);
        Object.defineProperty(unsafe, '_unsafe', { value: unsafe });
        return unsafe;
      }

      const valueSig = computed(() => getTranslation(target(), prop, separator));
      const sig: TranslationSignal = Object.assign(
        (interpolateParams: Record<string, unknown> | null | undefined) => {
          return interpolateParams ? interpolate(valueSig(), interpolateParams) : valueSig();
        },
        valueSig,
        { key: prop }
      );

      Object.defineProperty(target, prop, { value: sig });

      return sig;
    },
  }) as TranslationsSignal<T, TSeparator>;
}
