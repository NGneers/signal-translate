import { Pipe, PipeTransform } from '@angular/core';

import { interpolate } from './interpolate';

/**
 * Interpolates a string with the given parameters.
 * @example
 * ```html
 * <p>{{ 'Hello, {{ name }}!' | interpolate: { name: 'World' } }}</p>
 * ```
 */
@Pipe({
  name: 'interpolate',
  standalone: true,
})
export class InterpolatePipe implements PipeTransform {
  public transform(value: string, params: Record<string, unknown> | null | undefined): string {
    return interpolate(value, params);
  }
}
