export function isFunctionKey(key: string): key is Extract<keyof Function, string> {
  return (key in Function.prototype && key !== 'constructor') || key === 'prototype';
}

export function getDeepValue<T extends Record<string, unknown> | undefined>(
  obj: T,
  path: string[]
): unknown {
  return path.reduce<Record<string, unknown> | null | undefined>(
    (xs, x) => xs?.[x] as any,
    obj
  );
}
