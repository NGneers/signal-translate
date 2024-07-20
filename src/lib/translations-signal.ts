import { computed, Signal } from '@angular/core';

import { TranslationSignal, TranslationsSignal } from './types';
import { getDeepValue } from './utils';

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

      const valueSig = computed(() => String(getDeepValue(target(), prop.split(separator)) ?? ''));
      const sig: TranslationSignal = Object.assign(valueSig, { key: prop });

      Object.defineProperty(target, prop, { value: sig });

      return sig;
    },
  }) as TranslationsSignal<T, TSeparator>;
}
