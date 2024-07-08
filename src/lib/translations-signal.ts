import { computed, Signal } from '@angular/core';

import { TranslationsSignal } from './types';
import { getDeepValue, isFunctionKey } from './utils';

export function toTranslationsSignal<
  T extends Record<string, unknown>,
  TSeparator extends string = '_',
>(signal: Signal<T | undefined>, separator: TSeparator): TranslationsSignal<T, TSeparator> {
  return new Proxy(signal, {
    get(target: Signal<T | undefined> & Record<string | symbol, unknown>, prop) {
      if (typeof prop !== 'string' || isFunctionKey(prop)) {
        return target[prop];
      }
      const sig = computed(() => getDeepValue(target(), prop.split(separator)));
      Object.defineProperty(sig, 'key', { value: prop });
      return sig;
    },
  }) as TranslationsSignal<T, TSeparator>;
}
