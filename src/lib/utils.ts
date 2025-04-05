// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunctionKey(key: string): key is Extract<keyof Function, string> {
  return (key in Function.prototype && key !== 'constructor') || key === 'prototype';
}

export function getDeepValue<T extends Record<string, unknown> | undefined>(
  obj: T,
  path: string[]
): unknown {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.reduce<unknown>((xs, x) => (xs as any)?.[x], obj);
}

export function getTranslation<T extends Record<string, unknown> | undefined>(
  translations: T,
  key: string,
  separator: string
): string {
  return String(getDeepValue(translations, key.split(separator)) ?? key);
}
