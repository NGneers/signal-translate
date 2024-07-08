import { getDeepValue } from './utils';

/**
 * Interpolates a string with the given parameters.
 * @param value The string to interpolate. Placeholders are in the form of `{{ key }}`.
 * @param params The parameters to use for interpolation.
 * @returns The interpolated string.
 */
export function interpolate(
  value: string,
  params: Record<string, unknown> | null | undefined
): string {
  if (!params) return value;

  const placeholderRegex = /{{\s*([\w.]+)\s*}}/g;

  let match: RegExpExecArray | null;
  let result = '';
  let lastIndex = 0;
  while ((match = placeholderRegex.exec(value))) {
    const [placeholder, key] = match;
    result += value.slice(lastIndex, match.index) + String(getDeepValue(params, key.split('.')));
    lastIndex = match.index + placeholder.length;
  }

  return result + value.slice(lastIndex);
}
