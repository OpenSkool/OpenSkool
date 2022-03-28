import { describe, expect, test } from 'vitest';

import { validateSingleLineString } from './validators';

describe('validateSingleLineString', () => {
  test('should trim leading and trailing whitespace', async () => {
    expect(validateSingleLineString('  Hello World!   ')).toBe('Hello World!');
  });

  test('should trim excessive spacing to single spacing', async () => {
    expect(validateSingleLineString('Hello  Dear   World!')).toBe(
      'Hello Dear World!',
    );
  });

  test('should remove control and zero width characters', async () => {
    expect(
      validateSingleLineString(
        '\uFEFF \u0000Hello\u001F \u200BWorld\u200D! \u200B',
      ),
    ).toBe('Hello World!');
  });
});
