import { Signal } from '@angular/core';
import { Expect, Equal } from '../test-types';
import { TranslateKeys, TranslationsSignal } from './types';

describe('TranslateKeys', () => {
  it('should generate keys from object type', () => {
    type actual = TranslateKeys<
      {
        a: 'Test';
        b: {
          c: 'Test';
          d: {
            e: 'Test';
          };
        };
      },
      '_'
    >;
    type expected = 'a' | 'b_c' | 'b_d_e';

    type test = Expect<Equal<actual, expected>>;
  });

  it('should ignore special types of objects', () => {
    type actual = TranslateKeys<
      {
        a: 'Test';
        b: unknown[];
        c: Set<unknown>;
        d: Map<unknown, unknown>;
        e: Function;
      },
      '_'
    >;
    type expected = 'a';

    type test = Expect<Equal<actual, expected>>;
  });
});

describe('TranslationsSignal', () => {
  it('should generate signals for each key', () => {
    type input = {
      a: 'Test';
      b: {
        c: 'Test';
        d: {
          e: 'Test';
        };
      };
    };
    type actual = TranslationsSignal<input, '_'>;
    type expected = Signal<input> & {
      readonly a: Signal<string> & { key: 'a' };
      readonly b_c: Signal<string> & { key: 'b_c' };
      readonly b_d_e: Signal<string> & { key: 'b_d_e' };
    };

    type test = Expect<Equal<actual, expected>>;
  });
});
