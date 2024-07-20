import { Signal } from '@angular/core';

export type TranslateKeys<T, TSeparator extends string> = T extends object
  ? T extends unknown[]
    ? never
    : T extends Set<unknown>
      ? never
      : T extends Map<unknown, unknown>
        ? never
        : T extends Function
          ? never
          : {
              [K in keyof T]: K extends string
                ? T[K] extends string
                  ? K
                  : `${K}${TSeparator}${TranslateKeys<T[K], TSeparator>}`
                : never;
            }[keyof T]
  : never;

export type TranslationSignal<TKey extends string = string> = Signal<string> & { key: TKey } & ((
    interpolateParams: Record<string, unknown> | null | undefined
  ) => string);

export type TranslationsSignal<
  T extends Record<string, unknown>,
  TSeparator extends string,
> = Signal<T> & {
  readonly [K in TranslateKeys<T, TSeparator>]: TranslationSignal<K>;
} & {
  readonly _unsafe: Readonly<Record<string, TranslationSignal>>;
};
