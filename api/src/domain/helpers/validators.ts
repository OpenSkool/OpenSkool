import { AppInputError } from '../../errors';
import { SchemaInputErrorCode } from '../../schema/constants';

const CHAR_CONTROL = '\u0000-\u001F\u007F-\u009F';
const CHAR_ZERO_WIDTH = '\u200B-\u200D\uFEFF';
const CHAR_REMOVE = new RegExp(`[${CHAR_CONTROL}${CHAR_ZERO_WIDTH}]`, 'g');
const CHARS_MULTIPLE_SEQUENTIAL_SPACES = /\s\s+/g;

export function validateSingleLineString(input: string): string {
  const output = input
    .replace(CHAR_REMOVE, '')
    .replace(CHARS_MULTIPLE_SEQUENTIAL_SPACES, ' ')
    .trim();
  if (output === '') {
    throw new AppInputError(
      SchemaInputErrorCode.VALUE_NOT_VALID,
      'title cannot be empty',
      { path: ['title'] },
    );
  }
  return output;
}
